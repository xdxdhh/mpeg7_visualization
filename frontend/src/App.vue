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
      <div v-if="selectedImage != null" class="dig-in">
        Great job! Let's dig in.
      </div>
      <!-- <div>Let's start with the simplest one.</div> -->
      <div v-if="selectedImage != null" class="dcd">
        <div class="big">Dominant Color Descriptor</div>
        <div>
          The
          <span style="font-weight: bold">Dominant Color Descriptor (DCD) </span
          >is one of the key (and also the simplest ones) image descriptors
          defined in MPEG-7. It focuses on identifying the most significant
          colors in the image and //representing the color distribution//.
        </div>
        <div>
          Each pixel in the image is represented by its
          <span style="font-weight: bold">RGB</span>values (Red, Green, Blue),
          which range from 0 to 255. These three color components together form
          a point in a 3D RGB color space.
        </div>
        <div id="pixel"></div>
        <div>
          The entire image is made up of a large number of pixels (for our case
          of 400 x 257 image it comes to 102800 pixels). If you imagine every
          pixel's color as a point in 3D space, the entire image forms a cloud
          of points in this RGB space.
        </div>
        <div id="rgb3d"></div>
        <div>
          //This space is then clustered into a given number of clusters.// To
          identify the dominant colors, we need to group similar colors
          together. This is done using a technique called clustering. Clustering
          algorithms group the pixels into a fixed number of so called clusters,
          based on their color similarity. //chci rict se space je clustere
        </div>
        <div id="rgb3d-circles" class="test2"></div>
        <div>
          From each cluster, one 'average' pixel is created, this pixel is
          called the
          <span style="font-weight: bold">centroid</span> of the cluster and
          captures the "average" color of all the pixels that belong to that
          cluster. These average colors are then used to form the Dominant Color
          Descriptor (DCD).
        </div>
        <div id="avg-pixel"></div>
        This is done for all the clusters, and the average colors then form the
        Visual Color Descriptor. The importance of the cluster is determined by
        the number of pixels it contains.
        <div>obrazek example color descriptoru</div>
        <div>
          The number of clusters can be set by the user. The more clusters, the
          more detailed the descriptor. Let's try it with your image.
        </div>
        <!-- Slider for selecting number of clusters -->
        <div>
          <label for="cluster-slider"
            >Number of Clusters: {{ numberOfClusters }}</label
          >
          <input
            id="cluster-slider"
            type="range"
            min="2"
            max="8"
            v-model="numberOfClusters"
            @input="updateClusters"
          />
        </div>
        <img
          v-if="selectedImage !== null"
          :src="images[selectedImage].src"
          :alt="images[selectedImage].alt"
        />
        <div id="dominant-colors"></div>
        <div>
          We can then reconstruct the image using only the dominant colors by
          assigning each pixel to the closest centroid.
        </div>
      </div>
      <img id="reconstructedDominant" />
      <div v-if="selectedImage != null" class="scd">
        <div class="big">Scalable Color Descriptor</div>
        <div>
          It's a color histogram in HSV space encoded with Haar transform.
          Useful for image matching and retrieval based on color. tj histogram s
          pevne definovanym poctem binu pak projde haar transform a pak si
          vybiram kolik koeficientu chci
        </div>
        <div>
          This time, the pixels are represented not in RGB space, but in HSV
          (Hue, Saturation, Value) space. Hue represents the type of color (e.g.
          red, green, blue), Saturation represents the intensity of the color,
          and Value represents its brightness.
        </div>
        <img src="./assets/hsv.svg" />
        <div>
          The HSV space is divided into a fixed number of bins, and each pixel
          is assigned to one of them, based on its proximity in HSV space. //The
          image colors are simplified into a limited set of representative
          colors in HSV space.
        </div>
        <!-- <div>obrazek zjednoduseny na kvantizovane pixely</div> -->
        <div>
          The number of pixels that belong to each bin then form a histogram.
        </div>
      </div>
      <div v-if="selectedImage != null" class="cld">
        <div class="big">Color Layout Descriptor</div>
        <div>spacial distribution of colors in image</div>
      </div>
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

//import cv from 'opencv.js'
gsap.registerPlugin(ScrollTrigger);

var images = ref([]);
const dominantColors = ref([]);
const selectedImage = ref(null);
const numberOfClusters = ref(3);

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
    const img = data.urls.small;
    console.log(imageId);
    console.log(img);
    images.value.push({ src: img, alt: "Thumbnail 5" });
  }
};

const updateClusters = () => {
  console.log("Number of clusters:", numberOfClusters.value);
  getDominantColors();
};

const getDominantColors = () => {
  //get the src of selected image
  console.log("getting dominant colors");
  console.log("selected image:", selectedImage.value);
  console.log("selected img: ", images.value[selectedImage.value]);
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
</style>
