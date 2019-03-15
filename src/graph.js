import CanvasLibrary from './helpers/canvasLibrary'
export default class graph {
  constructor (canvas, parent, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.lib = new CanvasLibrary(this.ctx, this.canvas)
    this.height = this.canvas.height
    this.options = this.defaultSettings(options)
    this.crest = this.trough = 0
    this.parent = parent
    this.data = []
    this.outerPadding = this.options.outerPadding
    this.innerPadding = this.options.innerPadding
    this.mousePos = {x: undefined, y: undefined}
    this.datapoints = []
    this.images = []
    this.setSize()
    this.features()
    this.ready = false
    this.canvas.addEventListener('mousemove', (e) => {
      this.updateHoverLine(e)
    })
  }
  features () {
    this.features = [
      { key: 'withShadow', cb: this.withShadow.bind(this) },
      { key: 'withBackground', cb: this.withBackground.bind(this) },
      { key: 'withCircles', cb: this.withCircles.bind(this) },
      { key: 'withInfo', cb: this.withInfo.bind(this) },
      { key: 'withLabels', cb: this.withLabels.bind(this) },
      { key: 'withLine', cb: this.withLine.bind(this) },
      { key: 'withGridLines', cb: this.withGridLines.bind(this) },
      { key: 'withSideShade', cb: this.withSideShade.bind(this) },
      { key: 'withHoverLine', cb: this.withHoverLine.bind(this) }
    ]
  }
  updateHoverLine (e) {
    this.mousePos = {x: e.offsetX, y: e.offsetY}
    this.draw()
  }
  runFeature (key) {
    for (let k in this.features) {
      if (this.features[k].key === key) {
        this.features[k].cb()
        break
      }
    }
  }
  addData (reading) {
    this.data.push({ point: reading })
    if (this.data.length > 20) {
      this.data.splice(0, 10)
    }
    this.update()
    this.draw()
  }
  setOptions (options) {
    this.options = this.defaultSettings(options)
  }
  setData (data) {
    this.data = data
    this.update()
    this.draw()
  }
  resize (e) {
    // this.height = this.parent.getBoundingClientRect().height
    this.setSize()
    this.draw()
  }
  defaultSettings (options) {
    let aesthetics = {
      line: { width: 2, colour: 'rgba(57, 57, 57, 0.8)' },
      info: { colour: '#fff' },
      background: { colour: '#fff' },
      hoverLine: { lineColour: '#090909', width: 2, textboxBackground: '#090909', textboxFontSize: 11, textboxTextColour: '#999999', boxWidth: 14, boxHeight: 7, radius: 3 },
      lastUpdated: { fontsize: 11 },
      active: { activeColour: 'rgba(33, 218, 42, .8)', inactiveColour: '#f21212', border: 'rgba(38, 38, 38, .8)' },
      sideShade: { gradient: [
        { stop: 0, colour: 'rgba(22,22,22, 1)' },
        { stop: 0.3, colour: 'rgba(22,22,22, 0.7)' },
        { stop: 1, colour: 'rgba(0,0,0,0)' }
      ] },
      circles: { colour: '#fff', border: true, radius: 5, borderRadius: 1, borderColour: 'rgb(208, 208, 208)' },
      gridLines: { width: 1, colour: '#000', border: [true, true, true, true], drawHorizontal: true, drawVertical: true },
      shadow: { gradient: [
        { stop: 0, colour: '#3498db' },
        { stop: 1, colour: 'rgba(255, 255, 255,0)' }
      ] },
      fullShadow: { colour: '#60caca' },
      labels: { colour: '#656565', fontsize: 11 }
    }
    if (options.aesthetics) {
      for (let o in options.aesthetics) {
        aesthetics[o] = { ...aesthetics[o], ...options.aesthetics[o] }
      }
    }
    return {
      outerPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      innerPadding: { top: 5, bottom: 5, left: 0, right: 0 },
      build: ['withBackground', 'withGridLines', 'withLine'],
      fontsize: 14,
      font: 'Arial',
      active: false,
      lines: { horizontal: 4, vertical: 9 },
      ...options,
      aesthetics: aesthetics
    }
  }

  withFunctions () {

  }
  keyExists (obj, key) {
    if (typeof obj[key] !== 'undefined') {
      return true
    }
    return false
  }
  setSize () {
    let left = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-right').replace(' px', ''))
    let right = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-left').replace(' px', ''))
    let top = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-top').replace(' px', ''))
    let bottom = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-bottom').replace(' px', ''))
    this.width = (this.parent.offsetWidth - left - right)
    this.height = (this.parent.offsetHeight - top - bottom)
    this.drawableWidth = this.width - (this.outerPadding.left + this.outerPadding.right + this.innerPadding.left + this.innerPadding.right)
    this.drawableHeight = this.height - (this.outerPadding.top + this.outerPadding.bottom + this.innerPadding.bottom + this.innerPadding.top)
    this.outerWidth = this.width - (this.outerPadding.left + this.outerPadding.right)
    this.outerHeight = this.height - (this.outerPadding.top + this.outerPadding.bottom)
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.lib.scaleCanvas(this.canvas, this.ctx, this.width, this.height)
  }

