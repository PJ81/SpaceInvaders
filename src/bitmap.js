import Vector from "./vector.js";

export default class Bitmap {
  constructor(img) {
    this.img = img;
    this.pos = new Vector();
    this.size = new Vector(this.img.width, this.img.height);
  }

  left() {
    return this.pos.x - (this.size.x >> 1);
  }

  right() {
    return this.pos.x + (this.size.x >> 1);
  }

  top() {
    return this.pos.y - (this.size.y >> 1);
  }

  bottom() {
    return this.pos.y + (this.size.y >> 1);
  }
}