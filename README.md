# MPEG7 Visual Descriptors

Explaining by visuals

**backend**: fastAPI

**frontend**: Vue.js + d3.js


## Python backend functions:

### Dominant Color Descriptor

**dominant_color_descriptor**(request: ClusterImageRequest)
- gets image and number of clusters as an input
- returns processed image colored by only the dominant colors, along with a list of dominant colors and their percentage of pixels belonging to this color.
- uses KMeans from sklearn.cluster

### Color Layout Descriptor

**color_layout_descriptor**(request: ColorLayoutImageRequest)
- gets an image and a number of coefficients as an input
- returns dict with 'y', 'cb' and 'cr' keys, each of which contains a list with the CLD coefficients
- uses 8x8 blocks

**color_layout_descriptor_grid**(request : ImageRequest)
- gets image as an input
- returns processed image with 32 x 32 blocks with average color

**y_cb_cr_channels**(request : ImageRequest)
- gets image as an input
- returns dictionary with keys 'y', 'cb', 'cr', each key contains a processed image with only the corresponding channel


### Scalable Color Descriptor

**scd_histogram**(request: ScdHistogramRequest)
- gets an image and a number of bins
- returns histogram values for Hue quantized into the corresponsing number of bins

**scd_visualization**(request: ScdHistogramRequest)
- gets and image and a number of coefficients it should retain
- returns a processed image
- the image is created by using SCD direcly on the image (not on its histogram) and then applying inverse Haar transform while retaining only first given number of coefficients


**scalable_color_descriptor(request: ImageRequest)**
- gets an image as input
- returns a list of first 6 scalable color descriptor coefficients, rounded to 4 decimal places

