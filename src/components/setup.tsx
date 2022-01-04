import { useEffect, useState } from "react";
import { ExecuteCommand, hostGame, joinGame, myConnectionId } from "../p2p";
import { GameState, Player } from "../shared/protocol";
import { Textfield } from "./textfield";

export interface SetupProps {
  setPlayer(player: Player): void;
  setGameState(gameState: GameState): void;
  setExecuteCommand(executeCommand: ExecuteCommand): void;
}

export const Setup: React.FC<SetupProps> = ({
  setPlayer,
  setGameState,
  setExecuteCommand,
}) => {
  const [view, setView] = useState<"start" | "host" | "join" | "joining">(
    "start"
  );
  const [opponentSessionId, setOpponentSessionId] = useState("");

  useEffect(() => {
    switch (view) {
      case "host": {
        setPlayer("player1");
        hostGame(setGameState).then((executeCommand) => {
          setExecuteCommand(() => executeCommand);
        });
        break;
      }
      case "joining": {
        setPlayer("player2");
        const executeCommand = joinGame(opponentSessionId, setGameState);
        setExecuteCommand(() => executeCommand);
        break;
      }
    }
  }, [view]);

  return (
    <div className="setup">
      {view === "start" && (
        <>
          <button className="setup__button" onClick={() => setView("host")}>
            HOST
          </button>
          <button className="setup__button" onClick={() => setView("join")}>
            JOIN
          </button>
        </>
      )}
      {view === "host" && (
        <>
          <Textfield label="Session ID" value={myConnectionId} />
          <div className="setup__message">Waiting for other player ...</div>
        </>
      )}
      {view === "join" && (
        <>
          <Textfield
            label="Session ID"
            value={opponentSessionId}
            onChange={setOpponentSessionId}
          />
          <button
            className="setup__button"
            onClick={() => setView("joining")}
            disabled={!opponentSessionId}
          >
            CONNECT
          </button>
        </>
      )}
      {view === "joining" && (
        <div className="setup__message">Connecting ...</div>
      )}
    </div>
  );
};
