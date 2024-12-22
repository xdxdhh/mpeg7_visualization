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
      <div v-if="selectedImage != null" class="dig-in">Great job! Let's dig in.</div>
      <!-- <div>Let's start with the simplest one.</div> -->
      <div v-if="selectedImage != null">
        <div class="big">Dominant Color Descriptor</div>
        <div>
          Dominant Color Descriptor (DCD) is the. It provides the distribution of the most
          noticeable colors in the image.
        </div>
        <div>Each pixel is encoded, using its representation in RGB space.</div>
        <div id="visualization"></div>
        <div>All the pixels together form a 3D space.</div>
        <div id="space3dviz"></div>
        <div id="space3dviz-circles"></div>
        <div>
          This space is then clustered into a given number of clusters. From each cluster, one
          'average' pixel is created. Colors of these pixels then form the Dominant Color
          Descriptor. obrazek kolecek kolem tech par pixelu - tj stejny obrazek jako nad tim, ale s
          koleckama obrazek par pixelu v kolecku a jejich kombinace v prumerny pixel
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import image1 from '@/assets/img150.jpg'
import * as d3 from 'd3'
import { drawPixel } from '@/scripts/drawPixel'

const images = ref([
  { src: image1, alt: 'Thumbnail 1' },
  { src: image1, alt: 'Thumbnail 2' },
  { src: image1, alt: 'Thumbnail 3' },
  { src: image1, alt: 'Thumbnail 4' },
])
const selectedImage = ref(null)

const selectImage = (index) => {
  selectedImage.value = index
}

const render3DSpace = () => {
  // Clear any existing content
  d3.select('#space3dviz').selectAll('*').remove()

  // Set up SVG dimensions
  const width = 400
  const height = 400
  const svg = d3.select('#space3dviz').append('svg').attr('width', width).attr('height', height)

  // Center of the 3D space
  const centerX = width / 2
  const centerY = height / 2

  // Axes lengths
  const axisLength = 150

  // Add axes (simulating 3D perspective)
  svg
    .append('line') // X-axis
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', centerX + axisLength)
    .attr('y2', centerY)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)

  svg
    .append('line') // Y-axis
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', centerX)
    .attr('y2', centerY - axisLength)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)

  svg
    .append('line') // Z-axis
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', centerX - axisLength / 1.5)
    .attr('y2', centerY + axisLength / 1.5)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)

  // Add axis labels
  svg
    .append('text') // R-axis label
    .attr('x', centerX + axisLength + 10) // Slightly offset for clarity
    .attr('y', centerY)
    .attr('font-size', '16px')
    .attr('fill', 'red')
    .text('R')

  svg
    .append('text') // G-axis label
    .attr('x', centerX - 10) // Slightly offset to center the text
    .attr('y', centerY - axisLength - 10) // Adjust for clarity
    .attr('font-size', '16px')
    .attr('fill', 'green')
    .text('G')

  svg
    .append('text') // B-axis label
    .attr('x', centerX - axisLength / 1.5 - 20) // Adjust based on perspective
    .attr('y', centerY + axisLength / 1.5 + 10)
    .attr('font-size', '16px')
    .attr('fill', 'blue')
    .text('B')

  svg
    .append('circle')
    .attr('cx', 110) // Center x
    .attr('cy', 250) // Center y
    .attr('r', 35) // Radius
    .attr('fill', 'blue') // Fill color
    .attr('stroke', 'black') // Stroke color
    .attr('stroke-width', 2) // Stroke width

  // Add points in the pseudo-3D space
  const points = [
    { x: 50, y: -30, z: 20 },
    { x: 80, y: -60, z: 50 },
    { x: 100, y: -20, z: 70 },
    { x: -50, y: -40, z: 80 },
    { x: 150, y: 50, z: 60 },
    { x: 150, y: 150, z: 150 },
  ]

  const colorsList = ['#321E14', '#503C32', '#641446', '#322850', 'red', '#969696']

  points.forEach((point) => {
    const projectedX = centerX + point.x - point.z * 0.5
    const projectedY = centerY - point.y + point.z * 0.5

    svg
      .append('rect')
      .attr('x', projectedX - 2.5)
      .attr('y', projectedY - 2.5)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', colorsList[points.indexOf(point)])
  })
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
    drawPixel()
    render3DSpace()
  }
})
</script>

<style scoped>
/* Thumbnails container */
.thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

/* Thumbnails */
.thumbnails img {
  width: 100px;
  height: 100px;
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
