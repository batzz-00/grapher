import Segment from '../renderable/segment'
import graphComponent from './graphComponent'
export default class Line extends graphComponent {
  setupLayout () {

  }
  getObject () {
    const { data } = this
    const { stroke } = this.options
    let points = data.map(d => [d.x, d.y])
    let pol = new Segment(points)
    pol.setStroke(stroke)
    return pol
  }
}
