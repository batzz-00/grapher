export default class CanvasLibrary {
  constructor (ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
  }
  setLineWidth (width) {
    this.ctx.lineWidth = width
  }
  setStrokeWidth (width) {
    this.ctx.strokeWidth = width
  }
  setStrokeStyle (style) {
    this.ctx.strokeStyle = style
  }
  setFillStyle (style) {
    this.ctx.fillStyle = style
  }
  setFont (font = 'Arial', size = 14, weight = 400) {
    this.ctx.font = weight + ' ' + size + 'px ' + font
  }
  setTextBaseline (baseline) {
    this.ctx.textBaseline = baseline
  }
  setTextAlign (align) {
    this.ctx.textAlign = align
  }
  createLinearGradient (x, y, x2, y2, stops) {
    x = x + 0.5
    y = y + 0.5
    x2 = x2 + 0.5
    y2 = y2 + 0.5
    let gradient = this.ctx.createLinearGradient(x, y, x2, y2)
    stops.forEach(stop => {
      gradient.addColorStop(stop.stop, stop.colour)
    })
    return gradient
  }

  drawRoundedRectangle (x, y, width, height, radius) {
    this.ctx.beginPath()
    // start at top left
    this.ctx.moveTo(x - width + radius, y - height - radius)
    // top left to top right
    this.ctx.lineTo(x + width - radius, y - height - radius)
    this.ctx.arcTo(x + width + radius, y - height - radius, x + width + radius, y - height + radius, radius)
    // top right to top bottom right
    this.ctx.lineTo(x + width + radius, y + height - radius)
    this.ctx.arcTo(x + width + radius, y + height + radius, x + width - radius, y + height + radius, radius)
    // bottom right to bottom left
    this.ctx.lineTo(x - width + radius, y + height + radius)
    this.ctx.arcTo(x - width - radius, y + height + radius, x - width - radius, y + height - radius, radius)
    // bottom left to top left
    this.ctx.lineTo(x - width - radius, y - height + radius)
    this.ctx.arcTo(x - width - radius, y - height - radius, x - width + radius, y - height - radius, radius)
    // finish? dunno why this needs to be here but it doesnt complete without.
    this.ctx.lineTo(x - width + radius, y - height - radius)
    this.ctx.closePath()
  }
  drawRectangle (x, y, width, height) {
    // autistic 0.5px fix on canvas drawing if its blurry
    x += (this.ctx.lineWidth / 2)
    y += (this.ctx.lineWidth / 2)
    width -= ((this.ctx.lineWidth / 2) * 2)
    height -= ((this.ctx.lineWidth / 2) * 2)

    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + width, y)
    this.ctx.lineTo(x + width, y + height)
    this.ctx.lineTo(x, y + height)
    this.ctx.lineTo(x, y)
    this.ctx.closePath()
  }

  drawText (text, x, y) {
    this.ctx.fillText(text, x, y)
  }
  drawLine (x, y, x2, y2) {
    if (this.ctx.lineWidth % 2 === 1) {
      if (y === y2) {
        y += 0.5
        y2 += 0.5
      }
      if (x === x2) {
        x += 0.5
        x2 += 0.5
      }
    }
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath()
  }
  drawCircle (x, y, radius, startangle, endangle) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, startangle, endangle)
    this.ctx.closePath()
  }
  drawPolygon (coordinates) {
    let first = coordinates.splice(0, 1)
    this.ctx.beginPath()
    this.ctx.moveTo(first.x, first.y)
    coordinates.forEach(c => {
      this.ctx.lineTo(c.x, c.y)
    })
    this.ctx.closePath()
  }
  drawLines (coordinates) {
    coordinates = this.ctx.lineWidth % 2 === 1 ? coordinates.map(c => ({ x: c.x + 0.5, y: c.y + 0.5 })) : coordinates
    let first = coordinates.splice(0, 1)
    this.ctx.beginPath()
    this.ctx.moveTo(first.x, first.y)
    coordinates.forEach(c => {
      this.ctx.lineTo(c.x + 0.5, c.y)
    })
  }
  drawImage (img, x, y, width, height) {
    try {
      this.ctx.drawImage(img, x, y, width, height)
    } catch (e) {
      if (e.name === TypeError) {
        console.log('Type error, invalid image supplied, check that it exists and has loaded!')
      }
    }
  }
  fillRoundedRectangle (x, y, width, height, radius) {
    this.drawRoundedRectangle(x, y, width, height, radius)
    this.fill()
  }
  fillRectangle (x, y, width, height) {
    this.ctx.fillRect(x, y, width, height)
  }
  stroke () {
    this.ctx.stroke()
  }
  fill () {
    this.ctx.fill()
  }
  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  textMetrics (text) {
    return this.ctx.measureText(text)
  }
  // mac retina screen scalingx
  scaleCanvas (canvas, context, width, height) {
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1

    // determine the 'backing store ratio' of the canvas context
    const backingStoreRatio = (
      context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
    )

    // determine the actual ratio we want to draw at
    const ratio = devicePixelRatio / backingStoreRatio

    if (devicePixelRatio !== backingStoreRatio) {
      // set the 'real' canvas size to the higher width/height
      canvas.width = width * ratio
      canvas.height = height * ratio

      // ...then scale it back down with CSS
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    } else {
      // this is a normal 1:1 device; just scale it simply
      canvas.width = width
      canvas.height = height
      canvas.style.width = ''
      canvas.style.height = ''
    }

    // scale the drawing context so everything will work at the higher ratio
    context.scale(ratio, ratio)
  }
}
