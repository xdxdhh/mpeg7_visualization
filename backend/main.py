from fastapi import FastAPI, HTTPException
import requests
import numpy as np
import io
import cv2
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sklearn.cluster import KMeans
import base64


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for your production environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


class ImageRequest(BaseModel):
    image_url: str

class ClusterImageRequest(ImageRequest):
    clusters: int

class ClusterImageResponse(BaseModel):
    dominant_colors: list
    processed_image: str
    

@app.post("/dominant_color/")
async def process_image(request: ClusterImageRequest) -> ClusterImageResponse:
    try:
        # Fetch the image from the provided URL
        response = requests.get(request.image_url)
        response.raise_for_status()

        # Convert the image to a format OpenCV can handle
        image_data = response.content
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) #Convert from BGR to RGB

        pixels = image.reshape((-1, 3))
        print(pixels.shape)
        print(image.shape)

        print(request.clusters)

        km = KMeans(n_clusters=request.clusters)
        km.fit(pixels)

        # Ensure colors and percentages are JSON-serializable
        colors = np.asarray(km.cluster_centers_, dtype='uint8').tolist()  # Convert to list
        percentage = (
            np.asarray(np.unique(km.labels_, return_counts=True)[1], dtype='float32') / pixels.shape[0]
        ).tolist()

        dom = [[percentage[ix], colors[ix]] for ix in range(km.n_clusters)]
        dominance = sorted(dom, key=lambda x:x[0], reverse=True)
        print(dominance)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        for px in range(pixels.shape[0]):
            for ix in range(len(colors)):
                pixels[px] =colors[km.labels_[px]]

        processed_image = pixels.reshape(image.shape)

        processed_image_bgr = cv2.cvtColor(processed_image, cv2.COLOR_RGB2BGR)

        # Encode the processed image to JPEG
        _, buffer = cv2.imencode('.jpg', processed_image_bgr)
        #io_buf = io.BytesIO(buffer)

        image_base64 = base64.b64encode(buffer).decode('utf-8')

        # Prepare the response
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


@app.post("/color_layout_grid/")
async def color_layout_descriptor_grid(request : ImageRequest):
    print("Color Layout Descriptor")
    response = requests.get(request.image_url)
    response.raise_for_status()

    image_data = response.content

    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Get the image dimensions
    height, width, _ = image.shape
    print("Image Shape: ", image.shape)

    # Create a new image that will be filled with the average colors of each block
    processed_img = np.zeros_like(image)

    # Loop through the image in steps of 8x8 blocks
    block_size = 32
    for y in range(0, height, block_size):
        for x in range(0, width, block_size):
            # Define the block
            block = image[y:y+block_size, x:x+block_size]
            
            # Compute the average color of the block
            avg_color = get_average_color(block)
            
            # Fill the corresponding block in the processed image with the average color
            processed_img[y:y+block_size, x:x+block_size] = avg_color

    # Encode the processed image to JPEG
        _, buffer = cv2.imencode('.jpg', processed_img)

        image_base64 = base64.b64encode(buffer).decode('utf-8')

        response_data = {
            "processed_image": image_base64
        }
    
    return response_data

