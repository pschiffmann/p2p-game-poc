export class Vec2d {
  constructor(readonly x: number, readonly y: number) {}

  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns the vector rotation in radians as a number between 0 and 2π.
   *
   * The vector (1, 0) has rotation 0, and vector (0, 1) has rotation π/2.
   */
  get rotation(): number {
    const angle = Math.acos(this.x / this.length);
    return this.y > 0 ? angle : 2 * Math.PI - angle;
  }

  add(other: Vec2d): Vec2d {
    return new Vec2d(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vec2d): Vec2d {
    return new Vec2d(this.x - other.x, this.y - other.y);
  }

  multiply(length: number): Vec2d {
    return new Vec2d(this.x * length, this.y * length);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  static fromAngleAndLength(angle: number, length: number): Vec2d {
    return new Vec2d(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  static readonly zero = new Vec2d(0, 0);
}
