import Player from "./player.js"
import R from "./resources.js"
import Shields from "./shield.js";
import Aliens from "./aliens.js";
import Stars from "./stars.js";
import Disc from "./disc.js";
import Input from "./input.js";
import * as Const from "./const.js"
import Particles from "./particles.js";
import Explosion from "./explosion.js";

class SI {
  constructor(cvs) {
    this.canvas = cvs;
    this.nextRoundTime = 2;
    this.wid = this.canvas.width;
    this.hei = this.canvas.height;
    this.shieldsTop = this.hei - 110;
    this.wave = 1;
    this.ctx = this.canvas.getContext("2d");
    this.state = Const.GS_NEXT_ROUND;
    this.P = new Particles();
    this.E = new Explosion(this.P);
    this.R = new R(() => {
      this.start();
    });
  }

  start() {
    this.player = new Player(this.R, this.P, this.wid, this.hei);
    this.shields = new Shields(this.R, (this.wid >> 3) + 40, this.shieldsTop, (this.wid >> 2) - 20);
    this.aliens = new Aliens(this.R, this.wid, this.hei);
    this.disc = new Disc(this.R, this.wid);
    this.stars = new Stars(this.wid, this.hei);
    this.keyboard = new Input((what, kState) => {
      switch (what) {
        case Const.LEFT:
          this.player.movingDir += kState ? Const.LEFT : Const.RIGHT;
          break;
        case Const.RIGHT:
          this.player.movingDir += kState ? Const.RIGHT : Const.LEFT;
          break;
        case Const.FIRE:
          this.player.shoot()
          break;
      }
    });

    this.state = 1;

    this.accum = 0;
    this.lastTime = 0;
    this.delta = 1 / 120;

    this.loop = (now) => {
      this.accum += (now - this.lastTime) / 1000;
      while (this.accum > this.delta) {
        this.update(this.delta);
        this.accum -= this.delta;
      }
      this.draw();
      this.lastTime = now;
      requestAnimationFrame(this.loop);
    }
    this.loop(0);
  }

  nextRound() {
    this.shields.reset();
    this.aliens.reset();
    this.disc.reset();
    this.player.reset();
  }

  update(dt) {
    switch (this.state) {
      case Const.GS_PLAYING:
        this.stars.update(dt);
        this.disc.update(dt);
        this.player.update(dt);
        this.aliens.update(dt);
        this.E.update(dt);
        this.P.update(dt);

        const ali = this.aliens.aliens.filter(a => a.alive);
        for (let e = 0, len = ali.length; e < len; e++) {
          const z = ali[e];
          if (z.box.b >= this.player.box.t) {
            this.state = Const.GS_GAME_OVER;
            return;
          }
          if (z.box.b >= this.shieldsTop) {
            this.shields.hide();
          }
        }

        if (!this.testCollision()) {
          this.state = Const.GS_NEXT_ROUND;
          this.nextRoundTime = 2;
          this.wave++;
        }
        break;
      case Const.GS_NEXT_ROUND:
        this.P.update(dt);
        this.stars.update(dt);
        this.E.update(dt);
        if ((this.nextRoundTime -= dt) < 0) {
          this.nextRound();
          this.state = Const.GS_PLAYING;
        }
        break;
      case Const.GS_LOST_LIFE:
        this.E.start(this.player.bitmap.pos.x, this.player.bitmap.pos.y, 2);
        this.aliens.clearShots();
        this.state = Const.GS_WAIT;
        break;
      case Const.GS_WAIT:
        this.P.update(dt);
        this.stars.update(dt);
        if (!this.E.update(dt)) {
          if (--this.player.lives < 0) {
            this.state = Const.GS_GAME_OVER;
          } else {
            this.state = Const.GS_PLAYING;
            this.player.alive = true;
          }
        }
        break;
      case Const.GS_GAME_OVER:
        this.stars.update(dt);
        this.E.update(dt);
        this.P.update(dt);
        break;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stars.draw(this.ctx);

    switch (this.state) {
      case Const.GS_GAME_OVER:
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#eee"
        this.ctx.font = "50px 'Press Start 2P'";
        this.ctx.fillText("GAME OVER!", this.wid >> 1, this.hei * .45);
        this.ctx.font = "30px 'Press Start 2P'";
        this.ctx.fillText("SCORE", this.wid >> 1, this.hei * .6);
        this.ctx.fillText(("00000" + this.player.score).slice(-6), this.wid >> 1, this.hei * .68);
        break;
      case Const.GS_NEXT_ROUND:
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#eee"
        this.ctx.font = "35px 'Press Start 2P'";
        this.ctx.fillText(`WAVE ${this.wave}`, this.wid >> 1, this.hei >> 1);
        break;
      default:
        if (this.disc.alive) {
          this.disc.draw(this.ctx);
        }
        this.player.draw(this.ctx);
        this.shields.draw(this.ctx);
        this.aliens.draw(this.ctx);
        break;
    }
    this.P.draw(this.ctx);
  }

  startPartBunch(x, y) {
    for (let a = 0; a < 15; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 15 + 5;
      this.P.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 6, 6, 2, 2);
    }
  }

