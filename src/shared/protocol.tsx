import { systemAttributes } from "./systems";

export type Player = "player1" | "player2";

export type Action = "pause" | "resume" | "set-energy" | "attack";

export type ShipType = "a" | "b";

export type SystemType = keyof typeof systemAttributes;

export interface PlayerCommand {
  readonly player: Player;
  readonly action: Action;
  readonly target1?: string;
  readonly target2?: string;
}

export interface GameState {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
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
  readonly shieldGeneratorState: SystemState;
  readonly thrustersState: SystemState;
}

export interface SystemState {
  readonly energy: number;
  readonly hp: number;
}

export interface WeaponState {
  readonly target: string | null;
}
