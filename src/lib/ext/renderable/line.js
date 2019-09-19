import Renderable from './renderable'
export default class Line extends Renderable {
  constructor (x, y, x2, y2) {
    super('line')
    this.x = x
    this.x2 = x2
    this.y = y
    this.y2 = y2
  }
  getCoords () {
    return {x: this.x, y: this.y, x2: this.x2, y2: this.y2}
  }
}
