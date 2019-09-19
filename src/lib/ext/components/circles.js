//     const { colour, radius, border, borderRadius, borderColour } = this.options.aesthetics.circles
//     this.datapoints.forEach(d => {
//       if (border) {
//         this.lib.setFillStyle(borderColour)
//         this.lib.drawCircle(d.x, d.y, radius + borderRadius, 0, 2 * Math.PI)
//         this.lib.fill()
//       }
//       this.lib.setFillStyle(colour)
//       this.lib.drawCircle(d.x, d.y, radius, 0, 2 * Math.PI)
//       this.lib.fill()
//     })
//     return this
import Circle from '../renderable/circle'
import graphComponent from './graphComponent'
export default class Circles extends graphComponent {
  setupLayout () {

  }
  
  cf(x, y, radius, fill=null, stroke=null){
    let circle = new Circle(x, y, radius)
    if(fill){circle.setFill(fill)}
    if(stroke){circle.setStroke(stroke)}
    return circle
  }

  circles () {
    const { data } = this
    const { colour, radius, border, borderRadius, borderColour }  = this.options

    return data.map(d=> this.cf(d.x, d.y, radius, colour)).concat(border ? data.map(d=> this.cf(d.x, d.y, radius+ borderRadius, null, borderColour)) : []);
  }
}
