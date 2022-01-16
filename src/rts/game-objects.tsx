import { Actor, GameEngine } from "./game-engine";
import { PhysicsObject, physicsObject } from "./physics-simulation";
import { RenderObject } from "./renderer";
import { Vec2d } from "./vec2d";

const projectileMoveVelocity = 4;

export function createShip1(engine: GameEngine, target: PhysicsObject) {
  const physics = physicsObject({
    p: new Vec2d(100, 450),
    r: Math.PI / 2,
    mv: 2,
    mvMax: 2,
    ma: 0.025,
    rv: -Math.PI / 256,
    rvMax: Math.PI / 256,
    ra: -Math.PI / 1024,
  });
  const renderObject: RenderObject = { imgName: "ship", scale: 2, physics };

  let weaponCooldown = 80;
  const actor: Actor = {
    update() {
      if (--weaponCooldown === 0) {
        const rotation = findProjectileRotationForTarget(
          projectileMoveVelocity,
          physics.p,
          target
        );
        createProjectile(engine, physics.p, rotation, target);
        weaponCooldown = 40;
      }
    },
  };

  engine.actors.add(actor);
  engine.physicsSimulation.objects.add(physics);
  engine.renderer.objects.add(renderObject);
}

export function createShip2(engine: GameEngine) {
  const physics = physicsObject({
    p: new Vec2d(900, 450),
    r: Math.PI / 3,
    mv: 2,
    mvMax: 2,
  });
  const renderObject: RenderObject = { imgName: "ship", scale: 2, physics };

  const actor: Actor = {
    update() {
      if (physics.p.y < 20 || physics.p.y > 700) {
        physics.r += Math.PI;
      }
    },
  };

  engine.actors.add(actor);
  engine.physicsSimulation.objects.add(physics);
  engine.renderer.objects.add(renderObject);
}

function createProjectile(
  engine: GameEngine,
  p: Vec2d,
  r: number,
  target: PhysicsObject
) {
  const physics = physicsObject({ p, r, mv: projectileMoveVelocity });
  const renderObject: RenderObject = {
    imgName: "projectile",
    scale: 2,
    physics,
  };

  const actor: Actor = {
    update() {
      const outOfBounds =
        physics.p.x < 0 ||
        physics.p.x > 1280 ||
        physics.p.y < 0 ||
        physics.p.y > 720;
      const intersectsWithTarget = physics.p.subtract(target.p).length < 80;

      if (outOfBounds || intersectsWithTarget) {
        engine.actors.delete(actor);
        engine.physicsSimulation.objects.delete(physics);
        engine.renderer.objects.delete(renderObject);
      }
      if (intersectsWithTarget) {
        createExplosion(engine, physics.p);
      }
    },
  };

  engine.actors.add(actor);
  engine.physicsSimulation.objects.add(physics);
  engine.renderer.objects.add(renderObject);
}

function createExplosion(engine: GameEngine, p: Vec2d) {
  const physics = physicsObject({ p });
  const renderObject: RenderObject = {
    imgName: "explosion",
    scale: 4,
    physics,
  };

  let ttl = 80;
  const actor: Actor = {
    update() {
      if (--ttl === 0) {
        engine.actors.delete(actor);
        engine.physicsSimulation.objects.delete(physics);
        engine.renderer.objects.delete(renderObject);
      }
    },
  };

  engine.actors.add(actor);
  engine.physicsSimulation.objects.add(physics);
  engine.renderer.objects.add(renderObject);
}

function findEarliestTimeOfImpact(
  projectileSpeed: number,
  relativeTargetPosition: Vec2d,
  targetVelocity: Vec2d
): number {
  const denominator =
    targetVelocity.x * targetVelocity.x +
    targetVelocity.y * targetVelocity.y -
    projectileSpeed * projectileSpeed;
  const p =
    (2 * targetVelocity.x * relativeTargetPosition.x +
      2 * targetVelocity.y * relativeTargetPosition.y) /
    denominator;
  const pHalf = p / 2;
  const q =
    (relativeTargetPosition.x * relativeTargetPosition.x +
      relativeTargetPosition.y * relativeTargetPosition.y) /
    denominator;
  const sqrt = Math.sqrt(pHalf * pHalf - q);
  const x1 = -pHalf + sqrt;
  const x2 = -pHalf - sqrt;

  if (x1 >= 0 && x2 >= 0) return Math.min(x1, x2);
  if (x1 >= 0) return x1;
  if (x2 >= 0) return x2;
  return Number.POSITIVE_INFINITY;
}

/**
 * Returns an angle in radians to hit target. If the projectile can't possibly
 * hit target, returns 0.
 */
function findProjectileRotationForTarget(
  projectileSpeed: number,
  projectileOrigin: Vec2d,
  target: PhysicsObject
): number {
  const targetVelocityVector = Vec2d.fromAngleAndLength(target.r, target.mv);
  const timeOfImpact = findEarliestTimeOfImpact(
    projectileSpeed,
    target.p.subtract(projectileOrigin),
    targetVelocityVector
  );
  if (!isFinite(timeOfImpact)) return 0;
  const collisionPosition = target.p.add(
    targetVelocityVector.multiply(timeOfImpact)
  );
  return collisionPosition.subtract(projectileOrigin).rotation;
}
