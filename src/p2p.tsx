import type Peer from "peerjs";
import { v4 as uuid } from "uuid";
import { GameState, PlayerCommand } from "./shared/protocol";

export type ExecuteCommand = (command: Omit<PlayerCommand, "player">) => void;

export const myConnectionId = uuid();

const peer: Peer = new (window as any).Peer(myConnectionId);

export function hostGame(
  setGameState: (gameState: GameState) => void
): Promise<ExecuteCommand> {
  return new Promise((resolve) => {
    peer.on("connection", (connection) => {
      connection.on("open", () => {
        const worker = new Worker(
          new URL("./simulation/main.js", import.meta.url),
          { type: "module" }
        );
        worker.onmessage = ({ data }: MessageEvent<GameState>) => {
          setGameState(data);
          connection.send(data);
        };
        resolve((command) => {
          worker.postMessage({ ...command, player: "player1" });
        });
        connection.on("data", (command: Omit<PlayerCommand, "player">) => {
          worker.postMessage({ ...command, player: "player2" });
        });
      });
    });
  });
}

export function joinGame(
  opponentConnectionId: string,
  setGameState: (gameState: GameState) => void
): ExecuteCommand {
  const connection = peer.connect(opponentConnectionId, { reliable: true });
  connection.on("data", setGameState);
  return (command) => {
    connection.send(command);
  };
}
