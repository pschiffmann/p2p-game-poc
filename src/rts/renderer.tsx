import { PhysicsObject } from "./physics-simulation";
import { Vec2d } from "./vec2d";

export class Renderer {
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d", { desynchronized: true })!;
    this.ctx.imageSmoothingEnabled = false;
  }

  private ctx: CanvasRenderingContext2D;

  viewportPosition = new Vec2d(0, 0);

  readonly objects = new Set<RenderObject>();

  readonly images = new Map<string, CanvasImageSource>();

  async loadImage(name: string, path: string) {
    const response = await fetch(path);
    const blob = await response.blob();
    this.images.set(name, await createImageBitmap(blob));
  }

  /**
   * Renders all `objects` onto `ctx`.
   */
  render() {
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const object of this.objects) {
      const img = this.images.get(object.imgName);
      if (!img) continue;
      drawImageScaleRotate(
        this.ctx,
        img,
        object.physics.p.x - this.viewportPosition.x,
        this.canvas.height - (object.physics.p.y - this.viewportPosition.y),
        object.scale,
        -object.physics.r
      );
    }
  }
}

export interface RenderObject {
  readonly imgName: string;
  readonly scale: number;
  readonly physics: PhysicsObject;
}

// https://stackoverflow.com/a/60248778
function drawImageScaleRotate(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  scale: number,
  rotate: number
) {
  const xAX = Math.cos(rotate) * scale;
  const xAY = Math.sin(rotate) * scale;
  ctx.setTransform(xAX, xAY, -xAY, xAX, x, y);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
}
