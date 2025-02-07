MPEG7 Visual Descriptors

Explaining by visuals

backend: fastAPI
frontned: Vue.js + d3.js

Python functions:

Dominant Color Descriptor

get_dominant_color(request: ClusterImageRequest) -> ClusterImageResponse
- gets image and number of clusters
- returns processed image colored by only the dominant colors, along with a list of dominant colors and their percentage of pixels belonging to this color.
- uses KMeans from sklearn.cluster

Illustation functions
color_layout_descriptor_grid(request : ImageRequest) -> TODO
TODO add example images before and after this function
- returns the processed img with 32 x 32 blocks with average color


Color Layout Descriptor

color_layout_descriptor(request: ColorLayoutImageRequest)
- return dict with y, cb and cr keys, which contain list of the coeffitients
- uses 8x8 blocks

Scalable C Descriptor
get_scd_histogram

scd(request: ImageRequest)


helper functions
get_average_color

zigzag_traversal


y_cb_cr_channels
- returns 3 images as dictionary, one of only Y, one with on Cb, one with Cr

quantize_hsv

