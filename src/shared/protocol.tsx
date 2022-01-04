import { systemAttributes } from "./systems";

export type Player = "player1" | "player2";

export type Action = "pause" | "resume" | "set-energy" | "attack";

export type ShipType = "a" | "b";

export type SystemType = keyof typeof systemAttributes;

export type WeaponType = Extract<
  SystemType,
  "ION CANNON" | "LASER BATTERY" | "ROCKET LAUNCHER"
>;
export type ShieldGeneratorType = Extract<
  SystemType,
  "SHIELD GENERATOR S" | "SHIELD GENERATOR L"
>;
export type ThrustersType = Extract<SystemType, "THRUSTERS S" | "THRUSTERS L">;

export type SystemSlot =
  | "weapon1"
  | "weapon2"
  | "shieldGenerator"
  | "thrusters";
export type WeaponSlot = "weapon1" | "weapon2";

export interface PlayerCommand {
  readonly player: Player;
  readonly action: Action;
  readonly system?: SystemSlot;
  readonly systemEnergy?: number;
  readonly attackTarget?: SystemSlot;
}

export interface GameState {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly projectiles: ProjectileState[];
  readonly phase: "running" | "player1-win" | "player2-win" | "draw";
}

export interface PlayerState {
  readonly paused: boolean;
  readonly ship: ShipState;
}

export interface ShipState {
  readonly type: ShipType;
  readonly name: string;
  readonly shieldHp: number;
  readonly dodge: number;
  readonly maxEnergy: number;
  readonly unusedEnergy: number;
  readonly weapon1: WeaponState;
  readonly weapon2: WeaponState;
  readonly shieldGenerator: SystemState;
  readonly thrusters: SystemState;
}

export interface SystemState {
  readonly type: SystemType;
  readonly energy: number;
  readonly hp: number;
  // Number of milliseconds this system is charging.
  readonly charge: number;
}

export interface WeaponState extends SystemState {
  readonly target: SystemSlot | null;
}

export interface ProjectileState {
  readonly id: string;
  readonly type: WeaponType;
  readonly targetPlayer: Player;
  readonly targetSystem: SystemSlot;
  readonly timeToImpact: number;
  readonly damageType?: "shield" | "hull" | "miss";
  readonly damangeDone?: number;
}

export function opponent(player: Player): Player {
  return player === "player1" ? "player2" : "player1";
}
