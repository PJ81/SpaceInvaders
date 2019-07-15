import Vector from "./vector.js"

class Particle {
    constructor() {
        this.size = new Vector();
        this.grow = new Vector();
        this.pos = new Vector();
        this.vel = new Vector();
        this.velD = new Vector();
        this.alpha = 1;
        this.alive = false;
        this.color;
    }

    update(dt) {
        if ((this.alpha -= dt) < 0) {
            this.alive = false;
            return;
        }

        this.size.x += this.grow.x * dt;
        this.size.y += this.grow.y * dt;

        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        this.vel.x -= this.velD.x * dt;
        this.vel.y -= this.velD.y * dt;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(this.pos.x - (this.size.x >> 1), this.pos.y - (this.size.y >> 1), this.size.x, this.size.y);
    }
}

export default class Particles {
    constructor() {
        this.particles = [];
        for (let d = 0; d < 1500; d++) {
            this.particles.push(new Particle());
        }
    }

    start(x = 0, y = 0, vx = 0, vy = 0, gx = 0, gy = 0, sx = 1, sy = 1, clr = "#fff", vdx = 0, vdy = 0) {
        for (let d = 0, len = this.particles.length; d < len; d++) {
            const p = this.particles[d];
            if (!p.alive) {
                p.alpha = 1;
                p.alive = true;
                p.pos.set(x, y);
                p.vel.set(vx, vy);
                p.velD.set(vdx, vdy);
                p.grow.set(gx, gy);
                p.size.set(sx, sy);
                p.color = clr;
                return;
            }
        }
    }

    update(dt) {
        this.particles.forEach(el => {
            if (el.alive) el.update(dt);
        });
    }

    draw(ctx) {
        this.particles.forEach(el => {
            if (el.alive) el.draw(ctx);
        });
    }
}