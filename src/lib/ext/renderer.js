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
      let renderable = this.renderables.pop()
      // reset colours here maybe

      // draw
      switch (renderable.type) {
        case 'polygon':
          this.lib.drawPolygon(renderable.getPoints())
          break
      }

      // FILL
      if (renderable.fill) {
        this.lib.setFillStyle(renderable.fillStyle)
        this.lib.fill()
      }
      if (renderable.stroke) {
        this.lib.setStrokeStyle(renderable.stroke)
        this.lib.setStrokeWidth(renderable.strokeStyle.width || 1)
        this.lib.stroke()
      }
    }
  }
}
