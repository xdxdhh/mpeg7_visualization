import * as d3 from 'd3'

export function draw3Drgb(containerId, drawCircles) {
  // Clear any existing content
  d3.select(containerId).selectAll('*').remove()

  // Set up SVG dimensions
  const width = 400
  const height = 400
  const svg = d3.select(containerId).append('svg').attr('width', width).attr('height', height)

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

  if (drawCircles) {
    svg
      .append('circle')
      .attr('cx', 110) // Center x
      .attr('cy', 250) // Center y
      .attr('r', 35) // Radius
      .attr('fill', 'blue') // Fill color
      .attr('stroke', 'black') // Stroke color
      .attr('stroke-width', 2) // Stroke width
  }

  // Add points in the pseudo-3D space
  const points = [
    { x: 50, y: -30, z: 20, color: '#320014' },
    { x: 150, y: 10, z: 0, color: 'red' }, // Red
    { x: 120, y: 30, z: 0, color: '#FA6400' }, // red-orange
    { x: 110, y: -30, z: 10, color: '#FA6464' }, // red-orange
    { x: 70, y: 16, z: 10, color: '#966400' }, // red-orange
    /*{ x: 100, y: -20, z: 70, color: '#641446' }, // Purple
    { x: -50, y: -40, z: 80, color: '#322850' }, // Dark blue-purple
    { x: 150, y: 150, z: 150, color: '#969696' }, // Grey
    { x: 30, y: 20, z: 10, color: 'pink' }, // Pink
    { x: -60, y: 70, z: 30, color: '#00FF00' }, // Bright green
    //{ x: 90, y: -10, z: 40, color: '#00FF88' }, // Mint green
    { x: -120, y: -50, z: 100, color: '#FF69B4' }, // Hot pink
    { x: 120, y: -80, z: 70, color: '#B22222' }, // Firebrick red
    { x: -80, y: 30, z: 90, color: '#228B22' }, // Forest green
    { x: 140, y: -90, z: 50, color: '#8A2BE2' }, // Blue-violet
    { x: 60, y: 60, z: 20, color: '#FFB6C1' }, // Light pink
    { x: -100, y: 20, z: 120, color: '#7FFF00' }, // Chartreuse green
    { x: 200, y: -150, z: 100, color: '#FFD700' }, // Gold */
  ]

  points.forEach((point) => {
    const projectedX = centerX + point.x - point.z * 0.5
    const projectedY = centerY - point.y + point.z * 0.5

    svg
      .append('rect')
      .attr('x', projectedX - 2.5)
      .attr('y', projectedY - 2.5)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', point.color)
  })
}
