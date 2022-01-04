import { v4 as uuid } from "uuid";
import {
  opponent,
  Player,
  ProjectileState,
  WeaponType,
} from "../shared/protocol";
import { systemAttributes } from "../shared/systems";
import {
  DeepWritable,
  sendStateToWindow,
  state,
  updateUnusedEnergy,
} from "./state";

let intervalId: number | null = null;

export function runGameLoop() {
  if (intervalId !== null) {
    throw new Error("Game loop already running, this is a bug!");
  }
  intervalId = self.setInterval(tick, 100);
}

export function stopGameLoop() {
  if (intervalId === null) {
    throw new Error("Game loop not running, this is a bug!");
  }
  self.clearInterval(intervalId);
  intervalId = null;
}

/**
 * Progress the game time by one tick (100ms), in this order:
 *
 * 1. Activate systems (e.g. trigger the shield generator first so it can
 *    deflect a projectile that would destroy it.)
 * 2. Process projectiles.
 */
export function tick() {
  activateWeapon("player1", "weapon1");
  activateWeapon("player1", "weapon2");
  activateWeapon("player2", "weapon1");
  activateWeapon("player2", "weapon2");
  activateShieldGenerator("player1");
  activateShieldGenerator("player2");
  activateThrusters("player1");
  activateThrusters("player2");
  state.projectiles = state.projectiles.filter((p) => processProjectile(p));

  const player1Lost = hasPlayerLost("player1");
  const player2Lost = hasPlayerLost("player2");
  if (player1Lost && player2Lost) {
    state.phase = "draw";
  } else if (player1Lost) {
    state.phase = "player2-win";
  } else if (player2Lost) {
    state.phase = "player1-win";
  }
  if (state.phase !== "running") stopGameLoop();
  sendStateToWindow();
}

function activateWeapon(player: Player, weapon: "weapon1" | "weapon2") {
  const weaponState = state[player].ship[weapon];
  const type = weaponState.type as WeaponType;
  const weaponAttributes = systemAttributes[type];
  if (
    weaponState.hp === 0 ||
    weaponState.energy === 0 ||
    weaponState.target === null ||
    state[opponent(player)].ship[weaponState.target].hp === 0
  ) {
    weaponState.charge = 0;
    return;
  }
  const requiredCharge =
    weaponAttributes["RELOAD SPEED"] +
    weaponState.energy * weaponAttributes["RLD. SP./ENERGY"];
  if (weaponState.charge < requiredCharge) {
    weaponState.charge += 0.1;
    return;
  }

  state.projectiles.push({
    id: uuid(),
    type,
    targetPlayer: opponent(player),
    targetSystem: weaponState.target,
    // Add 0.1 because the projectile will be processed in this tick.
    timeToImpact: weaponAttributes["PROJECTILE SPEED"] + 0.1,
  });
  weaponState.charge = 0;
}

function activateShieldGenerator(player: Player) {
  const shieldGeneratorState = state[player].ship.shieldGenerator;
  const shieldGeneratorAttributes =
    systemAttributes[
      shieldGeneratorState.type as "SHIELD GENERATOR S" | "SHIELD GENERATOR L"
    ];
  if (shieldGeneratorState.hp === 0 || shieldGeneratorState.energy === 0) {
    shieldGeneratorState.charge = 0;
    return;
  }
  const requiredCharge =
    shieldGeneratorAttributes["RELOAD SPEED"] +
    shieldGeneratorState.energy * shieldGeneratorAttributes["RLD. SP./ENERGY"];
  if (shieldGeneratorState.charge < requiredCharge) {
    shieldGeneratorState.charge += 0.1;
    return;
  }
  state[player].ship.shieldHp = Math.min(
    state[player].ship.shieldHp + shieldGeneratorAttributes["SHIELD REGEN"],
    shieldGeneratorAttributes["MAX SHIELD HP"]
  );
  shieldGeneratorState.charge = 0;
}

function activateThrusters(player: Player) {
  const { ship } = state[player];
  const thrustersAttributes =
    systemAttributes[ship.thrusters.type as "THRUSTERS S" | "THRUSTERS L"];
  ship.dodge =
    ship.thrusters.hp === 0 || ship.thrusters.energy === 0
      ? 0
      : thrustersAttributes["DODGE/ENERGY"] * ship.thrusters.energy;
}

/**
 * Returns `false` if this projectile is no longer needed and can be deleted.
 */
function processProjectile(projectile: DeepWritable<ProjectileState>): boolean {
  projectile.timeToImpact -= 0.1;
  if (projectile.timeToImpact < 0) return false;
  if (projectile.timeToImpact === 0) {
    const projectileAttributes = systemAttributes[projectile.type];
    const targetShip = state[projectile.targetPlayer].ship;
    const targetSystem = targetShip[projectile.targetSystem];
    if (Math.random() < targetShip.dodge) {
      projectile.damageType = "miss";
    } else if (targetShip.shieldHp > 0) {
      projectile.damageType = "shield";
      projectile.damangeDone = Math.min(
        targetShip.shieldHp,
        projectileAttributes["SHIELD DMG"]
      );
      targetShip.shieldHp -= projectile.damangeDone;
    } else {
      projectile.damageType = "hull";
      projectile.damangeDone = Math.min(
        targetSystem.hp,
        projectileAttributes["HULL DMG"]
      );
      targetSystem.hp -= projectile.damangeDone;
      if (targetSystem.hp === 0) {
        targetSystem.energy = 0;
        updateUnusedEnergy(projectile.targetPlayer);
      }
    }
  }
  return true;
}

function hasPlayerLost(player: Player): boolean {
  const { ship } = state[player];
  return (
    ship.weapon1.hp === 0 &&
    ship.weapon2.hp === 0 &&
    ship.shieldGenerator.hp === 0 &&
    ship.thrusters.hp === 0
  );
}
