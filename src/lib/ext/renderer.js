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

      // draw
      switch (renderable.type) {
        case 'polygon':
          this.lib.drawPolygon(renderable.getPoints())
          break
        case 'segment':
          this.lib.drawLines(renderable.getPoints())
          break
      }

      // FILL
      if (renderable.fill) {
        this.lib.setFillStyle(renderable.fillStyle)
        this.lib.fill()
      }
      if (renderable.stroke) {
        this.lib.setStrokeStyle(renderable.strokeStyle.colour)
        this.lib.setStrokeWidth(renderable.strokeStyle.width)
        this.lib.stroke()
      }
    }
  }
}
