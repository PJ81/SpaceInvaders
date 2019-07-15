import Vector from "./vector.js";
import * as Const from "./const.js";

class Explo {
  constructor() {
    this.pos = new Vector();
    this.time;
    this.next;
  }
}

export default class Explosion {
  constructor(prt) {
    this.particles = prt;
    this.explo = [];
    for (let r = 0; r < 100; r++) {
      this.explo.push(new Explo());
    }
  }

  start(x = 0, y = 0, tm = 0) {
    for (let d = 0, len = this.explo.length; d < len; d++) {
      const p = this.explo[d];
      if (!p.alive) {
        p.alive = true;
        p.next = 0;
        p.pos.set(x, y);
        p.time = tm;
        return;
      }
    }
  }

  update(dt) {
    let ret = false;
    this.explo.forEach(el => {
      if (el.alive) {
        ret = true;
        if ((el.next -= dt) < 0) {
          el.next = .03;
          const q = Math.random() * Const.TWO_PI,
            vx = Math.random() * 10 + 5,
            gx = Math.random() * 16 + 4,
            sx = Math.random() * 12 + 4,
            clr = `rgb(${Math.random() * 55 + 200}, ${Math.random() * 55 + 200}, ${Math.random() * 55 + 100})`;
          this.particles.start(el.pos.x + vx * Math.cos(q), el.pos.y + vx * Math.sin(q), 0, 0, gx, gx, sx, sx, clr);
        }
        if ((el.time -= dt) < 0) {
          el.alive = false;
        }
      }
    });
    return ret;
  }
}