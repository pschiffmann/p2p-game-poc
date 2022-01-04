import { useState } from "react";
import { ExecuteCommand } from "../p2p";
import { GameState, Player } from "../shared/protocol";
import { Combat } from "./combat";
import { Setup } from "./setup";

export const App: React.FC = () => {
  const [player, setPlayer] = useState<Player>();
  const [gameState, setGameState] = useState<GameState>();
  const [executeCommand, setExecuteCommand] = useState<ExecuteCommand>();

  return (
    <div className="app">
      {gameState ? (
        <Combat
          player={player!}
          gameState={gameState}
          executeCommand={executeCommand!}
        />
      ) : (
        <Setup
          setPlayer={setPlayer}
          setGameState={setGameState}
          setExecuteCommand={setExecuteCommand}
        />
      )}
    </div>
  );
};
