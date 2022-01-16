import { clamp } from "./math";
import { Vec2d } from "./vec2d";

/**
 * The StarCraft 2 engine simulates 22.4 ticks per second. If that is fast
 * enough for SC2, then it's fast enough for us.
 *
 * Source: https://github.com/Blizzard/s2client-proto/blob/master/docs/protocol.md#game-speed
 */
export const ticksPerSecond = 20;

export interface PhysicsObject {
  /**
   * Position.
   */
  p: Vec2d;

  /**
   * Rotation in radians.
   */
  r: number;

  /**
   * Movement velocity; the object moves this distance in the direction of `r`
   * every tick.
   *
   * The simulation clamps this value to the range (0, `mvMax`) every tick.
   */
  mv: number;

  /**
   * Maximum `mv`.
   */
  mvMax: number;

  /**
   * Movement acceleration; this number is added to `mv` every tick.
   */
  ma: number;

  /**
   * Rotation velocity in radians; the object rotates this much every tick.
   */
  rv: number;

  /**
   * Maximum `rv`.
   */
  rvMax: number;

  /**
   * Rotation acceleration; this number is added to `rv` every tick.
   */
  ra: number;
}

export function physicsObject(o: Partial<PhysicsObject>): PhysicsObject {
  return {
    p: Vec2d.zero,
    r: 0,
    mv: 0,
    mvMax: Number.POSITIVE_INFINITY,
    ma: 0,
    rv: 0,
    rvMax: Number.POSITIVE_INFINITY,
    ra: 0,
    ...o,
  };
}

/**
 * Add `PhysicsObject`s to `objects` to simulate them. Call `tick()` to advance
 * the simulation time by one tick, which is 1s / `ticksPerSecond`.
 *
 * Object properties are updated in this order:
 *  1. Update `mv` from `ma` and `rv` from `ra`
 *  2. Update `r` from `rv`
 *  3. Update `p` from `r` and `mv`
 */
export class PhysicsSimulation {
  /**
   * All objects in this set will be updated during the next `tick()` call.
   * `add()`/`delete()` to this set directly.
   */
  readonly objects = new Set<PhysicsObject>();

  tick() {
    for (const object of this.objects) {
      this.update(object);
    }
  }

  private update(object: PhysicsObject) {
    object.mv = clamp(object.mv + object.ma, 0, object.mvMax);
    object.rv = clamp(object.rv + object.ra, -object.rvMax, object.rvMax);
    object.r = (object.r + object.rv) % (Math.PI * 2);
    object.p = object.p.add(Vec2d.fromAngleAndLength(object.r, object.mv));
  }
}
