import graphComponent from './graphComponent'

import Line from './../renderable/line';
import Rect from './../renderable/rect';

export default class gridLines extends graphComponent {
  setupLayout () {

  }
  border () {
    const { outerPadding, outerWidth, outerHeight, width, colour } = this.options
    let border = new Rect(outerPadding.left, outerPadding.top, outerWidth, outerHeight)
    border.setStroke(colour, width)
    return border
  }
  verticalLines() {
    const { outerPadding: oPad, vertical, outerWidth: oWidth, outerHeight: oHeight, width, colour } = this.options
    let lines = [] 
    let v = vertical + 1

    for(let i=1; i <= vertical; i++){
      let line = new Line(Math.round((oWidth / v)* i) + oPad.left, oPad.top, Math.round(oWidth / v * i) + oPad.left, oHeight + oPad.top)
      line.setStroke(colour, width)
      lines.push(line)
    }     
    return lines
  }

  horizontalLines() {
    const { outerPadding: oPad, horizontal, outerWidth: oWidth, outerHeight: oHeight, width, colour } = this.options
    let lines = [] 
    let h = horizontal + 1
    
    for(let i=1; i <= horizontal; i++){
      let line = new Line(oPad.left, oPad.top + (Math.round(oHeight / h) * i), oPad.left + oWidth, oPad.top + (Math.round(oHeight / h) * i))
      line.setStroke(colour, width)
      lines.push(line)
    }     
    return lines
  }
}
