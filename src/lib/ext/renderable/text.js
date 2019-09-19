import Renderable from "./renderable";

export default class Text extends Renderable{
  constructor (x, y, text) {
    super('text')
    this.x = x
    this.y = y
    this.text = text
  }
  getCoords () {
    return {x: this.x, y: this.y, text: this.text}
  }
}