  update () {
    let data = this.data
    let trough, crest
    for (let d in data) {
      let point = data[d].point.value
      trough = trough || point
      crest = crest || point
      if (point > crest) {
        crest = point
      }
      if (point < trough) {
        trough = point
      }
    }

    this.trough = trough
    this.crest = crest
    if (this.crest === this.trough || this.crest - this.trough <= 3) {
      this.crest += 3
      this.trough -= 3
    }
    this.drawableTrough = trough - this.innerPadding.bottom - this.outerPadding.bottom
    this.drawableCrest = crest + this.innerPadding.top + this.outerPadding.top
    this.updateDatapoints()
  }

  updateDatapoints () {
    this.datapoints = []
    let data = this.data
    let diff = this.crest - this.trough
    if (this.crest === this.trough) {
      this.diff = 1
    }
    for (let d in data) {
      let point = data[d].point
      this.datapoints.push(
        { display: point.display || point.value,
          x: (Math.round(this.drawableWidth / (data.length-1) * d) + this.innerPadding.left + this.outerPadding.left),
          y: Math.round((this.drawableHeight / diff) * (this.crest - parseInt(point.value))) + this.innerPadding.top + this.outerPadding.top })
    }
  }
  setActive (active) {
    this.options.active = active
  }
  setName (name) {
    this.options.name = name
  }
  draw () {
    this.lib.clear()
    for (let i in this.options.build) {
      this.runFeature(this.options.build[i])
    }
  }
  setLastUpdated (date) {
    this.lastUpdated = date
    this.update()
    this.draw()
  }
  getImage () {
    for (let i in this.images.images) {
      if (this.images.images[i].type === this.options.type) {
        return this.images.images[i].img
      }
    }
  }
  withLastUpdated () {
    this.lib.setTextBaseline('top')
    this.lib.setFont(this.options.font, this.options.aesthetics.lastUpdated.fontsize, 600)
    this.lib.drawText('Last updated: ' + this.lastUpdated, this.options.innerPadding.left + this.options.outerPadding.left,
      this.drawableHeight + this.innerPadding.top + this.outerPadding.top)
  }
  withHoverLine () {
    let split = (this.drawableWidth / (this.datapoints.length)) / 2
    // let paddingTotal = (this.outerPadding.left + this.outerPadding.right + this.innerPadding.left + this.innerPadding.right)
     
    let paddingTotal = (this.outerPadding.left)
    let options = this.options.aesthetics.hoverLine
    for (let i in this.datapoints) {
      if ((Math.abs(this.mousePos.x - this.datapoints[i].x) - paddingTotal) < split) {
        let x = this.datapoints[i].x
        let y = this.datapoints[i].y

        // Hover line
        this.lib.setLineWidth(options.width)
        this.lib.setStrokeStyle(options.lineColour)
        this.lib.drawLine(x, this.outerPadding.top, x, this.outerPadding.top + this.outerHeight)
        this.lib.stroke()

        // Make sure X and Y bounds dont go above or minus 0/height and left/right
        if (x + options.boxWidth > this.width) {
          x -= options.boxWidth
        }
        if (y + options.boxHeight > this.height) {
          y -= options.boxHeight
        }
        if (y - options.boxHeight < 0) {
          y += options.boxHeight
        }
        if (x - options.boxWidth < 0) {
          x += options.boxWidth
        }

        // Hover line text box
        this.lib.drawRoundedRectangle(x, y, options.boxWidth, options.boxHeight, options.radius)
        this.lib.setFillStyle(options.textboxBackground)
        this.lib.fill()

        // Hover line text
        this.lib.setTextBaseline('middle')
        this.lib.setTextAlign('center')
        this.lib.setFont(this.font, options.textboxFontSize, 600)
        this.lib.setFillStyle(options.textboxTextColour)
        this.lib.drawText(this.datapoints[i].display, x, y)

        // break to stop waste of loop
        break
      }
    }
  }

