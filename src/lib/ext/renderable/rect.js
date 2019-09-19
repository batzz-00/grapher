import Renderable from './renderable'
export default class Rect extends Renderable {
  constructor (x, y, width, height) {
    super('rect')
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  getCoords() {
    return {x: this.x, y: this.y, width: this.width, height: this.height}
  }
}
