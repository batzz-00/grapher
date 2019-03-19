import Shape from './shape'
export default class Segment extends Shape {
  constructor (points) {
    super(points, 'segment')
  }
}
