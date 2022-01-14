import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  physicsObject,
  PhysicsSimulation,
  ticksPerSecond,
} from "./physics-simulation";
import { Renderer, RenderObject } from "./renderer";
import { Vec2d } from "./vec2d";

export const App: React.FC = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const handleImgLoaded = useCallback(() => setImgLoaded(true), []);

  const [paused, setPaused] = useState(false);

  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [r, setR] = useState(0);
  const [s, setS] = useState(2);

  useEffect(() => {
    if (!imgLoaded || paused) return;

    const ship: RenderObject = {
      img: imgRef.current!,
      scale: s,
      physics: physicsObject({
        p: new Vec2d(x, y),
        r,
        mvMax: 2,
        ma: 0.025,
        rvMax: Math.PI / 256,
        ra: Math.PI / 1024,
      }),
    };

    const physicsSimulation = new PhysicsSimulation();
    physicsSimulation.objects.add(ship.physics);
    const renderer = new Renderer(canvasRef.current!);
    renderer.objects.push(ship);

    const renderId = setInterval(() => {
      renderer.render();
    }, 1000 / 60);
    const physicsId = setInterval(() => {
      physicsSimulation.tick();
    }, 1000 / ticksPerSecond);
    return () => {
      clearInterval(renderId);
      clearInterval(physicsId);
    };
  }, [imgLoaded, paused, x, y, r, s]);

  return (
    <div className="app">
      <img
        ref={imgRef}
        style={{ display: "none" }}
        src="spaceships/Ship2/Ship2.png"
        onLoad={handleImgLoaded}
      />
      <div className="app__ui">
        <label>
          X coordinate
          <input
            type="range"
            min={0}
            max={1280}
            step={1}
            value={x}
            onChange={(e) => setX(Number.parseInt(e.currentTarget.value))}
          />
        </label>
        <label>
          Y coordinate
          <input
            type="range"
            min={0}
            max={720}
            step={1}
            value={y}
            onChange={(e) => setY(Number.parseInt(e.currentTarget.value))}
          />
        </label>
        <label>
          rotation
          <input
            type="range"
            min={0}
            max={Math.PI * 2}
            step={Math.PI / 8}
            value={r}
            onChange={(e) => setR(Number.parseFloat(e.currentTarget.value))}
          />
        </label>
        <label>
          scale
          <input
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={s}
            onChange={(e) => setS(Number.parseFloat(e.currentTarget.value))}
          />
        </label>
        <button onClick={() => setPaused(!paused)}>pause</button>
      </div>
      <canvas
        className="app__canvas"
        ref={canvasRef}
        width={1280}
        height={720}
      />
    </div>
  );
};
