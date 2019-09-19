import Renderable from './renderable'
export default class Circle extends Renderable {
  constructor (x, y, radius) {
    super('circle')
    this.x = x
    this.y = y
    this.radius = radius
  }
  getCoords () {
    return {x: this.x, y: this.y, radius: this.radius}
  }
}
