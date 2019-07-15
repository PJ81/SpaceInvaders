import Bitmap from "./bitmap.js"
import Shot from "./shot.js"
import * as Const from "./const.js"

class Alien {
    constructor(img1, img2) {
        this.frames = [
            new Bitmap(img1),
            new Bitmap(img2)
        ];

        this.box = {
            l: 0,
            t: 0,
            r: 0,
            b: 0,
        };

        this.frame = 0;
        this.frameTime = .3;
        this.alive = false;
        this.shootTimer = Math.random() * 20 + 3;
        this.points;
    }

    setPos(x, y) {
        this.frames[0].pos.set(x, y);
        this.frames[1].pos.set(x, y);

        this.box = {
            l: this.frames[this.frame].left(),
            t: this.frames[this.frame].top(),
            r: this.frames[this.frame].right(),
            b: this.frames[this.frame].bottom(),
        };
    }

    updateY() {
        let y = this.frames[this.frame].pos.y;
        y += 32;
        this.setPos(this.frames[this.frame].pos.x, y);
    }

    draw(ctx) {
        const bmp = this.frames[this.frame];
        ctx.drawImage(bmp.img, bmp.left(), bmp.top());
    }

    update(dt, dir, cnt) {
        if ((this.frameTime -= dt) < 0) {
            this.frameTime = .3;
            this.frame = (this.frame + 1) % 2;
        }

        let x = this.frames[this.frame].pos.x;
        x += (200 - (cnt << 1)) * dt * dir;
        this.setPos(x, this.frames[this.frame].pos.y);
    }
}

export default class Aliens {
    constructor(res, w, h) {
        this.dir = 1;
        this.aliens = [];
        this.aliensShots = [];

        for (let sm = 0; sm < 100; sm++) {
            this.aliensShots.push(new Shot());
        }

        this.shotFrame = [
            new Bitmap(res.images[Const.ASHOT]),
            new Bitmap(res.images[Const.BSHOT])
        ];

        this.wid = w;
        this.hei = h;

        let col = 40,
            row = 80;
        for (let a = 0; a < 11; a++) {
            const alien = new Alien(res.images[Const.ALIEN1A], res.images[Const.ALIEN1B]);
            alien.setPos(col, row);
            col += 50;
            this.aliens.push(alien);
        }

        row += 45;
        for (let b = 0; b < 2; b++) {
            col = 40;
            for (let a = 0; a < 11; a++) {
                const alien = new Alien(res.images[Const.ALIEN2A], res.images[Const.ALIEN2B]);
                alien.setPos(col, row);
                col += 50;
                this.aliens.push(alien);
            }
            row += 45;
        }

        for (let b = 0; b < 2; b++) {
            col = 40;
            for (let a = 0; a < 11; a++) {
                const alien = new Alien(res.images[Const.ALIEN3A], res.images[Const.ALIEN3B]);
                alien.setPos(col, row);
                col += 50;
                this.aliens.push(alien);
            }
            row += 45;
        }
    }

    clearShots() {
        this.aliensShots.forEach(el => {
            el.alive = false;
        })
    }

    reset() {
        this.clearShots();
        this.dir = 1;

        let col = 40,
            row = 80,
            index = 0;
        for (let a = 0; a < 11; a++) {
            const alien = this.aliens[index++];
            alien.alive = true;
            alien.frameTime = .3;
            alien.frame = 0;
            alien.points = 40;
            alien.setPos(col, row);
            col += 50;
        }
        row += 45;
        for (let b = 0; b < 2; b++) {
            col = 40;
            for (let a = 0; a < 11; a++) {
                const alien = this.aliens[index++];
                alien.setPos(col, row);
                alien.frameTime = .3;
                alien.frame = 0;
                alien.points = 20;
                col += 50;
                alien.alive = true;
            }
            row += 45;
        }
        for (let b = 0; b < 2; b++) {
            col = 40;
            for (let a = 0; a < 11; a++) {
                const alien = this.aliens[index++];
                alien.setPos(col, row);
                col += 50;
                alien.frameTime = .3;
                alien.frame = 0;
                alien.points = 10;
                alien.alive = true;
            }
            row += 45;
        }
    }

    shoot(x, y) {
        for (let e = 0, len = this.aliensShots.length; e < len; e++) {
            const z = this.aliensShots[e];
            if (!z.alive) {
                z.alive = true;
                z.setPos(x, y);
                return;
            }
        }
    }

    update(dt) {
        const alive = this.aliens.filter(a => a.alive);
        alive.forEach(el => {
            el.update(dt, this.dir, alive.length);
            if ((el.shootTimer -= dt) < 0) {
                el.shootTimer = Math.random() * 20 + 3;
                this.shoot(el.frames[el.frame].pos.x, el.frames[el.frame].bottom() + 8);
            }
        });

        this.aliensShots.forEach(el => {
            if (el.alive) {
                el.y += dt * 50;

                el.box = {
                    l: el.x - 4,
                    t: el.y - 8,
                    r: el.x + 4,
                    b: el.y + 8,
                };

                if (el.box.t > this.hei) {
                    el.alive = false;
                }

                if ((el.animTime -= dt) < 0) {
                    el.animTime = .3;
                    el.frame = (el.frame + 1) % 2;
                }
            }
        });

        for (let e = 0, len = this.aliens.length; e < len; e++) {
            const z = this.aliens[e];
            if ((this.dir > 0 && z.box.r >= this.wid) || (this.dir < 0 && z.box.l <= 0)) {
                this.dir = -this.dir;
                for (let ei = 0, lei = this.aliens.length; ei < lei; ei++) {
                    this.aliens[ei].updateY();
                }
                return;
            }
        }
    }

    draw(ctx) {
        this.aliensShots.forEach(el => {
            if (el.alive) {
                ctx.drawImage(this.shotFrame[el.frame].img, el.box.l, el.box.t);
                //this.drawBBox(ctx, el.box);
            }
        });

        this.aliens.forEach(el => {
            if (el.alive) {
                el.draw(ctx);
            }
        });
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