  testCollision() {
    function collideBox(a, b) {
      return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
    }

    _sh: for (let z = 0, len = this.player.shots.length; z < len; z++) {
      const el = this.player.shots[z];
      if (el.alive) {
        for (let a = 0, len = this.shields.shields.length; a < len; a++) {
          const sh = this.shields.shields[a];
          for (let b = 0, len = sh.grf.length; b < len; b++) {
            const em = sh.grf[b];
            if (em.hp && collideBox(el.box, em.box)) {
              em.hp--;
              el.alive = false;
              this.player.coolTime = 0;
              this.startPartBunch(el.x, el.box.t);
              continue _sh;
            }
          }
        }

        for (let a = 0, len = this.aliens.aliens.length; a < len; a++) {
          const al = this.aliens.aliens[a];
          if (al.alive && collideBox(el.box, al.box)) {
            el.alive = al.alive = false;
            this.player.score += al.points;
            this.player.coolTime = 0;
            this.E.start(al.frames[0].pos.x, al.frames[0].pos.y, .6);
            continue _sh;
          }

        }

        for (let z = 0, len = this.aliens.aliensShots.length; z < len; z++) {
          const ass = this.aliens.aliensShots[z];
          if (ass.alive && collideBox(el.box, ass.box)) {
            el.alive = ass.alive = false;
            this.player.coolTime = 0;
            this.player.score += 2;
            this.startPartBunch(el.x, el.box.t);
            continue _sh;
          }
        }

        if (this.disc.alive && collideBox(el.box, this.disc.box)) {
          el.alive = false;
          this.disc.reset();
          this.player.coolTime = 0;
          this.player.score += this.disc.points;
          this.E.start(this.disc.bitmap.pos.x, this.disc.bitmap.pos.y, .6);
          continue _sh;
        }
      }
    }

    _next: for (let z = 0, len = this.aliens.aliensShots.length; z < len; z++) {
      const ass = this.aliens.aliensShots[z];
      if (!ass.alive) continue;
      if (collideBox(ass.box, this.player.box)) {
        ass.alive = false;
        this.player.kill();
        this.state = Const.GS_LOST_LIFE;
        continue _next;
      }

      for (let a = 0, len = this.shields.shields.length; a < len; a++) {
        const el = this.shields.shields[a];
        for (let b = 0, len = el.grf.length; b < len; b++) {
          const em = el.grf[b];
          if (em.hp && collideBox(ass.box, em.box)) {
            em.hp--;
            ass.alive = false;
            this.startPartBunch(ass.x, ass.box.b);
            continue _next;
          }
        }
      }
    }

    for (let e = 0, len = this.aliens.aliens.length; e < len; e++) {
      if (this.aliens.aliens[e].alive) return true;
    }
    return false;
  }
}
const si = new SI(document.getElementById("si"));