from fastapi import FastAPI, HTTPException
import requests
import numpy as np
import cv2
from pydantic import BaseModel
from sklearn.cluster import KMeans
import base64
import pywt
from fastapi import Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
api = FastAPI()


api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageRequest(BaseModel):
    image_url: str

class ScdHistogramRequest(ImageRequest):
    value: int

class ClusterImageRequest(ImageRequest):
    clusters: int

class ColorLayoutImageRequest(ImageRequest):
    dct: int #number of dct coefficients

class ClusterImageResponse(BaseModel):
    dominant_colors: list
    processed_image: str


@api.post("/dominant_color")
async def dominant_color_descriptor(request: ClusterImageRequest):
    try:
        # fetch img from url
        response = requests.get(request.image_url)
        response.raise_for_status()

        # convert to openCV format
        image_data = response.content
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # BGR to RGB

        pixels = image.reshape((-1, 3))

        km = KMeans(n_clusters=request.clusters)
        km.fit(pixels)

        # make colors and percentages JSON-serializable
        colors = np.asarray(km.cluster_centers_, dtype='uint8').tolist()  # to list
        percentage = (
            np.asarray(np.unique(km.labels_, return_counts=True)[1], dtype='float32') / pixels.shape[0]
        ).tolist()

        dom = [[percentage[ix], colors[ix]] for ix in range(km.n_clusters)]
        dominance = sorted(dom, key=lambda x:x[0], reverse=True)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        for px in range(pixels.shape[0]):
            for _ in range(len(colors)):
                pixels[px] =colors[km.labels_[px]]

        processed_image = pixels.reshape(image.shape)

        processed_image_bgr = cv2.cvtColor(processed_image, cv2.COLOR_RGB2BGR)

        # encode the processed image to JPEG
        _, buffer = cv2.imencode('.jpg', processed_image_bgr)

        image_base64 = base64.b64encode(buffer).decode('utf-8')

        response_data = {
            "dominant_colors": [
                {"color": dominance[ix][1], "percentage": dominance[ix][0]}
                for ix in range(len(dominance))
            ],
            "processed_image": image_base64
        }

        return response_data


    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching image: {e}")
    

def get_average_color(block):
    # Calculate the average color in BGR format
    avg_color = np.mean(block, axis=(0, 1))  # Take mean along rows and columns
    return tuple(avg_color)


@api.post("/color_layout_grid")
async def color_layout_descriptor_grid(request : ImageRequest):
    print("Color Layout Descriptor")
    response = requests.get(request.image_url)
    response.raise_for_status()

    image_data = response.content

    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Get the image dimensions
    height, width, _ = image.shape

    # Create a new image that will be filled with the average colors of each block
    processed_img = np.zeros_like(image)

    # Loop through the image in steps of 8x8 blocks
    block_size = 32
    for y in range(0, height, block_size):
        for x in range(0, width, block_size):
            block = image[y:y+block_size, x:x+block_size]
            
            # average color of the block
            avg_color = get_average_color(block)
            
            # Fill the corresponding block in the processed image with the average color
            processed_img[y:y+block_size, x:x+block_size] = avg_color

    # encode the image to JPEG
        _, buffer = cv2.imencode('.jpg', processed_img)

        image_base64 = base64.b64encode(buffer).decode('utf-8')

        response_data = {
            "processed_image": image_base64
        }
    
    return response_data


def zigzag_traversal(matrix):
    """ Get elements in zigzag order (used to extract low-frequency DCT coefficients) """
    rows, cols = matrix.shape
    result = []
    sum_to_indices = {}
    
    # Collect indices in zigzag order
    for i in range(rows + cols - 1):
        sum_to_indices[i] = []
    
    for r in range(rows):
        for c in range(cols):
            sum_to_indices[r + c].append((r, c))
    
    # Extract values in zigzag order
    for k, indices in sum_to_indices.items():
        if k % 2 == 0:
            indices.reverse()  # Reverse even-indexed diagonals for correct zigzag order
        for r, c in indices:
            result.append(matrix[r, c])
    
    return np.array(result)

    
@api.post("/color_layout_descriptor")
async def color_layout_descriptor(request: ColorLayoutImageRequest):
    """ Compute the Color Layout Descriptor (CLD) for an image """

    num_coefficients = request.dct

    response = requests.get(request.image_url)
    response.raise_for_status()

    image_data = response.content

    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (64, 64))
    
    # YCbCr
    img_ycbcr = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)

    # channels
    Y, Cb, Cr = cv2.split(img_ycbcr)

    block_size = 8
    num_blocks = 8  # 8x8 blocks
    avg_Y = np.zeros((num_blocks, num_blocks))
    avg_Cb = np.zeros((num_blocks, num_blocks))
    avg_Cr = np.zeros((num_blocks, num_blocks))

    # avg color per block
    for i in range(num_blocks):
        for j in range(num_blocks):
            y_start, y_end = i * block_size, (i + 1) * block_size
            x_start, x_end = j * block_size, (j + 1) * block_size
            
            avg_Y[i, j] = np.mean(Y[y_start:y_end, x_start:x_end])
            avg_Cb[i, j] = np.mean(Cb[y_start:y_end, x_start:x_end])
            avg_Cr[i, j] = np.mean(Cr[y_start:y_end, x_start:x_end])

    # Discrete Cosine Transform (DCT)
    dct_Y = cv2.dct(avg_Y)
    dct_Cb = cv2.dct(avg_Cb)
    dct_Cr = cv2.dct(avg_Cr)

    # Coefficients in zigzag order -> keep the first `num_coefficients`
    zigzag_Y = np.round(zigzag_traversal(dct_Y)[:num_coefficients], 2)
    zigzag_Cb = np.round(zigzag_traversal(dct_Cb)[:num_coefficients], 2)
    zigzag_Cr = np.round(zigzag_traversal(dct_Cr)[:num_coefficients], 2)
    
    return {"y": zigzag_Y.tolist(), "cb": zigzag_Cb.tolist(), "cr": zigzag_Cr.tolist()}

