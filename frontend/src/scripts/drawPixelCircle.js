import * as d3 from "d3"

export function drawPixelCircle(containerId) {
  d3.select(containerId).selectAll("*").remove()

  // Set up SVG dimensions
  const width = 300
  const height = 200

  // Create an SVG container
  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  // Draw a circle
  svg
    .append("circle")
    .attr("cx", 50)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "none") // Pixel color
    .attr("stroke", "black")
    .attr("stroke-width", 2)

  // Draw the arrow
  svg
    .append("line")
    .attr("x1", 120)
    .attr("y1", 100)
    .attr("x2", 175)
    .attr("y2", 100)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrowhead)")

  // Define the arrowhead marker
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("markerWidth", 10)
    .attr("markerHeight", 7)
    .attr("refX", 0)
    .attr("refY", 3.5)
    .attr("orient", "auto")
    .append("polygon")
    .attr("points", "0 0, 10 3.5, 0 7")
    .attr("fill", "black")
}
