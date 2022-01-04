import { useCallback, useMemo, useState } from "react";
import {
  GameState,
  opponent,
  Player,
  PlayerCommand,
  ShipState,
  WeaponSlot,
} from "../shared/protocol";
import { DmgText, DmgTextMap } from "./dmg-text";
import { Projectile } from "./projectile";
import { Ship } from "./ship";
import { ShipStatus } from "./ship-status";
import { System } from "./system";

export interface CombatProps {
  readonly gameState: GameState;
  readonly player: Player;
  executeCommand(command: Omit<PlayerCommand, "player">): void;
}

export const Combat: React.FC<CombatProps> = ({
  gameState,
  player,
  executeCommand,
}) => {
  const paused = gameState.player1.paused || gameState.player2.paused;

  const [selectedWeapon, setSelectedWeapon] = useState<WeaponSlot | null>(null);
  const [dmgText, setDmgText] = useState<DmgTextMap>({});

  const pause = useCallback(() => {
    executeCommand({ action: "pause" });
  }, [executeCommand]);
  const resume = useCallback(() => {
    executeCommand({ action: "resume" });
  }, [executeCommand]);

  return (
    <div
      className={
        "combat" +
        (paused || gameState.phase !== "running" ? " combat--paused" : "")
      }
    >
      <MyUi
        ship={gameState[player].ship}
        gameOver={gameState.phase !== "running"}
        selectedWeapon={selectedWeapon}
        setSelectedWeapon={setSelectedWeapon}
        executeCommand={executeCommand}
      />
      <OpponentUi
        ship={gameState[opponent(player)].ship}
        gameOver={gameState.phase !== "running"}
        selectedWeapon={selectedWeapon}
        setSelectedWeapon={setSelectedWeapon}
        executeCommand={executeCommand}
      />

      {gameState.projectiles.map((projectile, i) => (
        <Projectile
          key={projectile.id}
          projectile={projectile}
          direction={projectile.targetPlayer === player ? "rtl" : "ltr"}
          setDmgText={setDmgText}
        />
      ))}
      {Object.entries(dmgText).map(([id, props]) => (
        <DmgText key={id} {...props} />
      ))}

      {gameState.phase === "running" ? (
        <>
          {paused && (
            <div className="combat__pause-text">
              {gameState.player1.paused && gameState.player2.paused
                ? "Game paused by you and your opponent."
                : gameState[player].paused
                ? "Game paused by you."
                : "Game paused by your opponent."}
            </div>
          )}
          <button
            className="combat__pause-resume"
            onClick={gameState[player].paused ? resume : pause}
          >
            {gameState[player].paused ? "RESUME" : "PAUSE"}
          </button>
        </>
      ) : (
        <GameResult phase={gameState.phase} player={player} />
      )}
      {(paused || gameState.phase !== "running") && (
        <div className="combat__scrim" />
      )}
    </div>
  );
};

const MyUi: React.FC<{
  readonly ship: ShipState;
  readonly gameOver: boolean;
  readonly selectedWeapon: WeaponSlot | null;
  setSelectedWeapon(weapon: WeaponSlot | null): void;
  executeCommand(command: Omit<PlayerCommand, "player">): void;
}> = ({
  ship,
  gameOver,
  selectedWeapon,
  setSelectedWeapon,
  executeCommand,
}) => {
  const setEnergy = useMemo(() => {
    if (gameOver) return null;
    const action = "set-energy";
    return {
      weapon1(systemEnergy: number) {
        executeCommand({ action, system: "weapon1", systemEnergy });
      },
      weapon2(systemEnergy: number) {
        executeCommand({ action, system: "weapon2", systemEnergy });
      },
      shieldGenerator(systemEnergy: number) {
        executeCommand({ action, system: "shieldGenerator", systemEnergy });
      },
      thrusters(systemEnergy: number) {
        executeCommand({ action, system: "thrusters", systemEnergy });
      },
    };
  }, [gameOver, executeCommand]);

  return (
    <>
      <Ship
        className="combat__ship combat__ship--mine"
        type={ship.type}
        name={ship.name}
      />
      <div className="combat__systems combat__systems--mine">
        <System
          type={ship.weapon1.type}
          hp={ship.weapon1.hp}
          currentEnergy={ship.weapon1.energy}
          hasTarget={ship.weapon1.target !== null}
          startAttackSelect={
            gameOver || selectedWeapon === "weapon1"
              ? undefined
              : () => setSelectedWeapon("weapon1")
          }
          cancelAttackSelect={
            gameOver || selectedWeapon !== "weapon1"
              ? undefined
              : () => setSelectedWeapon(null)
          }
          setEnergy={setEnergy?.weapon1}
        />
        <System
          type={ship.weapon2.type}
          hp={ship.weapon2.hp}
          currentEnergy={ship.weapon2.energy}
          hasTarget={ship.weapon2.target !== null}
          startAttackSelect={
            gameOver || selectedWeapon === "weapon2"
              ? undefined
              : () => setSelectedWeapon("weapon2")
          }
          cancelAttackSelect={
            gameOver || selectedWeapon !== "weapon2"
              ? undefined
              : () => setSelectedWeapon(null)
          }
          setEnergy={setEnergy?.weapon2}
        />
        <System
          type={ship.shieldGenerator.type}
          hp={ship.shieldGenerator.hp}
          currentEnergy={ship.shieldGenerator.energy}
          setEnergy={setEnergy?.shieldGenerator}
        />
        <System
          type={ship.thrusters.type}
          hp={ship.thrusters.hp}
          currentEnergy={ship.thrusters.energy}
          setEnergy={setEnergy?.thrusters}
        />
      </div>
      <ShipStatus
        className="combat__ship-status combat__ship-status--mine"
        ship={ship}
      />
    </>
  );
};

