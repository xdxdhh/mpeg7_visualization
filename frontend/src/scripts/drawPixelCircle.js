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

  // Draw five small squares inside the circle
  const squareSize = 10
  const squarePositions = [
    { x: 50, y: 70, color: "#FF0000" },
    { x: 70, y: 90, color: "#990000" },
    { x: 40, y: 130, color: "#ffb266" },
    { x: 20, y: 90, color: "#cc6600" },
    { x: 50, y: 100, color: "#cccc00" },
  ]

  svg
    .selectAll("rect")
    .data(squarePositions)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x - squareSize / 2)
    .attr("y", (d) => d.y - squareSize / 2)
    .attr("width", squareSize)
    .attr("height", squareSize)
    .attr("fill", (d) => d.color)

  svg
    .append("rect")
    .attr("x", 220)
    .attr("y", 90)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#FF8000")
    .attr("stroke", "black")
}
