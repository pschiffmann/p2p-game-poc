import { SystemType } from "./protocol";

export const systemAttributes = {
  "ION CANNON": {
    "HULL DMG": 10,
    "SHIELD DMG": 40,
    "BASE SPEED": 5,
    "SPEED/ENERGY": -0.5,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "ROCKET LAUNCHER": {
    "HULL DMG": 60,
    "SHIELD DMG": 15,
    "BASE SPEED": 8,
    "SPEED/ENERGY": -0.5,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "LASER BATTERY": {
    "HULL DMG": 20,
    "SHIELD DMG": 15,
    "BASE SPEED": 1.6,
    "SPEED/ENERGY": -0.2,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "SHIELD GENERATOR S": {
    "MAX SHIELD HP": 200,
    "SHIELD REGEN": 50,
    "BASE SPEED": 5,
    "SPEED/ENERGY": -0.4,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "SHIELD GENERATOR L": {
    "MAX SHIELD HP": 300,
    "SHIELD REGEN": 50,
    "BASE SPEED": 8,
    "SPEED/ENERGY": -0.2,
    "MAX ENERGY": 8,
    "MAX HP": 100,
  },
  "THRUSTERS S": {
    "BASE DODGE": 0.05,
    "DODGE/ENERGY": 0.05,
    "MAX ENERGY": 3,
    "MAX HP": 100,
  },
  "THRUSTERS L": {
    "BASE DODGE": 0,
    "DODGE/ENERGY": 0.02,
    "MAX ENERGY": 8,
    "MAX HP": 100,
  },
} as const;

export function calculateCurrentSpeed(
  systemType: SystemType,
  currentEnergy: number
): number {
  if (
    systemType === "THRUSTERS S" ||
    systemType === "THRUSTERS L" ||
    currentEnergy === 0
  ) {
    return 0;
  }
  const baseSpeed = systemAttributes[systemType]["BASE SPEED"];
  const speedPerEnergy = systemAttributes[systemType]["SPEED/ENERGY"];
  return baseSpeed + currentEnergy * speedPerEnergy;
}
