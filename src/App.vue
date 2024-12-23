<template>
  <div id="app">
    <header>MPEG-7 Visual Descriptors</header>
    <h2 class="big">What are they and how do they work?</h2>
    <h3 class="medium">Explaining by visuals by Diana Varšíková</h3>
    <main>
      <p>
        MPEG-7 is a multimedia content description standard. It provides a rich set of tools to
        describe the structure and semantics of multimedia data, enabling efficient searching,
        retrieval, and use.
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
      <div v-if="selectedImage != null" class="dig-in">Great job! Let's dig in.</div>
      <!-- <div>Let's start with the simplest one.</div> -->
      <div v-if="selectedImage != null" class="dcd">
        <div class="big">Dominant Color Descriptor</div>
        <div>
          Dominant Color Descriptor (DCD) is the. It provides the distribution of the most
          noticeable colors in the image.
        </div>
        <div>
          Each pixel is encoded, using its representation in RGB space. So three coordinates from 0
          to 255.
        </div>
        <div id="pixel"></div>
        <div>All the pixels together form a 3D space.</div>
        <div id="rgb3d"></div>
        <div>
          This space is then clustered into a given number of clusters. Clustering technique
          explanaition
        </div>
        <div id="rgb3d-circles" class="test2"></div>
        <div>
          From each cluster, one 'average' pixel is created. Colors of these pixels then form the
          Dominant Color Descriptor. obrazek kolecek kolem tech par pixelu - tj stejny obrazek jako
          nad tim, ale s koleckama obrazek par pixelu v kolecku a jejich kombinace v prumerny pixel
        </div>
        <div id="avg-pixel"></div>
        This is done for all the clusters, and the average colors then form the Visual Color
        Descriptor.
        <div>obrazek example color descriptoru</div>
        <div>
          The number of clusters can be set by the user. The more clusters, the more detailed the
          descriptor. Let's try it with your image.
        </div>
        <!-- Slider for selecting number of clusters -->
        <div>
          <label for="cluster-slider">Number of Clusters: {{ numberOfClusters }}</label>
          <input
            id="cluster-slider"
            type="range"
            min="3"
            max="10"
            v-model="numberOfClusters"
            @input="updateClusters"
          />
        </div>
      </div>
      <!-- <div class="test">TEST DIV</div> -->
    </main>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { drawPixel } from '@/scripts/drawPixel'
import { draw3Drgb } from '@/scripts/draw3Drgb'
import { drawPixelCircle } from './scripts/drawPixelCircle'

gsap.registerPlugin(ScrollTrigger)

var images = ref([])

const fetchImages = async () => {
  const imagesArray = [
    'orange-tulip--So60UAgCtU',
    'bonfire-near-mountain-brqqSBSXPac',
    'incandescent-bulb-is-turned-off-wtUsBOOfWf8',
    'aerial-shot-of-road-surrounded-by-green-trees-qzgN45hseN0',
    'minimalist-photography-of-gold-and-gray-polka-dot-wall-NrzgjowHNpU',
    'gray-concrete-road-between-buildings-Sws6G1nFJ4E',
    'aerial-view-of-golden-gate-bridge-RRNbMiPmTZY',
  ]
  console.log('Fetching images')
  // Fetch images from Unsplash API
  for (const imageId of imagesArray) {
    console.log(imageId)
    const response = await fetch(
      `https://api.unsplash.com/photos/${imageId}?client_id=BIQAVulO8kpvryy7H_bxLG9y3sMiJz1i3zNpN1OG8P8`,
    )
    const data = await response.json()
    console.log(data)
    const img = data.urls.small
    images.value.push({ src: img, alt: 'Thumbnail 5' })
  }
}

const selectedImage = ref(null)
//save the number of clusters
const numberOfClusters = ref(3)

const selectImage = (index) => {
  selectedImage.value = index
}

const updateClusters = () => {
  console.log('Number of clusters:', numberOfClusters.value)
}

// Watch for changes in `selectedImage` to trigger animations
// Watch for changes in `selectedImage`
watch(selectedImage, async (newValue) => {
  if (newValue !== null) {
    // Wait for the DOM to update before animating
    await nextTick()
    gsap.fromTo(
      '.dig-in',
      { opacity: 0, y: 50 }, // Start state
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, // End state
    )

    drawPixel('#pixel')
    draw3Drgb('#rgb3d', false)
    draw3Drgb('#rgb3d-circles', true)
    drawPixelCircle('#avg-pixel')
    ScrollTrigger.create({
      trigger: '.test2',
      //start: 'top 20%',
      //end: 'top 10%',
      //scrub: false,
      animation: gsap.fromTo('.test2', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 5 }),
    })
  }
})

onMounted(() => {
  fetchImages()
  ScrollTrigger.create({
    trigger: '.test',
    //start: 'top 20%',
    //end: 'top 10%',
    //scrub: false,
    animation: gsap.fromTo('.test', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 5 }),
  })
})
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