@api.post("/y_cb_cr_channels")
async def y_cb_cr_channels(request: ImageRequest):
    response = requests.get(request.image_url)
    response.raise_for_status()

    image_data = response.content

    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    ycbcr = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    Y, Cb, Cr = cv2.split(ycbcr)

    # normalize Cb and Cr for visualization (they are centered around 128)
    Cb_display = cv2.normalize(Cb, None, 0, 255, cv2.NORM_MINMAX)
    Cr_display = cv2.normalize(Cr, None, 0, 255, cv2.NORM_MINMAX)

    # Create grayscale images where only one channel is visible
    Y_img = cv2.merge([Y, Y, Y])  # Y as grayscale
    Cb_img = cv2.merge([Cb_display, np.zeros_like(Cb), np.zeros_like(Cb)])  # Cb in blue
    Cr_img = cv2.merge([np.zeros_like(Cr), np.zeros_like(Cr), Cr_display])  # Cr in red

    _, buffer_y = cv2.imencode('.jpg', Y_img)
    image_base64_y = base64.b64encode(buffer_y).decode('utf-8')
    _, buffer_cb = cv2.imencode('.jpg', Cb_img)
    image_base64_cb = base64.b64encode(buffer_cb).decode('utf-8')
    _, buffer_cr = cv2.imencode('.jpg', Cr_img)
    image_base64_cr = base64.b64encode(buffer_cr).decode('utf-8')
    response_data = {
            "y": image_base64_y,
            "cb": image_base64_cb,
            "cr": image_base64_cr
        }

    return response_data

@api.post("/scd_histogram")
async def get_scd_histogram(request: ScdHistogramRequest):

    response = requests.get(request.image_url)
    response.raise_for_status()

    q = request.value

    image_data = response.content

    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # HSV
    hsv_image = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Extract hue channel
    hue_channel = hsv_image[:, :, 0]

    # 256 bin hue histogram
    histogram = cv2.calcHist([hue_channel], [0], None, [q], [0, q])

    # normalize for visualization
    histogram = cv2.normalize(histogram, histogram, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)

    histogram_list = histogram.flatten().tolist()
    response_data = {
        "histogram": histogram_list
    }

    return response_data

@api.post("/scd_visualization")
def scalable_color_descriptor(request: ScdHistogramRequest):
    try:
        resp = requests.get(request.image_url)
        resp.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {e}")

    image_data = resp.content
    num_coefficients = request.value
    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image.")

    channels = cv2.split(image)

    reconstructed_channels = []
    for ch in channels:
        # convert the channel to float32 for wavelet
        ch = ch.astype(np.float32)
        # 2d haar
        coeffs = pywt.wavedec2(ch, 'haar', level=None)
        arr, coeff_slices = pywt.coeffs_to_array(coeffs)
        flat_coeffs = arr.flatten()
        # keep only first `num_coefficients`
        truncated_flat = np.zeros_like(flat_coeffs)
        truncated_flat[:num_coefficients] = flat_coeffs[:num_coefficients]
        # reshape the truncated array back to the original coefficient array shape
        truncated_arr = truncated_flat.reshape(arr.shape)
        # convert the truncated array back to the coefficients list format
        new_coeffs = pywt.array_to_coeffs(truncated_arr, coeff_slices, output_format='wavedec2')
        # reconstruct the channel from the truncated coefficients
        approx_ch = pywt.waverec2(new_coeffs, 'haar')
        # crop if needed
        approx_ch = approx_ch[:ch.shape[0], :ch.shape[1]]
        # adjust pixel values to [0, 255] and convert to uint8
        approx_ch = np.clip(approx_ch, 0, 255).astype(np.uint8)
        reconstructed_channels.append(approx_ch)

    approx_image = cv2.merge(reconstructed_channels)

    _, buffer = cv2.imencode('.jpg', approx_image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    response_data = {
            "processed_image": image_base64
        }

    return response_data


@api.post("/scalable_color_descriptor")
def compute_scd(request: ImageRequest):
    try:
        resp = requests.get(request.image_url)
        resp.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {e}")

    image_data = resp.content
    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image.")
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # hue: 16 bins in [0, 180]
    # saturation: 4 bins in [0, 256]
    # value: 4 bins in [0, 256]
    h_bins = np.linspace(0, 180, 17)  # 17 edges -> 16 bins
    s_bins = np.linspace(0, 256, 5)   # 5 edges -> 4 bins
    v_bins = np.linspace(0, 256, 5)   # 5 edges -> 4 bins
    bins = [h_bins, s_bins, v_bins]

    # reshape pixels
    pixels = hsv_image.reshape(-1, 3)
    hist, _ = np.histogramdd(pixels, bins=bins)
    hist_flat = hist.flatten()

    # normalize histogram
    if hist_flat.sum() != 0:
        hist_flat = hist_flat / hist_flat.sum()

    # apply haar
    coeffs = pywt.wavedec(hist_flat, 'haar', level=None)
    flat_coeffs = np.concatenate([c.flatten() for c in coeffs])

    # apply non-linear quantization here.
    # in this case only round to 4 decimal places
    quantized_coeffs = np.round(flat_coeffs, decimals=4)

    return {"scalable_color_descriptor": quantized_coeffs.tolist()[0:6]}

app.mount("/api", api)
app.mount("/", StaticFiles(directory="static", html=True), name="static")
