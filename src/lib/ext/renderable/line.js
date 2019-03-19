import Shape from './shape'
export default class Poly extends Shape {
  constructor (x, y, x2, y2) {
    super([[x, y], [x2, y2]], 'line')
  }
}
