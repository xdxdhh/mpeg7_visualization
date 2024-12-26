import * as d3 from 'd3'

export function drawDominantColors(containerId, colorsData) {
  d3.select(containerId).selectAll('*').remove()

  // dims
  const totalWidth = 300
  const height = 50

  const svg = d3.select(containerId).append('svg').attr('width', totalWidth).attr('height', height)

  let startX = 0

  // Draw rectangles for each color
  svg
    .selectAll('rect')
    .data(colorsData)
    .enter()
    .append('rect')
    .attr('x', (d) => {
      const x = startX
      startX += d.percentage * totalWidth
      return x
    })
    .attr('y', 0)
    .attr('width', (d) => d.percentage * totalWidth)
    .attr('height', height)
    .attr('fill', (d) => `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`)
}
