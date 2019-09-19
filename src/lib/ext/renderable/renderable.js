import * as fillTypes from './fillType'
export default class Renderable {
  constructor (type) {
    this.fill = null
    this.fillStyle = null
    this.stroke = null
    this.strokeStyle = null
    this.type = type
  }
  setFill (fill, fillType = fillTypes.fill) {
    this.fillType = fillType
    this.fill = true
    this.fillStyle = fill
  }
  setStroke (colour, width = 1) {
    this.stroke = true
    this.strokeStyle = { colour, width }
  }
  setFont (font, size, thickness, baseline=null, align=null){
    this.font = true
    this.fontStyle = { font, size, thickness, baseline, align }
  }
  getCoords () {
  }
}
