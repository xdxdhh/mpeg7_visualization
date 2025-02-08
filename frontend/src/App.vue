<template>
  <div id="app">
    <header>MPEG-7 Visual Descriptors</header>
    <h2 class="big">What are they and how do they work?</h2>
    <h3 class="medium">Explaining by visuals by Diana Varšíková</h3>
    <main>
      <p>
        MPEG-7 is a multimedia content description standard designed to provide a structured and rich
        representation of multimedia data, such as images, audio, and video. It serves as a framework for
        efficiently organizing and retrieving multimedia content, making it easier to search and analyze large
        datasets. In the context of images, MPEG-7 defines a set of
        <span style="font-weight: bold">image descriptors</span>, which are features that describe and
        identify visual characteristics of images.
      </p>
      <p class="medium">It all begins with an image...Pick one.</p>
      <div class="thumbnails">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image.src"
          :alt="image.alt"
          :class="{
            selected: selectedImage === index,
            faded: selectedImage !== null && selectedImage !== index,
          }"
          @click="selectImage(index)"
        />
      </div>
      source: Unsplash Gallery
      <div v-if="selectedImage != null" class="dig-in">Let's dig in.</div>
      <!-- <div>Let's start with the simplest one.</div> -->
      <div v-if="selectedImage != null" class="dcd">
        <div class="big">Dominant Color Descriptor</div>
        <div>
          The
          <span style="font-weight: bold">Dominant Color Descriptor (DCD) </span>is one of the simplest yet
          key image descriptors defined in MPEG-7. It focuses on identifying the most significant colors in
          the image and analyzing their distribution.
        </div>
        <div>
          Each pixel in the image is represented by its
          <span style="font-weight: bold">RGB</span> values (Red, Green, Blue), with each channel ranging from
          0 to 255. Together, these three values define a single point in the 3D RGB color space.
        </div>
        <div id="pixel"></div>
        <div>
          The entire image consists of a large number of pixels. For instance, the images used on this webpage
          have dimensions of 384x256, resulting in <span style="font-weight: bold">98,304 pixels</span>. If
          you imagine each pixel's color as a point in 3D space, the entire image forms a cloud of points
          within the RGB color space.
        </div>
        <div id="rgb3d"></div>
        <div>
          To identify the dominant colors, we need to group similar colors together. This is done using a
          technique called clustering. Clustering algorithms group the pixels into a fixed number of so-called
          clusters, based on their color similarity.
        </div>
        <div id="rgb3d-circles"></div>
        <div>
          From each cluster, one 'average' pixel is created, this pixel is called the
          <span style="font-weight: bold">centroid</span> of the cluster and it captures the average color of
          all the pixels that belong to that cluster.
        </div>
        <div id="avg-pixel"></div>

        <div>
          This is done for all the clusters, and the average colors then form the Visual Color Descriptor. The
          importance of the cluster is determined by the number of pixels it contains. We can usually choose
          the number of clusters we want to group the points into. The more clusters, the more detailed the
          descriptor.
        </div>
        <p class="medium">Try it with your image.</p>
        <img
          v-if="selectedImage !== null"
          :src="images[selectedImage].src"
          :alt="images[selectedImage].alt"
        />
        <!-- Slider for selecting number of clusters -->
        <div>
          <input
            class="slider"
            id="cluster-slider"
            type="range"
            min="2"
            max="8"
            v-model="nDomColors"
            @input="getDominantColorsDescriptor"
          />
        </div>
        <div>Number of Clusters: {{ nDomColors }}</div>
        <div id="dominant-colors"></div>
        <div>
          We can then reconstruct the image using only the dominant colors by assigning each pixel to the
          closest centroid. In general, 8 clusters is considered a good enough approximation of the image.
        </div>
      </div>
      <img id="reconstructedDominant" />
      <div v-if="selectedImage != null" class="scd">
        <div class="big">Scalable Color Descriptor</div>
        <div>
          This time, the pixels are represented not in the RGB space, but in
          <span style="font-weight: bold">HSV (Hue, Saturation, Value) </span>
          space. Hue represents the type of color (e.g. red, green, blue), Saturation represents the intensity
          of the color, and Value represents its brightness.
        </div>
        <img
          src="./assets/hsv.svg"
          style="width: 300px; height: auto; margin-bottom: 20px; margin-top: 20px"
        />
        <div>
          The HSV space is divided into a fixed number of bins, and each pixel is assigned to one of them,
          based on its proximity in HSV space. Usually Hue is quantized into 16 bins, Saturation and Value
          into 4 bins each, getting a total number of 256 bins. The number of pixels that belong to each bin
          then form a histogram.
        </div>
        <div class="medium">You can see the histogram for Hue in your image below.</div>
        <div id="scd-histogram"></div>
        <div class="slider-container">
          <input
            type="range"
            min="16"
            max="240"
            step="16"
            v-model="nScdHistBins"
            @input="getScdHistogram"
            class="slider"
            style="width: 100%"
          />
          <div class="tick-labels">
            <span v-for="value in ScdHistValues" :key="value" class="tick-label">
              {{ value }}
            </span>
          </div>
          <div>Number of bins</div>
        </div>
        <div>This 256-bin histogram in HSV space is then</div>
        <div>
          This 256-bin histogram in HSV space is then transformed using
          <span style="font-weight: bold">Haar Wavelet Transform</span>. This transformation captures both
          low-frequency (overall color distribution) and high-frequency (fine details) information. At the
          end, we obtain a set of coefficients that represent the image in a more compact way. We can choose
          how many coefficients we want to keep (that's where the "scalable" part comes in).
        </div>
        <img
          src="./assets/scd_haar.svg"
          style="width: 500px; height: auto; margin-bottom: 20px; margin-top: 20px"
        />

        <div class="medium">Here you see the first 6 coefficients for your image.</div>
        <div style="margin-bottom: 20px">
          <span style="font-weight: bold">{{ scalableColorDescriptor }}</span>
        </div>
        <div>
          Not very informative, right? But the more coefficients we keep, the more detailed the descriptor
          will be. To see it, we can visualize the image reconstructed from the kept coefficients, if we used
          Haar transform directly on the image (and not the histogram).
        </div>
        <div class="medium">Try it.</div>
        <div>
          <input
            class="slider"
            id="scd-slider"
            type="range"
            min="1"
            max="50001"
            step="1000"
            v-model="nScdCoeffs"
            @input="getScdVisualization"
          />
        </div>
        <!-- <div>Number of Coefficients: {{ nScdCoeffs }}</div> -->
        <img id="scdVisualization" />
      </div>
      <div v-if="selectedImage != null" class="cld">
        <div class="big">Color Layout Descriptor</div>
        <div style="margin-bottom: 20px">
          This time we want to describe an image not just by its colors but also by where those colors appear.
          For example, if you have an image of a sunset, you wouldn't just say "orange and blue"—you'd also
          want to capture that orange is at the bottom and blue is at the top. The
          <span style="font-weight: bold">Color Layout Descriptor</span> (CLD) does exactly that.
        </div>
        <div>
          Instead of analyzing every single pixel (which would be too much data), we split the image into a
          grid of (in this case) 32&nbsp;x&nbsp;32 blocks. Each block represents a small region of the image.
        </div>
        <div id="image-grid"></div>
        <div>
          For each block, we calculate the average color—essentially compressing all the pixels in the block
          into a single color value. So, if a block contains mostly shades of blue, we replace it with a
          single average blue color. Think of this like reducing an HD image into a very low-resolution
          version where each block is a single color. The selection results in a tiny image icon of size
          12&nbsp;x&nbsp;8 pixels.
        </div>
        <img id="gridAvg" />
        <div>
          Afterwards, this simplified image is transformed into
          <span style="font-weight: bold">YCbCr</span> space (yes, yet another colorspace), which separates
          brightness (luma) from color (chroma). This color space was developed in the era of first color TVs
          for backwards compatibility with black and white TVs, allowing older TVs to ignore the color
          information. The Y channel represents the grayscale version of the image, while Cb and Cr store the
          blue and red chrominance components, respectively.
        </div>
        <div class="medium">See the three channels below.</div>
        <div class="y_cb_cr_container" style="margin-bottom: 20px; margin-top: 20px">
          <img class="channels_img" id="y_cb_cr_channels_y" />
          <img class="channels_img" id="y_cb_cr_channels_cb" />
          <img class="channels_img" id="y_cb_cr_channels_cr" />
        </div>
        <div>
          After getting the representation in YCbCr space, we apply the
          <span style="font-weight: bold">Discrete Cosine Transform (DCT)</span>
          to the YCbCr image. The DCT is a mathematical technique that transforms the image into a three sets
          of 96 coefficients (depends on the dimension of the simplified image).
        </div>
        <div>
          The more DCT coefficients we keep, the more detailed the descriptor will be. To choose the
          coefficients we want to keep, zig-zag scanning is used. It is a special way of reading the
          coefficients, where the low-frequency coefficients are read first, followed by the high-frequency
          ones. The path is illustrated below.
        </div>
        <div id="zigzag"></div>
        <p class="medium">Let's compute the CLD for your chosen image.</p>
        <img
          v-if="selectedImage !== null"
          :src="images[selectedImage].src"
          :alt="images[selectedImage].alt"
        />
        <div>
          <input
            class="slider"
            id="dct-coeffs-slider"
            type="range"
            min="2"
            max="6"
            v-model="nDctCoeffs"
            @input="getColorLayoutDescriptor"
          />
        </div>
        <div>Number of DCT Coefficients: {{ nDctCoeffs }}</div>
        <div style="font-weight: bold">Y : {{ colorLayoutDescriptor["y"] }}</div>
        <div style="font-weight: bold">Cb : {{ colorLayoutDescriptor["cb"] }}</div>
        <div style="font-weight: bold">Cr : {{ colorLayoutDescriptor["cr"] }}</div>
        <div>
          The biggest advantage of Color Layout Decriptor is its ability to compress the image data
          effectively. It is often used for comparing multiple images between themselves, as it encodes not
          only colors, but also their spatial distribution.
        </div>
      </div>
      <div v-if="selectedImage != null" style="margin-top: 50px">
        <div class="big" style="font-size: 1.5rem">Sources</div>
        Haar transform image from
        <a href="https://www.researchgate.net/publication/3308307_Color_and_Texture_Descriptors"
          >Color and Texture Descriptors</a
        >
        article (I redraw it to get better quality).
        <p>
          Eight demonstration images are taken from the <a href="https://unsplash.com/">Unsplash gallery</a>.
        </p>
        <p>
          HSV Space illustration is taken from
          <a href="https://commons.wikimedia.org/wiki/File:Hsl-hsv_models.svg">Wikimedia Commons.</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { drawPixel } from "@/scripts/drawPixel"
import { draw3Drgb } from "@/scripts/draw3Drgb"
import { drawPixelCircle } from "./scripts/drawPixelCircle"
import { drawDominantColors } from "./scripts/drawDominantColors"
import { drawImageGrid } from "./scripts/drawImageGrid"
import { drawScdHistogram } from "./scripts/drawScdHistogram"
import { drawZigzag } from "./scripts/drawZigZag"
import { postApi } from "./api"

//import cv from 'opencv.js'
gsap.registerPlugin(ScrollTrigger)

var images = ref([])
const selectedImage = ref(null)

var colorLayoutDescriptor = ref({ y: [], cb: [], cr: [] })
var dominantColorsDescriptor = ref([])
var scalableColorDescriptor = ref([])

const nDomColors = ref(3)
const nDctCoeffs = ref(4)
const nScdHistBins = ref(16)
const ScdHistValues = [16, 48, 80, 112, 144, 176, 208, 240]
const nScdCoeffs = ref(16)

const selectImage = (index) => {
  selectedImage.value = index
}

const fetchImages = async () => {
  const imagesArray = [
    "orange-tulip--So60UAgCtU",
    "bonfire-near-mountain-brqqSBSXPac",
    "incandescent-bulb-is-turned-off-wtUsBOOfWf8",
    "aerial-shot-of-road-surrounded-by-green-trees-qzgN45hseN0",
    "minimalist-photography-of-gold-and-gray-polka-dot-wall-NrzgjowHNpU",
    "gray-concrete-road-between-buildings-Sws6G1nFJ4E",
    "aerial-view-of-golden-gate-bridge-RRNbMiPmTZY",
    "multicolored-wall-in-shallow-focus-photography-jbtfM0XBeRc",
  ]
  console.log("Fetching images")
  // Fetch images from Unsplash API
  for (const imageId of imagesArray) {
    //console.log(imageId)
    const response = await fetch(
      `https://api.unsplash.com/photos/${imageId}?client_id=BIQAVulO8kpvryy7H_bxLG9y3sMiJz1i3zNpN1OG8P8`
    )
    const data = await response.json()
    const img = data.urls.raw + "&w=384&h=256&fit=crop" //resize them
    console.log(imageId)
    images.value.push({ src: img })
  }
}

const getDominantColorsDescriptor = async () => {
  //get the src of selected image
  console.log("Getting dominant colors")
  const src = images.value[selectedImage.value].src
  const body = { image_url: src, clusters: nDomColors.value }
  //const data = await getDominantColorsDescriptor(body)
  const data = await postApi("dominant_color", body)
  const img = document.getElementById("reconstructedDominant")
  img.src = `data:image/jpeg;base64,${data.processed_image}`
  console.log("Dominant Colors:", data.dominant_colors)
  dominantColorsDescriptor.value = data.dominant_colors
  drawDominantColors("#dominant-colors", dominantColorsDescriptor.value)
}

const getScdVisualization = async () => {
  const src = images.value[selectedImage.value].src
  const body = { image_url: src, value: nScdCoeffs.value }
  const data = await postApi("scd_visualization", body)
  const img = document.getElementById("scdVisualization")
  img.src = `data:image/jpeg;base64,${data.processed_image}`
}

const getYCbCrChannels = async () => {
  console.log("getting YCbCr channels")
  const src = images.value[selectedImage.value].src
  const body = { image_url: src }
  const data = await postApi("y_cb_cr_channels", body)
  const img_y = document.getElementById("y_cb_cr_channels_y")
  img_y.src = `data:image/jpeg;base64,${data["y"]}`
  const img_cb = document.getElementById("y_cb_cr_channels_cb")
  img_cb.src = `data:image/jpeg;base64,${data["cb"]}`
  const img_cr = document.getElementById("y_cb_cr_channels_cr")
  img_cr.src = `data:image/jpeg;base64,${data["cr"]}`
}

const getColorLayoutDescriptor = async () => {
  console.log("getting color layout descriptor")
  const src = images.value[selectedImage.value].src
  const grid_body = { image_url: src }
  const grid_data = await postApi("color_layout_grid", grid_body)
  const img = document.getElementById("gridAvg")
  img.src = `data:image/jpeg;base64,${grid_data.processed_image}`

  const body = { image_url: src, dct: nDctCoeffs.value }
  const data = await postApi("color_layout_descriptor", body)

  colorLayoutDescriptor.value["y"] = data.y
  colorLayoutDescriptor.value["cb"] = data.cb
  colorLayoutDescriptor.value["cr"] = data.cr
}

const getScdHistogram = async () => {
  console.log("getting scd histogram")
  const src = images.value[selectedImage.value].src
  const body = { image_url: src, value: nScdHistBins.value }
  const data = await postApi("scd_histogram", body)
  drawScdHistogram("#scd-histogram", data["histogram"], nScdHistBins.value)
}

const getScalableColorDescriptor = async () => {
  console.log("getting scalable color descriptor")
  const src = images.value[selectedImage.value].src
  const body = { image_url: src }
  const data = await postApi("scalable_color_descriptor", body)
  scalableColorDescriptor.value = data.scalable_color_descriptor
}

// Watch for changes in `selectedImage`
watch(selectedImage, async (newValue) => {
  if (newValue !== null) {
    // DOM update before animation
    await nextTick()
    gsap.fromTo(
      ".dig-in",
      { opacity: 0, y: 50 }, // Start state
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" } // End state
    )

    drawPixel("#pixel") //this does not have to be redrawn
    drawZigzag("#zigzag")
    draw3Drgb("#rgb3d", false)
    draw3Drgb("#rgb3d-circles", true)
    drawPixelCircle("#avg-pixel")
    //processImage()
    ScrollTrigger.create({
      trigger: ".test2",
      //start: 'top 20%',
      //end: 'top 10%',
      //scrub: false,
      animation: gsap.fromTo(".test2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 5 }),
    })
    nDomColors.value = 3
    getDominantColorsDescriptor()
    nScdHistBins.value = 16
    getScdHistogram()
    drawImageGrid("#image-grid", images.value[selectedImage.value].src)
    getColorLayoutDescriptor()
    getYCbCrChannels()
    getScalableColorDescriptor()
    getScdVisualization()
  }
})

onMounted(() => {
  fetchImages()
})
</script>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
}

.tick-labels {
  display: flex;
  justify-content: space-between; /* Evenly distribute 8, 128, 256 */
  width: 100%;
  margin-top: 5px;
}

.tick-label {
  font-size: 10x;
  color: rgb(0, 0, 0);
}
/* Thumbnails container */
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  max-width: 850px;
}

