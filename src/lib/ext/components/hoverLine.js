import graphComponent from './graphComponent'

import Text from './../renderable/text';
import Line from '../renderable/line';
import RoundedRect from '../renderable/roundedRect';

export default class HoverLine extends graphComponent {
  constructor(options, data) {
    super(options, data)
    this.setup()
  }

  setupLayout () {

  }
  setup() {
    const { drawableWidth, outerPadding, outerHeight, mousePos, width, height, font, 
          lineThickness, lineColour, boxWidth, boxHeight, radius, textboxBackground, textboxTextColour, textboxFontSize } = this.options
    let datapoints = this.data

    let split = (drawableWidth / (datapoints.length)) / 2
    
    let paddingTotal = (outerPadding.left)

    for (let i in datapoints) {
      if ((Math.abs(mousePos.x - datapoints[i].x) - paddingTotal) < split) {
        let x = datapoints[i].x
        let y = datapoints[i].y

        this.line = new Line(x, outerPadding.top, x, outerPadding.top + outerHeight)
        this.line.setStroke(lineColour, lineThickness)
        
        // Make sure X and Y bounds dont go above or minus 0/height and left/right
        if (x + boxWidth > width) {
          x -= boxWidth
        }
        if (y + boxHeight > height) {
          y -= boxHeight
        }
        if (y - boxHeight < 0) {
          y += boxHeight
        }
        if (x - boxWidth < 0) {
          x += boxWidth
        }

        // Hover line text box
        this.textboxbg = new RoundedRect(x, y, boxWidth, boxHeight, radius)
        this.textboxbg.setFill(textboxBackground)

        // Hover line text
        this.text = new Text(x, y, datapoints[i].display)
        this.text.setFont(font, textboxFontSize, 600, 'middle', 'center')
        this.text.setFill(textboxTextColour)

        // break to stop waste of loop
        break
      }
    }
  }
  getText () {
    return this.text
  }
  getTextboxBg () {
    return this.textboxbg
  }
  getLine () {
    return this.line
  }
}
