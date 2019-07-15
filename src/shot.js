export default class Shot {
  constructor() {
    this.x;
    this.y;
    this.box = {
      l: 0,
      t: 0,
      r: 0,
      b: 0,
    };
    this.alive = false;
    this.frame = 0;
    this.animTime = .3;
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
    this.box = {
      l: 0,
      t: 0,
      r: 0,
      b: 0,
    };
  }
}