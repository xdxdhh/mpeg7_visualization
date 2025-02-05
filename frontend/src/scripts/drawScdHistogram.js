import * as d3 from "d3"

export function drawScdHistogram(containerId, values, hueRgbMapping) {
  console.log("drawScdHistogram")
  console.log(hueRgbMapping)
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

  // Define a color scale for hue (Hue is usually between 0 and 360 degrees)
  const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, values.length]) // Map each bin index to a color

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
    .attr("fill", (_, i) => `rgb(${hueRgbMapping[i][0]}, ${hueRgbMapping[i][1]}, ${hueRgbMapping[i][2]})`) // Color bars based on bin index

  //Keep saturation and brightness constant to 1
  // Add X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10))

  // Add Y axis
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale))
}
