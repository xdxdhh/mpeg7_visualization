import * as d3 from "d3"

export function drawPixel(containerId) {
  // Clear any existing SVG (prevents duplication)
  d3.select(containerId).selectAll("*").remove()

  // Set up SVG dimensions
  const width = 300
  const height = 150

  // Create an SVG container
  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  // Draw the square representing the pixel
  svg
    .append("rect")
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 60)
    .attr("height", 60)
    .attr("fill", "#aabbcc") // Pixel color
    .attr("stroke", "black")

  // Draw the arrow
  svg
    .append("line")
    .attr("x1", 120)
    .attr("y1", 50)
    .attr("x2", 175)
    .attr("y2", 50)
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

  // Add the RGB vector text
  svg
    .append("text")
    .attr("x", 210)
    .attr("y", 55)
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("(R, G, B)")

  svg
    .append("rect")
    .attr("x", 90)
    .attr("y", 100)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#ff9933") // Pixel color
    .attr("stroke", "black")

  svg
    .append("line")
    .attr("x1", 120)
    .attr("y1", 110)
    .attr("x2", 175)
    .attr("y2", 110)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("marker-end", "url(#arrowhead)")

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

  svg
    .append("text")
    .attr("x", 190)
    .attr("y", 114)
    .attr("font-size", "12px")
    .attr("fill", "black")
    .html(
      `(<tspan style="fill:red;">255</tspan>, <tspan style="fill:green;">153</tspan>, <tspan style="fill:blue;">51</tspan>)`
    )
}
