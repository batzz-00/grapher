import Shape from './shape'
export default class Poly extends Shape {
  constructor (points) {
    super(points, 'polygon')
  }
}
