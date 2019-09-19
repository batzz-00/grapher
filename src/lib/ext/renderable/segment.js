import Renderable from './renderable'
export default class Segment extends Renderable {
  constructor (points) {
    super('segment')
    this.points = points
  }
  getCoords () {
    return this.points.map(point => ({ x: point[0], y: point[1] }))
  }
}
