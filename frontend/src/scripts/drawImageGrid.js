import * as d3 from "d3"

export function drawImageGrid(containerId, selectedImage) {
  console.log("drawImageGrid")
  // Clear any existing content
  d3.select(containerId).selectAll("*").remove()

  // SVG Dimensions
  const width = 384
  const height = 256

  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  const rows = 8
  const cols = 12
  const cellWidth = width / cols
  const cellHeight = height / rows

  svg.append("image").attr("xlink:href", selectedImage).attr("width", width).attr("height", height)

  // Draw vertical grid lines
  for (let i = 1; i < cols; i++) {
    svg
      .append("line")
      .attr("x1", i * cellWidth)
      .attr("y1", 0)
      .attr("x2", i * cellWidth)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  }

  // Draw horizontal grid lines
  for (let i = 1; i < rows; i++) {
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", i * cellHeight)
      .attr("x2", width)
      .attr("y2", i * cellHeight)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  }
}
