import {
  GameState,
  Player,
  ShieldGeneratorType,
  ShipState,
  ShipType,
  SystemState,
  ThrustersType,
  WeaponState,
  WeaponType,
} from "../shared/protocol";
import { systemAttributes } from "../shared/systems";

export type DeepWritable<T> = {
  -readonly [K in keyof T]: DeepWritable<T[K]>;
};

export const state: DeepWritable<GameState> = {
  player1: {
    paused: true,
    ship: initShip("a", "UNSINKABLE", 10, {
      weapon1: "ION CANNON",
      weapon2: "ROCKET LAUNCHER",
      shieldGenerator: "SHIELD GENERATOR S",
      thrusters: "THRUSTERS S",
    }),
  },
  player2: {
    paused: false,
    ship: initShip("b", "MC BOATFACE", 16, {
      weapon1: "LASER BATTERY",
      weapon2: "LASER BATTERY",
      shieldGenerator: "SHIELD GENERATOR L",
      thrusters: "THRUSTERS L",
    }),
  },
  projectiles: [],
  phase: "running",
};

export function updateUnusedEnergy(player: Player) {
  const { ship } = state[player];
  ship.unusedEnergy =
    ship.maxEnergy -
    ship.weapon1.energy -
    ship.weapon2.energy -
    ship.shieldGenerator.energy -
    ship.thrusters.energy;
}

function initShip(
  type: ShipType,
  name: string,
  maxEnergy: number,
  o: {
    weapon1: WeaponType;
    weapon2: WeaponType;
    shieldGenerator: ShieldGeneratorType;
    thrusters: ThrustersType;
  }
): ShipState {
  const weapon1Attributes = systemAttributes[o.weapon1];
  const weapon2Attributes = systemAttributes[o.weapon2];
  const shieldGeneratorAttributes = systemAttributes[o.shieldGenerator];
  const thrustersAttributes = systemAttributes[o.thrusters];
  const weapon1: WeaponState = {
    type: o.weapon1,
    energy: 0,
    hp: weapon1Attributes["MAX HP"],
    charge: 0,
    target: null,
  };
  const weapon2: WeaponState = {
    type: o.weapon2,
    energy: 0,
    hp: weapon2Attributes["MAX HP"],
    charge: 0,
    target: null,
  };
  const shieldGenerator: SystemState = {
    type: o.shieldGenerator,
    energy: shieldGeneratorAttributes["MAX ENERGY"],
    hp: shieldGeneratorAttributes["MAX HP"],
    charge: 0,
  };
  const thrusters: SystemState = {
    type: o.thrusters,
    energy: thrustersAttributes["MAX ENERGY"],
    hp: thrustersAttributes["MAX HP"],
    charge: 0, // unused
  };

  return {
    type,
    name,
    shieldHp: shieldGeneratorAttributes["MAX SHIELD HP"],
    dodge:
      thrustersAttributes["BASE DODGE"] +
      thrustersAttributes["DODGE/ENERGY"] * thrusters.energy,
    maxEnergy,
    unusedEnergy: maxEnergy - shieldGenerator.energy - thrusters.energy,
    weapon1,
    weapon2,
    shieldGenerator,
    thrusters,
  };
}

export function sendStateToWindow() {
  (self as unknown as Worker).postMessage(state);
}
