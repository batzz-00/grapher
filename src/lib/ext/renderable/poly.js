import Renderable from './renderable';
export default class Poly extends Renderable {
  constructor (points) {
    super('polygon')
    this.points = points
  }
  getPoints () {
    return this.points.map(point => ({ x: point[0], y: point[1] }))
  }
}
