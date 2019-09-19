import Renderable from './renderable'
export default class RoundedRect extends Renderable {
  constructor (x, y, width, height, radius) {
    super('rounded-rect')
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.radius = radius
  }
  getCoords() {
    return {x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius}
  }
}
