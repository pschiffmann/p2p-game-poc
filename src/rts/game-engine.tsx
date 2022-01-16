import { PhysicsSimulation, ticksPerSecond } from "./physics-simulation";
import { Renderer } from "./renderer";

export interface Actor {
  update(): void;
}

export class GameEngine {
  constructor(readonly renderer: Renderer) {}

  readonly physicsSimulation = new PhysicsSimulation();

  readonly actors = new Set<Actor>();

  private intervalId: number | null = null;

  private update() {
    for (const actor of [...this.actors]) {
      actor.update();
    }
    this.physicsSimulation.tick();
    this.renderer.render();
  }

  resume() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => this.update(), ticksPerSecond);
  }

  pause() {
    window.clearInterval(this.intervalId!);
    this.intervalId = null;
  }
}
