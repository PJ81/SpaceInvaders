import Bitmap from "./bitmap.js";
import * as Const from "./const.js"
import Shot from "./shot.js";

export default class Player {
  constructor(res, prt, w, h) {
    this.bitmap = new Bitmap(res.images[Const.SHIP]);
    this.movingDir = 0;
    this.box = {
      l: 0,
      b: 0,
      r: 0,
      t: 0
    };

    this.alive = true;
    this.partTime = .02;
    this.coolTime = 0;
    this.shots = [];
    this.particles = prt;

    for (let sm = 0; sm < 20; sm++) {
      this.shots.push(new Shot());
    }
    this.shotBmp = res.images[Const.SHOT];
    this.wid = w;
    this.hei = h;
    this.lives = 2;
    this.score = 0;
    this.bitmap.pos.set(this.wid >> 1, this.hei - 38);
  }

  kill() {
    this.alive = false;
    this.reset();
  }

  reset() {
    this.shots.forEach(el => {
      el.alive = false;
    });
  }

  shoot() {
    if (this.coolTime > 0) return;
    this.coolTime = .5;
    for (let e = 0, len = this.shots.length; e < len; e++) {
      const z = this.shots[e];
      if (!z.alive) {
        z.alive = true;
        z.setPos(this.bitmap.pos.x, this.bitmap.pos.y);
        return;
      }
    }
  }

  update(dt) {
    if (this.coolTime > 0) {
      if ((this.coolTime -= dt) < 0) this.coolTime = 0;
    }
    this.bitmap.pos.x += this.movingDir * dt * 170;
    if (this.bitmap.left() < 0) this.bitmap.pos.x = (this.bitmap.size.x >> 1);
    else if (this.bitmap.right() > this.wid) this.bitmap.pos.x = this.wid - (this.bitmap.size.x >> 1);

    this.shots.forEach(el => {
      if (el.alive) {
        el.y -= dt * 350;
        el.box = {
          l: el.x - 4,
          t: el.y - 8,
          r: el.x + 4,
          b: el.y + 8,
        }
        el.alive = (el.box.b > 0);

        if ((this.partTime -= dt) < 0) {
          this.partTime = .05;
          this.particles.start(el.x, el.box.b, Math.random() > .5 ? -4 : 4, 20, 6, 6, 1, 1);
        }
      }
    });

    this.box = {
      l: this.bitmap.left(),
      b: this.bitmap.bottom(),
      r: this.bitmap.right(),
      t: this.bitmap.top()
    };
  }

  draw(ctx) {
    if (this.alive)
      ctx.drawImage(this.bitmap.img, this.bitmap.left(), this.bitmap.top());

    let col = -40;
    for (let l = 0; l < this.lives; l++) {
      ctx.drawImage(this.bitmap.img, col += 52, this.hei - 26);
    }

    this.shots.forEach(el => {
      if (el.alive) {
        ctx.drawImage(this.shotBmp, el.box.l, el.box.t);
      }
    });

    ctx.textAlign = "right";
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillStyle = "#eee"
    ctx.fillText(("00000" + this.score).slice(-6), this.wid - 4, this.hei - 4);
  }

  drawBBox(ctx, box) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(box.l, box.t);
    ctx.lineTo(box.r, box.t);
    ctx.lineTo(box.r, box.b);
    ctx.lineTo(box.l, box.b);
    ctx.closePath();
    ctx.stroke();
  }
}