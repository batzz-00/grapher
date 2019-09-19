import Text from '../renderable/text'
import graphComponent from './graphComponent'
export default class Labels extends graphComponent {
  constructor(options, data) {
    super(options, data)
  }

  label () {
    const { data } = this
    const { font, size, thickness, baseline, align, colour } = this.options

    let text = new Text(data.x, data.y, data.text)

    text.setFont(font, size, thickness, baseline, align)
    text.setFill(colour)
    return text
  }
}
