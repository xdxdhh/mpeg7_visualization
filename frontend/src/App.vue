<template>
  <div id="app">
    <header>MPEG-7 Visual Descriptors</header>
    <h2 class="big">What are they and how do they work?</h2>
    <h3 class="medium">Explaining by visuals by Diana Varšíková</h3>
    <main>
      <p>
        MPEG-7 is a multimedia content description standard designed to provide
        a structured and rich representation of multimedia data, such as images,
        audio, and video. It serves as a framework for efficiently organizing
        and retrieving multimedia content, making it easier to search and
        analyze large datasets. In the context of images, MPEG-7 defines a set
        of
        <span style="font-weight: bold">image descriptors</span>, which are
        features that describe and identify visual characteristics of images.
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
          <span style="font-weight: bold">Dominant Color Descriptor (DCD) </span
          >is one of the simplest yet key image descriptors defined in MPEG-7.
          It focuses on identifying the most significant colors in the image and
          analyzing their distribution.
        </div>
        <div>
          Each pixel in the image is represented by its
          <span style="font-weight: bold">RGB</span> values (Red, Green, Blue),
          with each channel ranging from 0 to 255. Together, these three values
          define a single point in the 3D RGB color space.
        </div>
        <div id="pixel"></div>
        <div>
          The entire image consists of a large number of pixels. For instance,
          the images used on this webpage have dimensions of 384x256, resulting
          in 98,304 pixels. If you imagine each pixel's color as a point in 3D
          space, the entire image forms a cloud of points within the RGB color
          space.
        </div>
        <div id="rgb3d"></div>
        <div>
          To identify the dominant colors, we need to group similar colors
          together. This is done using a technique called clustering. Clustering
          algorithms group the pixels into a fixed number of so-called clusters,
          based on their color similarity.
        </div>
        <div id="rgb3d-circles"></div>
        <div>
          From each cluster, one 'average' pixel is created, this pixel is
          called the
          <span style="font-weight: bold">centroid</span> of the cluster and it
          captures the "average" color of all the pixels that belong to that
          cluster.
        </div>
        <div id="avg-pixel"></div>

        <div>
          This is done for all the clusters, and the average colors then form
          the Visual Color Descriptor. The importance of the cluster is
          determined by the number of pixels it contains. We can usually choose
          the number of clusters we want to group the points into. The more
          clusters, the more detailed the descriptor.
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
            v-model="numberOfClusters"
            @input="getDominantColors"
          />
        </div>
        <div>Number of Clusters: {{ numberOfClusters }}</div>
        <div id="dominant-colors"></div>
        <div>
          We can then reconstruct the image using only the dominant colors by
          assigning each pixel to the closest centroid. In general, 8 clusters
          is considered a good enough approximation of the image.
        </div>
      </div>
      <img id="reconstructedDominant" />
      <div v-if="selectedImage != null" class="scd">
        <div class="big">Scalable Color Descriptor</div>
        <!-- <div>
          It's a color histogram in HSV space encoded with Haar transform.
          Useful for image matching and retrieval based on color. tj histogram s
          pevne definovanym poctem binu pak projde haar transform a pak si
          vybiram kolik koeficientu chci
        </div> -->
        <div>
          This time, the pixels are represented not in the RGB space, but in
          <span style="font-weight: bold">HSV</span>
          (Hue, Saturation, Value) space. Hue represents the type of color (e.g.
          red, green, blue), Saturation represents the intensity of the color,
          and Value represents its brightness.
        </div>
        <img src="./assets/hsv.svg" />
        <div>
          The HSV space is divided into a fixed number of bins, and each pixel
          is assigned to one of them, based on its proximity in HSV space. //The
          image colors are simplified into a limited set of representative
          colors in HSV space. Divide the HSV color space into predefined bins
          (e.g., 256, 128, or 64 bins). Count the number of pixels in each bin
          to build a color histogram.
        </div>
        <!-- <div>obrazek zjednoduseny na kvantizovane pixely</div> -->
        <div>
          The number of pixels that belong to each bin then form a histogram.
        </div>
        <div id="scd-histogram"></div>
        <div>
          Use the Haar Wavelet Transform to decompose the histogram. The
          transformation captures both low-frequency (overall color
          distribution) and high-frequency (fine details) information.
        </div>
        <div>
          The wavelet coefficients are quantized to reduce storage size. The
          descriptor can be encoded at different levels of detail (scalable
          representation).
        </div>
      </div>
      <div v-if="selectedImage != null" class="cld">
        <div class="big">Color Layout Descriptor</div>
        <div style="margin-bottom: 20px">
          This time we want to describe an image not just by its colors but also
          by where those colors appear. For example, if you have an image of a
          sunset, you wouldn't just say "orange and blue"—you'd also want to
          capture that orange is at the bottom and blue is at the top. The
          <span style="font-weight: bold">Color Layout Descriptor</span> (CLD)
          does exactly that.
        </div>
        <div>
          Instead of analyzing every single pixel (which would be too much
          data), we split the image into a grid of (in this case) 8x8 blocks.
          Each block represents a small region of the image.
        </div>
        <div id="image-grid"></div>
        <div>
          For each block, we calculate the average color—essentially compressing
          all the pixels in the block into a single color value. So, if a block
          contains mostly shades of blue, we replace it with a single average
          blue color. Think of this like reducing an HD image into a very
          low-resolution version where each block is a single color.The
          selection results in a tiny image icon of size 12 x 8 pixels.
        </div>
        <img id="gridAvg" />
        <div>
          Afterwards, this simplified image is transformed into
          <span style="font-weight: bold">YCbCr</span> space, which separates
          brightness (luma) from color (chroma), was created due to backwards
          compatibility, so that old tvs could ignore the color part Y is
          essentially greyscale copy of the original one cb - blue chrominance
          cr - red chrominance
        </div>
        <div class="y_cb_cr_container">
          <img class="channels_img" id="y_cb_cr_channels_y" />
          <img class="channels_img" id="y_cb_cr_channels_cb" />
          <img class="channels_img" id="y_cb_cr_channels_cr" />
        </div>
        <div>
          As last step, we apply the
          <span style="font-weight: bold">Discrete Cosine Transform (DCT)</span>
          to the YCbCr image. The DCT is a mathematical technique that
          transforms the image into a three sets of 64 TODO DCT coefficients
          (stejny rozmer jako ten orbazek). A zigzag scanning is performed with
          these three sets of 64 DCT coefficients, following the schema
          presented in the figure. The purpose of the zigzag scan is to group
          the low frequency coefficients of the 8x8 TODO matrix. Zig zag
          scanning ilustrace TODO. Then, the more coefficients we keep, the more
          detailed the descriptor will be.
        </div>
        <div id="zigzag"></div>
        <div>
          <input
            class="slider"
            id="dct-coeffs-slider"
            type="range"
            min="2"
            max="6"
            v-model="dctCoeffs"
            @input="getColorLayoutDescriptor"
          />
        </div>
        <div>Number of DCT Coefficients: {{ dctCoeffs }}</div>
        <div>
          Y {{ colorLayoutDescriptor["y"] }} Cb1
          {{ colorLayoutDescriptor["cb"] }} Cr {{ colorLayoutDescriptor["cr"] }}
        </div>
        <div>
          Very compact with many information Is often used for comparing
          multiple images between themselves.
        </div>
      </div>
      <div>Sources</div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawPixel } from "@/scripts/drawPixel";
