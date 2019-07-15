import Vector from "./vector.js";

const SHOW = 1,
    HIDE = 2;

class Star {
    constructor(w, h) {
        this.pos = new Vector();
        this.alpha;
        this.alphaTime;
        this.velX;
        this.color;
        this.size;
        this.wid = w;
        this.hei = h;
        this.state;
        this.restart();
    }

    restart() {
        this.pos.set(Math.random() * this.wid, Math.random() * this.hei);
        this.alpha = 0;
        this.state = SHOW;
        this.size = Math.random() + .8;
        this.color = `rgb(${Math.random() * 50 +  205}, ${Math.random() * 50 +  200}, ${Math.random() * 50 +  205})`;
        this.velX = 1 + 5 * Math.random();
        this.alphaTime = Math.random();
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    update(dt) {
        switch (this.state) {
            case SHOW:
                if ((this.alpha += dt * this.alphaTime) > 1) {
                    this.state = HIDE;
                    this.alpha = 1;
                }
                break;
            case HIDE:
                if ((this.alpha -= dt * this.alphaTime) < 0) {
                    this.restart();
                }
                if ((this.pos.y -= dt * this.velX) < 0) {
                    this.restart();
                }
                break;
        }
    }
}

export default class Stars {
    constructor(w, h) {
        this.stars = [];
        for (let s = 0; s < 500; s++) {
            const star = new Star(w, h);
            this.stars.push(star);
        }
    }

    draw(ctx) {
        this.stars.forEach(el => {
            el.draw(ctx);
        });
    }

    update(dt) {
        this.stars.forEach(el => {
            el.update(dt);
        });
    }
}