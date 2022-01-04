import { opponent, PlayerCommand, WeaponState } from "../shared/protocol";
import { systemAttributes } from "../shared/systems";
import {
  DeepWritable,
  sendStateToWindow,
  state,
  updateUnusedEnergy,
} from "./state";
import { runGameLoop, stopGameLoop } from "./tick";

export const actions = {
  pause({ player }: PlayerCommand) {
    const pausedBefore = state.player1.paused || state.player2.paused;
    state[player].paused = true;
    if (!pausedBefore) stopGameLoop();
    sendStateToWindow();
  },
  resume({ player }: PlayerCommand) {
    state[player].paused = false;
    const pausedNow = state.player1.paused || state.player2.paused;
    if (!pausedNow) runGameLoop();
    // Don't send game state immediately. This means a delay of 100ms + network
    // delay between pressing resume and the game actually resuming. But
    // otherwise animations and the simulation would de-sync by 100ms on every
    // resume.
  },
  "set-energy"({ player, system, systemEnergy }: PlayerCommand) {
    const shipState = state[player].ship;
    const systemState = shipState[system!];
    if (systemState.hp === 0) return;
    const maxEnergy = systemAttributes[systemState.type]["MAX ENERGY"];
    systemState.energy = Math.min(
      Math.max(systemEnergy!, 0),
      maxEnergy,
      systemEnergy! + shipState.unusedEnergy
    );
    updateUnusedEnergy(player);
    if (state.player1.paused || state.player2.paused) sendStateToWindow();
  },
  attack({ player, system, attackTarget }: PlayerCommand) {
    const weapon = state[player].ship[system!] as DeepWritable<WeaponState>;
    if (weapon.energy === 0 || weapon.hp === 0) return;
    const target = state[opponent(player)].ship[attackTarget!];
    if (target.hp === 0) return;
    weapon.target = attackTarget!;
  },
};
