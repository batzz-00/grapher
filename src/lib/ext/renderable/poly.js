import Sprite from './sprite'
export default class Poly extends Sprite {
  constructor (points) {
    super(points, 'polygon')
  }
}