  withInfo () {
    // Text aligns and style
    this.lib.setTextAlign('left')
    this.lib.setTextBaseline('alphabetic')
    this.lib.setFillStyle(this.options.aesthetics.info.colour)

    // Draw name of sensor
    this.lib.setFont(this.options.font, this.options.fontsize, 600)
    this.lib.drawText(this.options.name, 35, 25)

    // Draw current reading of sensor
    this.lib.setFont(this.options.font, this.options.fontsize - 2, 400)
    this.lib.drawText(this.data[this.data.length - 1].reading + '° C', 15, 45)

    return this
  }
  withSideShade () {
    let gradient = this.lib.createLinearGradient(0, 0, this.width, 0, this.options.aesthetics.sideShade.gradient)
    this.lib.setFillStyle(gradient)
    this.lib.fillRectangle(0, 0, this.width, this.height)
    return this
  }
  withActive () {
    this.lib.setStrokeStyle(this.options.aesthetics.active.border)
    if (this.options.active) {
      this.lib.setFillStyle(this.options.aesthetics.active.activeColour)
    } else {
      this.lib.setFillStyle(this.options.aesthetics.active.inactiveColour)
    }
    this.lib.drawCircle(this.width - 15, 16, 5, 0, 2 * Math.PI)
    this.lib.fill()
    this.lib.stroke()
    return this
  }
  withBackground () {
    this.lib.setFillStyle(this.options.aesthetics.background.colour)
    this.lib.fillRectangle(0, 0, this.width, this.height)
    return this
  }
  withCircles () {
    const { colour, radius, border, borderRadius, borderColour } = this.options.aesthetics.circles
    this.datapoints.forEach(d => {
      if (border) {
        this.lib.setFillStyle(borderColour)
        this.lib.drawCircle(d.x, d.y, radius + borderRadius, 0, 2 * Math.PI)
        this.lib.fill()
      }
      this.lib.setFillStyle(colour)
      this.lib.drawCircle(d.x, d.y, radius, 0, 2 * Math.PI)
      this.lib.fill()
    })
    return this
  }
  withGridLines () {
    let horizontal = this.options.lines.horizontal
    let vertical = this.options.lines.vertical
    const { drawHorizontal, drawVertical, border } = this.options.aesthetics.gridLines

    this.lib.setLineWidth(this.options.aesthetics.gridLines.width)
    this.lib.setStrokeStyle(this.options.aesthetics.gridLines.colour)

    if (border) {
      this.lib.drawRectangle(this.outerPadding.left, this.outerPadding.top, this.outerWidth, this.outerHeight)
      this.lib.stroke()
    }
    if (drawVertical) {
      for (let i = 1; i <= vertical; i++) {
        let v = vertical + 1
        this.lib.drawLine(Math.round(this.outerWidth / v * i) + this.outerPadding.left, this.outerPadding.top,
          Math.round(this.outerWidth / v * i) + this.outerPadding.left, this.outerHeight + this.outerPadding.top)
        this.lib.stroke()
      }
    }
    if (drawHorizontal) {
      for (let i = 1; i <= horizontal; i++) {
        let h = horizontal + 1
        this.lib.drawLine(this.outerPadding.left, this.outerPadding.top + (Math.round(this.outerHeight / h) * i),
          this.outerPadding.left + this.outerWidth, this.outerPadding.top + (Math.round(this.outerHeight / h) * i))
        this.lib.stroke()
      }
    }
    return this
  }
  withShadow () {
    let data = this.datapoints
    this.lib.drawPolygon([{ x: this.padding.left, y: data[0].y },
      ...data, { x: data[data.length - 1].x, y: this.height - this.padding.bottom }, { x: this.padding.left, y: this.height - this.padding.bottom }])
    let gradient = this.lib.createLinearGradient(0, 0, 0, (this.height * 1.2), this.options.aesthetics.shadow.gradient)
    this.lib.setFillStyle(gradient)
    this.lib.fill()
    return this
  }
  withFullShadow () {
    let data = this.datapoints
    this.lib.drawPolygon([{ x: this.padding.left, y: data[0].y },
      ...data, { x: data[data.length - 1].x, y: this.height - this.padding.bottom }, { x: this.padding.left, y: this.height - this.padding.bottom }])
    this.lib.setFillStyle(this.options.aesthetics.fullShadow.colour)
    this.lib.fill()
    return this
  }
  withLine () {
    let data = this.datapoints
    this.lib.setLineWidth(this.options.aesthetics.line.width)
    this.lib.drawLines([{ x: this.outerPadding.left + this.innerPadding.left, y: data[0].y }, ...data])
    this.lib.setStrokeStyle(this.options.aesthetics.line.colour)
    this.lib.stroke()
    return this
  }
  withLabels () {
    this.lib.setFillStyle(this.options.aesthetics.labels.colour)
    this.lib.setFont(this.options.aesthetics.font, this.options.aesthetics.labels.fontsize, 600)
    this.lib.setTextAlign('left')
    this.lib.setTextBaseline('middle')
    this.lib.drawText(this.crest, this.outerPadding.left + this.innerPadding.left + this.drawableWidth + 3, this.outerPadding.top + this.innerPadding.top)

    this.lib.setTextAlign('left')
    this.lib.setTextBaseline('middle')
    this.lib.drawText(this.trough, this.outerPadding.left + this.innerPadding.left + this.drawableWidth + 3, this.drawableHeight + this.outerPadding.top + this.innerPadding.top)
    return this
  }
}
