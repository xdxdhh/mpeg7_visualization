import * as d3 from "d3"

function getHueColor(x, n_colors) {
  if (x < 0 || x > n_colors - 1) {
    throw new Error("x must be in the range [0, 255]")
  }
  let hue = (x / n_colors) * 360 // Map x to hue range [0, 360]
  let rgb = hsvToRgb(hue, 1, 1) // Convert HSV to RGB with full saturation and value

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function hsvToRgb(h, s, v) {
  let c = v * s
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  let m = v - c
  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return [r, g, b]
}

export function drawScdHistogram(containerId, values, n_colors) {
  console.log("drawScdHistogram for", n_colors, "colors")
  d3.select(containerId).selectAll("*").remove()

  const width = 500
  const height = 300
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }

  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  // Define the scales
  // Define the scales
  const xScale = d3
    .scaleLinear()
    .domain([0, values.length]) // Bin indices
    .range([margin.left, width - margin.right])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(values)]) // Max value in histogram
    .range([height - margin.bottom, margin.top])

  // Create bars
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d))
    .attr("width", (width - margin.left - margin.right) / values.length - 1)
    .attr("height", (d) => height - margin.bottom - yScale(d))
    .attr("fill", (_, i) => getHueColor(i, n_colors)) // Color bars based on bin index

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10))

  // Y axis
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale))
}
