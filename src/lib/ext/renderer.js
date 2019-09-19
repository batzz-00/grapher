import * as fillType from './renderable/fillType'
export default class Renderer {
  constructor (lib) {
    this.lib = lib
    this.renderables = []
  }
  add (renderable) {
    this.renderables.push(renderable)
  }
  pop () {
    this.renderables.pop()
  }
  render () {
    while (this.renderables.length !== 0) {
      let renderable = this.renderables.shift()
      // reset colours here maybe

      if (renderable.font){
        const { font, size, weight, baseline, align } = renderable.fontStyle
        this.lib.setFont(font, size, weight)
        if(baseline){this.lib.setTextBaseline(baseline)}
        if(align){this.lib.setTextAlign(align)}
      }

      // draw
      const coords = renderable.getCoords()
      switch (renderable.type) {
        case 'polygon':
          this.lib.drawPolygon(renderable.getPoints())
          break
        case 'segment':
          this.lib.drawLines(coords)
          break
        case 'line':
          this.lib.drawLine(coords.x, coords.y, coords.x2, coords.y2)
          break
        case 'rect':
          this.lib.drawRectangle(coords.x, coords.y, coords.width, coords.height)
          break
        case 'circle':
          this.lib.drawCircle(coords.x, coords.y, coords.radius, 0, 2 * Math.PI)
          break
        case 'rounded-rect':
          this.lib.drawRoundedRectangle(coords.x, coords.y, coords.width, coords.height, coords.radius)
          break
        // case 'text':
        //   this.lib.drawText(coords.text, coords.x, coords.y)
        //   break
      }
      
      // FILL
      if (renderable.fill) {
        switch(renderable.fillType){
          case fillType.fill:
            if(renderable.type === "text"){
              this.lib.setFillStyle(renderable.fillStyle)
              if(renderable.font){
                console.log(renderable.fontStyle)
                this.lib.setFont(renderable.fontStyle.font, renderable.fontStyle.size, renderable.fontStyle.thickness)
                this.lib.setTextBaseline(renderable.fontStyle.baseline)
                this.lib.setTextAlign(renderable.fontStyle.align)
              }
              this.lib.drawText(coords.text, coords.x, coords.y)
            } else {
              this.lib.setFillStyle(renderable.fillStyle)
              this.lib.fill()
            }
            break
          case fillType.gradient:
            const { x, y, x2, y2, stops } = renderable.fillStyle
            this.lib.setFillStyle(this.lib.createLinearGradient(x, x2, y, y2, stops))
            this.lib.fill()
            break
        }
      }
 
      if (renderable.stroke) {
        this.lib.setStrokeStyle(renderable.strokeStyle.colour)
        this.lib.setStrokeWidth(renderable.strokeStyle.width)
        this.lib.stroke()
      }
    }
  }
}