import { draw3Drgb } from "@/scripts/draw3Drgb";
import { drawPixelCircle } from "./scripts/drawPixelCircle";
import { drawDominantColors } from "./scripts/drawDominantColors";
import { drawImageGrid } from "./scripts/drawImageGrid";
import { drawScdHistogram } from "./scripts/drawScdHistogram";
import { drawZigzag } from "./scripts/drawZigZag";

//import cv from 'opencv.js'
gsap.registerPlugin(ScrollTrigger);

var images = ref([]);
var colorLayoutDescriptor = ref({ y: [], cb: [], cr: [] });
const dominantColors = ref([]);
const selectedImage = ref(null);
const numberOfClusters = ref(3);
const dctCoeffs = ref(4);

const selectImage = (index) => {
  selectedImage.value = index;
};

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
  ];
  console.log("Fetching images");
  // Fetch images from Unsplash API
  for (const imageId of imagesArray) {
    //console.log(imageId)
    const response = await fetch(
      `https://api.unsplash.com/photos/${imageId}?client_id=BIQAVulO8kpvryy7H_bxLG9y3sMiJz1i3zNpN1OG8P8`
    );
    const data = await response.json();
    //console.log(data)
    const img = data.urls.raw + "&w=384&h=256&fit=crop";
    console.log(imageId);
    images.value.push({ src: img, alt: "Thumbnail 5" });
  }
};

