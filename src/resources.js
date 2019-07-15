import * as Const from "./const.js"
export default class Resources {
    constructor(cb) {
        this.images = new Array(31);

        Promise.all([
            (this.loadImage("./img/alien1a.png")).then((i) => {
                this.images[Const.ALIEN1A] = i;
            }),
            (this.loadImage("./img/alien1b.png")).then((i) => {
                this.images[Const.ALIEN1B] = i;
            }),
            (this.loadImage("./img/alien2a.png")).then((i) => {
                this.images[Const.ALIEN2A] = i;
            }),
            (this.loadImage("./img/alien2b.png")).then((i) => {
                this.images[Const.ALIEN2B] = i;
            }),
            (this.loadImage("./img/alien3a.png")).then((i) => {
                this.images[Const.ALIEN3A] = i;
            }),
            (this.loadImage("./img/alien3b.png")).then((i) => {
                this.images[Const.ALIEN3B] = i;
            }),
            (this.loadImage("./img/ashot.png")).then((i) => {
                this.images[Const.ASHOT] = i;
            }),
            (this.loadImage("./img/bshot.png")).then((i) => {
                this.images[Const.BSHOT] = i;
            }),
            (this.loadImage("./img/bota.png")).then((i) => {
                this.images[Const.BOTA] = i;
            }),
            (this.loadImage("./img/botb.png")).then((i) => {
                this.images[Const.BOTB] = i;
            }),
            (this.loadImage("./img/botc.png")).then((i) => {
                this.images[Const.BOTC] = i;
            }),
            (this.loadImage("./img/botd.png")).then((i) => {
                this.images[Const.BOTD] = i;
            }),
            (this.loadImage("./img/bote.png")).then((i) => {
                this.images[Const.BOTE] = i;
            }),
            (this.loadImage("./img/botf.png")).then((i) => {
                this.images[Const.BOTF] = i;
            }),
            (this.loadImage("./img/botg.png")).then((i) => {
                this.images[Const.BOTG] = i;
            }),
            (this.loadImage("./img/both.png")).then((i) => {
                this.images[Const.BOTH] = i;
            }),
            (this.loadImage("./img/fulla.png")).then((i) => {
                this.images[Const.FULLA] = i;
            }),
            (this.loadImage("./img/fullb.png")).then((i) => {
                this.images[Const.FULLB] = i;
            }),
            (this.loadImage("./img/fullc.png")).then((i) => {
                this.images[Const.FULLC] = i;
            }),
            (this.loadImage("./img/fulld.png")).then((i) => {
                this.images[Const.FULLD] = i;
            }),
            (this.loadImage("./img/topa.png")).then((i) => {
                this.images[Const.TOPA] = i;
            }),
            (this.loadImage("./img/topb.png")).then((i) => {
                this.images[Const.TOPB] = i;
            }),
            (this.loadImage("./img/topc.png")).then((i) => {
                this.images[Const.TOPC] = i;
            }),
            (this.loadImage("./img/topd.png")).then((i) => {
                this.images[Const.TOPD] = i;
            }),
            (this.loadImage("./img/tope.png")).then((i) => {
                this.images[Const.TOPE] = i;
            }),
            (this.loadImage("./img/topf.png")).then((i) => {
                this.images[Const.TOPF] = i;
            }),
            (this.loadImage("./img/topg.png")).then((i) => {
                this.images[Const.TOPG] = i;
            }),
            (this.loadImage("./img/toph.png")).then((i) => {
                this.images[Const.TOPH] = i;
            }),
            (this.loadImage("./img/disc.png")).then((i) => {
                this.images[Const.DISC] = i;
            }),
            (this.loadImage("./img/ship.png")).then((i) => {
                this.images[Const.SHIP] = i;
            }),
            (this.loadImage("./img/shot.png")).then((i) => {
                this.images[Const.SHOT] = i;
            })
        ]).then(() => {
            cb();
        });
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }

    image(index) {
        if (index < this.images.length) {
            return this.images[index];
        }
        return null;
    }
}