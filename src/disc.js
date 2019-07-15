import Bitmap from "./bitmap.js";
import * as Const from "./const.js"

export default class Disc {
  constructor(res, w) {
    this.wid = w;
    this.alive = false;
    this.waitTime = Math.random() * 40 + 20;
    this.bitmap = new Bitmap(res.images[Const.DISC]);
    this.velX;
    this.points = 100;
    this.box = {
      t: 0,
      l: 0,
      r: 0,
      b: 0
    }
  }

  reset() {
    this.alive = false;
    this.waitTime = Math.random() * 40 + 20;
  }

  update(dt) {
    switch (this.alive) {
      case false:
        if ((this.waitTime -= dt) < 0) {
          this.alive = true;
          this.velX = (Math.random() * 40 + 40) * (Math.random() < .5 ? 1 : -1);
          this.bitmap.pos.set(this.velX < 0 ? this.wid + (this.bitmap.size.x >> 1) : -this.bitmap.size.x, 30);
        }
        break;
      case true:
        this.bitmap.pos.x += this.velX * dt;
        if (this.bitmap.pos.x < -this.bitmap.size.x || this.bitmap.pos.x > this.bitmap.size.x + this.wid) {
          this.alive = false;
          this.waitTime = Math.random() * 40 + 20;
          return;
        }
        this.box = {
          t: this.bitmap.top(),
          l: this.bitmap.left(),
          r: this.bitmap.right(),
          b: this.bitmap.bottom()
        };
        break;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.bitmap.img, this.bitmap.left(), this.bitmap.top());
  }

  drawBBox(ctx) {
    ctx.strokeStyle = "red";
    ctx.beginPath();

    ctx.moveTo(this.box.l, this.box.t);
    ctx.lineTo(this.box.r, this.box.t);
    ctx.lineTo(this.box.r, this.box.b);
    ctx.lineTo(this.box.l, this.box.b);

    ctx.closePath();
    ctx.stroke();
  }
}