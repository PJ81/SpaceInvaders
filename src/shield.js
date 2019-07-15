import * as Const from "./const.js"

const
  TOPR = 0,
  TOPL = 4,
  BOTR = 8,
  BOTL = 12,
  BLOCK = 16;

class Niner {
  constructor(t, x, y, w, h) {
    this.tile = t;
    this.hp = 4
    this.box = {
      t: y,
      l: x,
      r: x + w,
      b: y + h
    };
  }
}

class Shield {
  constructor(x, y) {
    this.grf = [];
    this.grf.push(new Niner(TOPL, x - 40, y, 20, 12));
    this.grf.push(new Niner(BLOCK, x - 20, y, 20, 12));
    this.grf.push(new Niner(TOPR, x, y, 20, 12));
    this.grf.push(new Niner(BLOCK, x - 40, y + 12, 20, 12));
    this.grf.push(new Niner(BLOCK, x - 20, y + 12, 20, 12));
    this.grf.push(new Niner(BLOCK, x, y + 12, 20, 12));
    this.grf.push(new Niner(BOTL, x - 40, y + 24, 20, 12));
    this.grf.push(new Niner(BOTR, x, y + 24, 20, 12));
  }
}

export default class Shields {
  constructor(res, x, y, stp) {
    this.shields = [];

    for (let s = 0; s < 4; s++) {
      this.shields.push(new Shield(x, y));
      x += stp;
    }

    this.bitmaps = [];
    for (let b = 0; b < 8; b++) {
      this.bitmaps.push(res.images[b + Const.TOPA]);
    }
    for (let b = 0; b < 8; b++) {
      this.bitmaps.push(res.images[b + Const.BOTA]);
    }
    for (let b = 0; b < 4; b++) {
      this.bitmaps.push(res.images[b + Const.FULLA]);
    }
  }

  reset() {
    //
  }

  hide() {
    this.shields.forEach(s => {
      s.grf.forEach(g => {
        g.hp = 0;
      });
    });
  }

  draw(ctx) {
    this.shields.forEach(s => {
      s.grf.forEach(g => {
        if (g.hp > 0) {
          const bmp = this.bitmaps[4 - g.hp + g.tile];
          ctx.drawImage(bmp, g.box.l, g.box.t);
        }
      });
    });
  }
}