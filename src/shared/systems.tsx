import { SystemType } from "./protocol";

export const systemAttributes = {
  "ION CANNON": {
    "HULL DMG": 10,
    "SHIELD DMG": 60,
    "PROJECTILE SPEED": 15,
    "RELOAD SPEED": 50,
    "RLD. SP./ENERGY": -5,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "ROCKET LAUNCHER": {
    "HULL DMG": 60,
    "SHIELD DMG": 15,
    "PROJECTILE SPEED": 25,
    "RELOAD SPEED": 80,
    "RLD. SP./ENERGY": -5,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "LASER BATTERY": {
    "HULL DMG": 20,
    "SHIELD DMG": 15,
    "PROJECTILE SPEED": 12,
    "RELOAD SPEED": 22,
    "RLD. SP./ENERGY": -2,
    "MAX ENERGY": 4,
    "MAX HP": 120,
  },
  "SHIELD GENERATOR S": {
    "MAX SHIELD HP": 200,
    "SHIELD REGEN": 50,
    "RELOAD SPEED": 50,
    "RLD. SP./ENERGY": -4,
    "MAX ENERGY": 4,
    "MAX HP": 100,
  },
  "SHIELD GENERATOR L": {
    "MAX SHIELD HP": 300,
    "SHIELD REGEN": 50,
    "RELOAD SPEED": 80,
    "RLD. SP./ENERGY": -4,
    "MAX ENERGY": 8,
    "MAX HP": 100,
  },
  "THRUSTERS S": {
    "BASE DODGE": 0.05,
    "DODGE/ENERGY": 0.05,
    "MAX ENERGY": 3,
    "MAX HP": 80,
  },
  "THRUSTERS L": {
    "BASE DODGE": 0,
    "DODGE/ENERGY": 0.02,
    "MAX ENERGY": 8,
    "MAX HP": 150,
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
  const baseSpeed = systemAttributes[systemType]["RELOAD SPEED"];
  const speedPerEnergy = systemAttributes[systemType]["RLD. SP./ENERGY"];
  return baseSpeed + currentEnergy * speedPerEnergy;
}

export function isWeaponType(systemType: SystemType): boolean {
  return (
    systemType === "ION CANNON" ||
    systemType === "LASER BATTERY" ||
    systemType === "ROCKET LAUNCHER"
  );
}
