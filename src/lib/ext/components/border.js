import graphComponent from './graphComponent'

import Rect from './../renderable/rect';

export default class Border extends graphComponent {
  setupLayout () {

  }
  getObject () {
    const { outerPadding, outerWidth, outerHeight, width, colour } = this.options
    let border = new Rect(outerPadding.left, outerPadding.top, outerWidth, outerHeight)
    border.setStroke(colour, width)
    return border
  }
}
