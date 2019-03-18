import Sprite from './sprite'
export default class Rect extends Sprite {
  constructor (x, y, x2, y2) {
    super([[x, y], [x2, y2]])
  }
}