/* Thumbnails */
.thumbnails img {
  flex: 1 0 calc(25% - 10px); /* 4 images per row */
  max-width: 170px;
  height: 150px;
  cursor: pointer;
  transition:
    opacity 0.5s ease,
    transform 0.3s ease;
  border: 2px solid transparent;
  border-radius: 5px;
}

/* Highlight the selected thumbnail */
.thumbnails img.selected {
  transform: scale(1.1); /* Slightly enlarge the selected image */
  border-color: #007bff; /* Add a blue border */
}

/* Fade out unselected thumbnails */
.thumbnails img.faded {
  opacity: 0.4; /* Reduce opacity */
  /* pointer-events: none; */ /* Disable interactions */
}

.dig-in {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
  font-weight: bold;
  color: #39414a;
}

#visualization {
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  height: 100px; /* Adjust height to your preference */
  border: 1px solid #ccc; /* Optional: Add a border to see the div */
  margin: 0 auto; /* Center horizontally in its container */
}

svg {
  display: block;
}

.slider {
  /* appearance: none; */ /* Remove default styling */
  height: 10px;
  width: 50%;
  background: rgb(212, 212, 212); /* Grey track */
  border-radius: 9px;
  outline: none;
}

/* Thumb (for Chrome, Safari, Edge, Opera) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: black; /* Black thumb */
  border-radius: 50%;
  cursor: pointer;
}

/* Thumb (for Firefox) */
.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: black;
  border-radius: 50%;
  cursor: pointer;
}

.y_cb_cr_container {
  display: flex; /* Places images side by side */
  gap: 10px; /* Adds space between images */
  justify-content: center; /* Center images horizontally */
}

.channels_img {
  width: 200px;
  height: auto; /* Keep aspect ratio */
  border-radius: 1px; /* Optional: rounded corners */
}
</style>
