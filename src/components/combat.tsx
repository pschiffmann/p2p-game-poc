import { useState } from "react";
import { Projectile } from "./projectile";
import { Ship } from "./ship";
import { ShipStatus } from "./ship-status";
import { System } from "./system";

export const Combat: React.FC = () => {
  const [paused, setPaused] = useState(false);

  return (
    <div className={"combat" + (paused ? " combat--paused" : "")}>
      <Ship
        className="combat__ship combat__ship--mine"
        type="a"
        name="UNSINKABLE"
      />
      <Ship
        className="combat__ship combat__ship--enemy"
        type="b"
        name="NORMANDY"
      />
      <div className="combat__systems combat__systems--mine">
        <System
          type="ION CANNON"
          hp={100}
          currentEnergy={3}
          setEnergy={() => {}}
          attack={() => {}}
          deactivate={() => {}}
        />
        <System
          type="ROCKET LAUNCHER"
          hp={100}
          currentEnergy={3}
          setEnergy={() => {}}
          attack={() => {}}
          deactivate={() => {}}
        />
        <System
          type="SHIELD GENERATOR S"
          hp={100}
          currentEnergy={3}
          setEnergy={() => {}}
          deactivate={() => {}}
        />
        <System
          type="THRUSTERS S"
          hp={100}
          currentEnergy={3}
          setEnergy={() => {}}
          deactivate={() => {}}
        />
      </div>
      <div className="combat__systems combat__systems--enemy">
        <System type="LASER BATTERY" hp={100} currentEnergy={3} />
        <System type="LASER BATTERY" hp={100} currentEnergy={3} />
        <System type="SHIELD GENERATOR L" hp={100} currentEnergy={3} />
        <System type="THRUSTERS L" hp={100} currentEnergy={3} />
      </div>
      <ShipStatus
        className="combat__ship-status combat__ship-status--mine"
        name="UNSINKABLE"
        shieldHp={150}
        maxEnergy={10}
        unusedEnergy={3}
      />
      <ShipStatus
        className="combat__ship-status combat__ship-status--enemy"
        name="NORMANDY"
        shieldHp={200}
        maxEnergy={15}
        unusedEnergy={0}
      />
      <button className="combat__pause" onClick={() => setPaused((x) => !x)}>
        PAUSE
      </button>
      <Projectile type="ion" direction="ltr" timeToImpact={2.5} />
      <Projectile type="rocket" direction="ltr" timeToImpact={3.5} />
      <Projectile type="laser" direction="rtl" timeToImpact={0.8} />
      <Projectile type="laser" direction="rtl" timeToImpact={0.8} />
    </div>
  );
};
