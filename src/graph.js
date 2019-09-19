import CanvasLibrary from './helpers/canvasLibrary'

import Shadow from './lib/ext/components/shadow'
import Line from './lib/ext/components/line'
import GridLines from './lib/ext/components/gridLines'
import HoverLine from './lib/ext/components/hoverLine'
import Border from './lib/ext/components/border'
import Labels from './lib/ext/components/labels'

import Renderer from './lib/ext/renderer'
import Circles from './lib/ext/components/circles';
import Background from './lib/ext/components/background';

export default class graph {
  constructor (canvas, parent, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.lib = new CanvasLibrary(this.ctx, this.canvas)
    this.renderer = new Renderer(this.lib)
    this.height = this.canvas.height
    this.options = this.defaultSettings(options)
    this.crest = this.trough = 0
    this.parent = parent
    this.data = []
    this.outerPadding = this.options.outerPadding
    this.innerPadding = this.options.innerPadding
    this.mousePos = { x: undefined, y: undefined }
    this.datapoints = []
    this.images = []
    this.setSize()
    this.features()
    this.ready = false
  
  
    let left = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-right').replace(' px', ''))
    let right = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-left').replace(' px', ''))
    let top = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-top').replace(' px', ''))
    let bottom = parseInt(window.getComputedStyle(this.parent).getPropertyValue('padding-bottom').replace(' px', ''))
    this.width = (this.parent.offsetWidth - left - right)
    this.height = (this.parent.offsetHeight - top - bottom)

    this.canvas.addEventListener('mousemove', (e) => {
      this.updateHoverLine(e)
    })
  }
  features () {
    this.features = [
      { key: 'withShadow', cb: this.withShadow.bind(this) },
      { key: 'withFullShadow', cb: this.withFullShadow.bind(this) },
      { key: 'withBackground', cb: this.withBackground.bind(this) },
      { key: 'withCircles', cb: this.withCircles.bind(this) },
      { key: 'withLabels', cb: this.withLabels.bind(this) },
      { key: 'withLine', cb: this.withLine.bind(this) },
      { key: 'withGridLines', cb: this.withGridLines.bind(this) },
      { key: 'withSideShade', cb: this.withSideShade.bind(this) },
      { key: 'withHoverLine', cb: this.withHoverLine.bind(this) },
      { key: 'withBorder', cb: this.withBorder.bind(this) }
    ]
  }
  updateHoverLine (e) {
    this.mousePos = { x: e.offsetX, y: e.offsetY }
    this.draw()
    this.renderer.render()
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
    this.renderer.render()
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
      hoverLine: { lineColour: '#090909', width: 2, textboxBackground: 'blue', textboxFontSize: 11, textboxTextColour: '#fff', boxWidth: 14, boxHeight: 7, radius: 3 },
      lastUpdated: { fontsize: 11 },
      sideShade: { gradient: [
        { stop: 0, colour: 'rgba(22,22,22, 1)' },
        { stop: 0.3, colour: 'rgba(22,22,22, 0.7)' },
        { stop: 1, colour: 'rgba(0,0,0,0)' }
      ] },
      circles: { colour: '#fff', border: true, radius: 5, borderRadius: 1, borderColour: 'rgb(208, 208, 208)' },
      gridLines: { width: 1, colour: '#dbdbdb', border: [true, true, true, true], drawHorizontal: true, drawVertical: true },
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
      outerPadding: { top: 20, bottom: 20, left: 20, right: 20 },
      innerPadding: { top: 0, bottom: 0, left: 0, right: 0 },
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
          x: (Math.round(this.drawableWidth / (data.length - 1) * d) + this.innerPadding.left + this.outerPadding.left),
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
    this.setSize()
    for (let i in this.options.build) {
      this.runFeature(this.options.build[i])
    }
  }
  setLastUpdated (date) {
    this.lastUpdated = date
    this.update()
    this.draw()
  }
  getBuffer () {

  }
  withLastUpdated () {
    this.lib.setTextBaseline('top')
    this.lib.setFont(this.options.font, this.options.aesthetics.lastUpdated.fontsize, 600)
    this.lib.drawText('Last updated: ' + this.lastUpdated, this.options.innerPadding.left + this.options.outerPadding.left,
      this.drawableHeight + this.innerPadding.top + this.outerPadding.top)
  }
  withHoverLine () {
    const { drawableWidth, datapoints, outerPadding, outerHeight, mousePos, width, height } = this
    const { font } = this.options
    const { width: lineWidth, lineColour, boxWidth, boxHeight, radius, textboxBackground, textboxFontSize, textboxTextColour} = this.options.aesthetics.hoverLine
    let hoverLine = new HoverLine({drawableWidth, datapoints, outerPadding, outerHeight, mousePos, width, height, font, 
                                      lineWidth, lineColour, boxWidth, boxHeight, radius, textboxFontSize, textboxBackground, textboxTextColour }, datapoints)
    if(hoverLine.getLine()){
      this.renderer.add(hoverLine.getLine())
      this.renderer.add(hoverLine.getTextboxBg())
      this.renderer.add(hoverLine.getText())
    }
  } 
  withSideShade () {
    let gradient = this.lib.createLinearGradient(0, 0, this.width, 0, this.options.aesthetics.sideShade.gradient)
    this.lib.setFillStyle(gradient)
    this.lib.fillRectangle(0, 0, this.width, this.height)
    return this
  }
  withBackground () {
    const { colour } = this.options.aesthetics.background
    const { width, height } = this

    let background = new Background({colour, width, height})

    this.renderer.add(background.getObject())
    return this
  }
  withCircles () {
    const { colour, radius, border, borderRadius, borderColour } = this.options.aesthetics.circles

    let circles = new Circles({colour, radius, border, borderRadius, borderColour}, this.datapoints)
    circles.circles().forEach(r => this.renderer.add(r))
    return this
  }
  withGridLines () {
    const { horizontal, vertical } = this.options.lines
    const { colour, width } = this.options.aesthetics.gridLines
    const { innerPadding, outerPadding, height, outerWidth, outerHeight } = this

    let gridLines = new GridLines({innerPadding, outerPadding, height, colour, vertical, horizontal, outerWidth, outerHeight, width})
    
    gridLines.verticalLines().forEach(line => this.renderer.add(line))
    gridLines.horizontalLines().forEach(line => this.renderer.add(line))
    return this
  }
  withBorder () {
    const { colour, width } = this.options.aesthetics.gridLines
    const { innerPadding, outerPadding, height, outerWidth, outerHeight } = this

    let border = new Border({innerPadding, outerPadding, height, colour, outerWidth, outerHeight, width})

    this.renderer.add(border.getObject())
  }
  // refactor these get options destructured here then send it to shadow
  withShadow () {
    const { gradient } = this.options.aesthetics.shadow
    const { height, width, datapoints, outerPadding, innerPadding } = this
    let fill = {x: 0, y: 0, x2: 0, y2: (this.height * 1.2), stops: gradient}

    let shadow = new Shadow({height, width, fill, outerPadding, innerPadding, gradient: true}, datapoints)

    this.renderer.add(shadow.getObject())
    return this
  }
  withFullShadow () {
    const { height, width, datapoints, outerPadding, innerPadding } = this
    const { colour } = this.options.aesthetics.fullShadow

    let shadow = new Shadow({ height, width, datapoints, outerPadding, colour, innerPadding }, datapoints)

    this.renderer.add(shadow.getObject())
    return this
  }
  withLine () {
    const { outerPadding, innerPadding, datapoints } = this
    const { colour } = this.options.aesthetics.line
    
    let line = new Line({ stroke: colour, outerPadding, innerPadding }, datapoints)

    this.renderer.add(line.getObject())
    return this
  }
  withLabels () {    
    let width = this.drawableWidth - this.lib.textMetrics(this.crest).width

    const { font, labels } = this.options.aesthetics
    const { fontsize, colour } = labels

    let label = new Labels({ font, size: fontsize, thickness: 600, baseline: 'middle', align: 'left', colour}, 
                        {text: this.crest, x: this.outerPadding.left + this.innerPadding.left + width + 3, y: this.outerPadding.top + this.innerPadding.top})
    
    this.renderer.add(label.label())

    return this
  }
}
