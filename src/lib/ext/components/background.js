import graphComponent from './graphComponent'
import Rect from '../renderable/rect';
export default class Background extends graphComponent {
  setupLayout () {

  }
  getObject () {
    const { width, height, colour } = this.options
    let bg = new Rect(0, 0, width, height)
    bg.setFill(colour)
    return bg
  }
}
