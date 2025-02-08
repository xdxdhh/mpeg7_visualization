import * as d3 from "d3"

export function draw3Drgb(containerId, drawCircles) {
  // Clear any existing content
  d3.select(containerId).selectAll("*").remove()

  // Set up SVG dimensions
  const width = 400
  const height = 400
  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  // Center of the 3D space
  const centerX = width / 2
  const centerY = height / 2

  // Axes lengths
  const axisLength = 150

  // Add axes (simulating 3D perspective)
  svg
    .append("line") // X-axis
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", centerX + axisLength)
    .attr("y2", centerY)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

  svg
    .append("line") // Y-axis
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", centerX)
    .attr("y2", centerY - axisLength)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

  svg
    .append("line") // Z-axis
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", centerX - axisLength / 1.5)
    .attr("y2", centerY + axisLength / 1.5)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

  // Add axis labels
  svg
    .append("text") // R-axis label
    .attr("x", centerX + axisLength + 10) // Slightly offset for clarity
    .attr("y", centerY)
    .attr("font-size", "16px")
    .attr("fill", "red")
    .text("R")

  svg
    .append("text") // G-axis label
    .attr("x", centerX - 10) // Slightly offset to center the text
    .attr("y", centerY - axisLength - 10) // Adjust for clarity
    .attr("font-size", "16px")
    .attr("fill", "green")
    .text("G")

  svg
    .append("text") // B-axis label
    .attr("x", centerX - axisLength / 1.5 - 20) // Adjust based on perspective
    .attr("y", centerY + axisLength / 1.5 + 10)
    .attr("font-size", "16px")
    .attr("fill", "blue")
    .text("B")

  if (drawCircles) {
    svg
      .append("circle")
      .attr("cx", 300) // Center x
      .attr("cy", 190) // Center y
      .attr("r", 35) // Radius
      .attr("stroke", "black") // Stroke color
      .attr("fill", "none") // Fill color
      .attr("stroke-width", 3) // Stroke width
  }

  // Add points in the pseudo-3D space
  const points = [
    { x: 50, y: -30, z: 20, color: "#320014" },
    { x: 120, y: 10, z: 0, color: "red" }, // Red
    { x: 100, y: 30, z: 0, color: "#FA6400" }, // orange
    { x: 90, y: 0, z: 10, color: "#FA6464" }, // pinkish
    { x: 80, y: 16, z: 10, color: "#966400" }, // red-orange
    { x: 20, y: 120, z: 10, color: "green" },
    { x: -20, y: 90, z: 20, color: "#2a673d" },
    { x: -60, y: -20, z: 20, color: "#2a6367" },
    { x: 30, y: -50, z: 20, color: "purple" },
  ]

  points.forEach((point) => {
    const projectedX = centerX + point.x - point.z * 0.5
    const projectedY = centerY - point.y + point.z * 0.5

    svg
      .append("rect")
      .attr("x", projectedX - 2.5)
      .attr("y", projectedY - 2.5)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", point.color)
  })
}