const OpponentUi: React.FC<{
  readonly ship: ShipState;
  readonly gameOver: boolean;
  readonly selectedWeapon: WeaponSlot | null;
  setSelectedWeapon(weapon: WeaponSlot | null): void;
  executeCommand(command: Omit<PlayerCommand, "player">): void;
}> = ({
  ship,
  gameOver,
  selectedWeapon,
  setSelectedWeapon,
  executeCommand,
}) => {
  const executeAttackSelect = useMemo(() => {
    if (gameOver || selectedWeapon === null) return null;
    const action = "attack";
    const system = selectedWeapon;
    return {
      weapon1() {
        executeCommand({ action, system, attackTarget: "weapon1" });
        setSelectedWeapon(null);
      },
      weapon2() {
        executeCommand({ action, system, attackTarget: "weapon2" });
        setSelectedWeapon(null);
      },
      shieldGenerator() {
        executeCommand({ action, system, attackTarget: "shieldGenerator" });
        setSelectedWeapon(null);
      },
      thrusters() {
        executeCommand({ action, system, attackTarget: "thrusters" });
        setSelectedWeapon(null);
      },
    };
  }, [gameOver, selectedWeapon, setSelectedWeapon, executeCommand]);

  return (
    <>
      <Ship
        className="combat__ship combat__ship--enemy"
        type={ship.type}
        name={ship.name}
      />
      <div className="combat__systems combat__systems--enemy">
        <System
          type={ship.weapon1.type}
          hp={ship.weapon1.hp}
          currentEnergy={ship.weapon1.energy}
          hasTarget={ship.weapon1.target !== null}
          executeAttackSelect={executeAttackSelect?.weapon1}
        />
        <System
          type={ship.weapon2.type}
          hp={ship.weapon2.hp}
          currentEnergy={ship.weapon2.energy}
          hasTarget={ship.weapon2.target !== null}
          executeAttackSelect={executeAttackSelect?.weapon2}
        />
        <System
          type={ship.shieldGenerator.type}
          hp={ship.shieldGenerator.hp}
          currentEnergy={ship.shieldGenerator.energy}
          executeAttackSelect={executeAttackSelect?.shieldGenerator}
        />
        <System
          type={ship.thrusters.type}
          hp={ship.thrusters.hp}
          currentEnergy={ship.thrusters.energy}
          executeAttackSelect={executeAttackSelect?.thrusters}
        />
      </div>
      <ShipStatus
        className="combat__ship-status combat__ship-status--enemy"
        ship={ship}
      />
    </>
  );
};

const GameResult: React.FC<{
  readonly phase: Exclude<GameState["phase"], "running">;
  readonly player: Player;
}> = ({ phase, player }) => {
  const resolved =
    phase === "draw"
      ? "draw"
      : phase === `${player}-win`
      ? "victory"
      : "defeat";

  return (
    <div className={`combat__game-result combat__game-result--${resolved}`}>
      {resolved}
    </div>
  );
};
