import Segment from '../renderable/segment'
import graphComponent from './graphComponent'
export default class Line extends graphComponent {
  setupLayout () {

  }
  getObject () {
    const { data } = this
    const { stroke, outerPadding, innerPadding } = this.options
    let points = [{ x: outerPadding.left + innerPadding.left, y: data[0].y }, ...data]
    points = points.map(d => [d.x, d.y])
    let pol = new Segment(points)
    pol.setStroke(stroke)
    return pol
  }
}
