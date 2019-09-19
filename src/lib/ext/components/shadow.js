import Poly from '../renderable/poly'
import graphComponent from './graphComponent'
import * as fillTypes from '../renderable/fillType'
export default class Shadow extends graphComponent {
  setupLayout () {

  }
  getObject () {
    const { data } = this
    const { outerPadding, innerPadding, height, fill, gradient } = this.options
    let padding = Object.keys(innerPadding).map(k => ({[k]: innerPadding[k] + outerPadding[k]})).reduce((p, n) => ({...n, ...p}), {})
    let a = [{ x: padding.left, y: data[0].y },
      ...data, { x: data[data.length - 1].x, y: height - padding.bottom }, { x: padding.left, y: height - padding.bottom }]
    let points = a.map(d => [d.x, d.y])
    let polyPoints = [[padding.left, data[0].y], ...points, [data[data.length - 1].x, height - padding.bottom], [padding.left, height - padding.bottom]]
    let pol = new Poly(polyPoints)

    pol.setFill(fill, gradient ? fillTypes.gradient : fillTypes.fill)
    return pol
  }
}
