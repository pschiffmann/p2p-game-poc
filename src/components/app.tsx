import { useEffect, useState } from "react";
import { GameState, PlayerCommand } from "../shared/protocol";
import { Combat } from "./combat";

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>();
  const [executeCommand, setExecuteCommand] =
    useState<(command: Omit<PlayerCommand, "player">) => void>();

  useEffect(() => {
    const worker = new Worker(
      new URL("../simulation/main.js", import.meta.url),
      { type: "module" }
    );
    worker.onmessage = ({ data }: MessageEvent<GameState>) => {
      setGameState(data);
    };
    setExecuteCommand(
      () => (command: Omit<PlayerCommand, "player">) =>
        worker.postMessage({ ...command, player: "player1" })
    );
  }, []);

  return (
    <div className="app">
      {gameState && (
        <Combat
          gameState={gameState}
          executeCommand={executeCommand!}
          player="player1"
        />
      )}
    </div>
  );
};