const getDominantColors = () => {
  //get the src of selected image
  console.log("Getting dominant colors");
  const src = images.value[selectedImage.value].src;
  console.log(src);
  fetch("http://0.0.0.0:8000/dominant_color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: src, clusters: numberOfClusters.value }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const img = document.getElementById("reconstructedDominant");
      img.src = `data:image/jpeg;base64,${data.processed_image}`;
      console.log("Dominant Colors:", data.dominant_colors);
      dominantColors.value = data.dominant_colors;
      drawDominantColors("#dominant-colors", dominantColors.value);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getYCbCrChannels = () => {
  console.log("getting YCbCr channels");
  const src = images.value[selectedImage.value].src;
  // use img from gridAvg element as src:
  //const src = document.getElementById("gridAvg").src;
  fetch("http://0.0.0.0:8000/y_cb_cr_channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: src }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const img_y = document.getElementById("y_cb_cr_channels_y");
      img_y.src = `data:image/jpeg;base64,${data["y"]}`;
      const img_cb = document.getElementById("y_cb_cr_channels_cb");
      img_cb.src = `data:image/jpeg;base64,${data["cb"]}`;
      const img_cr = document.getElementById("y_cb_cr_channels_cr");
      img_cr.src = `data:image/jpeg;base64,${data["cr"]}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getColorLayoutDescriptor = () => {
  console.log("getting color layout descriptor");
  const src = images.value[selectedImage.value].src;
  fetch("http://0.0.0.0:8000/color_layout_grid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: src }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const img = document.getElementById("gridAvg");
      img.src = `data:image/jpeg;base64,${data.processed_image}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch("http://0.0.0.0:8000/color_layout_descriptor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: src, dct: dctCoeffs.value }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      colorLayoutDescriptor.value["y"] = data.y;
      colorLayoutDescriptor.value["cb"] = data.cb;
      colorLayoutDescriptor.value["cr"] = data.cr;
      console.log("Color Layout Descriptor:", colorLayoutDescriptor.value);
      //drawColorLayoutDescriptor("#color-layout-descriptor", colorLayoutDescriptor.value);
    });
};

const getScdHistogram = () => {
  console.log("getting scd histogram");
  const src = images.value[selectedImage.value].src;
  fetch("http://0.0.0.0:8000/scd_histogram/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: src }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      drawScdHistogram(
        "#scd-histogram",
        data["histogram"],
        data["hue_rgb_mapping"]
      );
    });
};

// Watch for changes in `selectedImage`
watch(selectedImage, async (newValue) => {
  if (newValue !== null) {
    // DOM update before animation
    await nextTick();
    gsap.fromTo(
      ".dig-in",
      { opacity: 0, y: 50 }, // Start state
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" } // End state
    );

    drawPixel("#pixel");
    drawZigzag("#zigzag");
    draw3Drgb("#rgb3d", false);
    draw3Drgb("#rgb3d-circles", true);
    drawPixelCircle("#avg-pixel");
    //processImage()
    ScrollTrigger.create({
      trigger: ".test2",
      //start: 'top 20%',
      //end: 'top 10%',
      //scrub: false,
      animation: gsap.fromTo(
        ".test2",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 5 }
      ),
    });
    getDominantColors();
    getScdHistogram();
    drawImageGrid("#image-grid", images.value[selectedImage.value].src);
    await getColorLayoutDescriptor();
    getYCbCrChannels();
  }
});

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
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
  -webkit-appearance: none; /* Remove default styling */
  height: 10px;
  width: 250px;
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
