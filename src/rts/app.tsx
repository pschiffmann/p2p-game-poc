import React, { useEffect, useRef } from "react";
import { GameEngine } from "./game-engine";
import { createShip1, createShip2 } from "./game-objects";
import { Renderer } from "./renderer";

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new Renderer(canvasRef.current!);
    renderer.loadImage("ship", "spaceships/Ship2/Ship2.png");
    renderer.loadImage(
      "projectile",
      "spaceships/PNG_Animations/Shots/Shot4/shot4_5.png"
    );
    renderer.loadImage(
      "explosion",
      "spaceships/PNG_Animations/Shots/Shot4/shot4_exp4.png"
    );
    const gameEngine = new GameEngine(renderer);
    createShip2(gameEngine);
    createShip1(gameEngine, [...gameEngine.physicsSimulation.objects][0]);
    gameEngine.resume();
  }, []);

  return (
    <div className="app">
      <div className="app__ui"></div>
      <canvas
        className="app__canvas"
        ref={canvasRef}
        width={1280}
        height={720}
      />
    </div>
  );
};
