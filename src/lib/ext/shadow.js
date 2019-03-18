import Poly from '../ext/renderable/poly'
import graphComponent from './graphComponent'
export default class Shadow extends graphComponent {
  setupLayout () {

  }
  draw () {
    const { data } = this
    const { innerPadding, height, fill } = this.options
    let points = data.map(d => [d.x, d.y])
    let polyPoints = [[innerPadding.left, data[0].y], ...points, [data[data.length - 1].x, height - innerPadding.bottom], [innerPadding.left, height - innerPadding.bottom]]
    let pol = new Poly(polyPoints)
    pol.setFill(fill)
    return pol
    // let gradient = lib.createLinearGradient(0, 0, 0, (height * 1.2) ,gradient)
    // lib.setFillStyle(gradient)
    // lib.fill()
    // return this
  }
}
