import * as d3 from "d3"

export function drawZigzag(containerId) {
  console.log("drawZigzag")
  d3.select(containerId).selectAll("*").remove()

  const width = 200
  const height = 200

  const gridSize = 50
  const cols = 4
  const rows = 4

  const svg = d3.select(containerId).append("svg").attr("width", width).attr("height", height)

  // draw grid
  for (let i = 0; i <= cols; i++) {
    svg
      .append("line")
      .attr("x1", i * gridSize)
      .attr("y1", 0)
      .attr("x2", i * gridSize)
      .attr("y2", gridSize * rows)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  }

  for (let j = 0; j <= rows; j++) {
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", j * gridSize)
      .attr("x2", gridSize * cols)
      .attr("y2", j * gridSize)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  }

  const connections = [
    [
      [0, 0],
      [1, 0],
    ],

    [
      [1, 0],
      [0, 1],
    ],

    [
      [0, 1],
      [0, 2],
    ],

    [
      [0, 2],
      [1, 1],
    ],

    [
      [1, 1],
      [2, 0],
    ],

    [
      [2, 0],
      [3, 0],
    ],
    [
      [3, 0],
      [2, 1],
    ],
    [
      [2, 1],
      [1, 2],
    ],
    [
      [1, 2],
      [0, 3],
    ],
    [
      [0, 3],
      [1, 3],
    ],
    [
      [1, 3],
      [2, 2],
    ],
    [
      [2, 2],
      [3, 1],
    ],
    [
      [3, 1],
      [3, 2],
    ],
    [
      [3, 2],
      [2, 3],
    ],
    [
      [2, 3],
      [3, 3],
    ],
  ]

  // connections
  connections.forEach((pair) => {
    const [[x1, y1], [x2, y2]] = pair
    svg
      .append("line")
      .attr("x1", x1 * gridSize + gridSize / 2)
      .attr("y1", y1 * gridSize + gridSize / 2)
      .attr("x2", x2 * gridSize + gridSize / 2)
      .attr("y2", y2 * gridSize + gridSize / 2)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  })
}
