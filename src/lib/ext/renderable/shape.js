export default class sprite {
  constructor (points, type) {
    this.points = points
    this.fill = null
    this.fillStyle = null
    this.stroke = null
    this.strokeStyle = null
    this.type = type
  }
  getPoints () {
    return this.points.map(point => ({ x: point[0], y: point[1] }))
  }
  getBounds () {

  }
  setFill (fill) {
    this.fill = true
    this.fillStyle = fill
  }
  setStroke (colour, width = 1) {
    this.stroke = true
    this.strokeStyle = { colour, width }
  }
}
