import { useState } from "react";
import { Projectile } from "./projectile";
import { ShipA } from "./ship-a";
import { ShipB } from "./ship-b";
import { ShipStatus } from "./ship-status";
import { System } from "./system";

export const Combat: React.FC = () => {
  const [paused, setPaused] = useState(false);

  return (
    <div className={"combat" + (paused ? " combat--paused" : "")}>
      <ShipA className="combat__ship combat__ship--mine" name="UNSINKABLE" />
      <ShipB className="combat__ship combat__ship--enemy" name="NORMANDY" />
      <div className="combat__systems combat__systems--mine">
        <System
          name="ION CANNON"
          hp={100}
          speed={2.5}
          maxEnergy={4}
          attack={() => {}}
          deactivate={() => {}}
        />
        <System
          name="ROCKET LAUNCHER"
          hp={100}
          speed={3.5}
          maxEnergy={3}
          attack={() => {}}
          deactivate={() => {}}
        />
        <System
          name="SHIELD GENERATOR"
          hp={100}
          speed={5}
          maxEnergy={6}
          deactivate={() => {}}
        />
        <System
          name="THRUSTERS"
          hp={100}
          customAttributes={{ DODGE: "15%" }}
          maxEnergy={3}
          deactivate={() => {}}
        />
      </div>
      <div className="combat__systems combat__systems--enemy">
        <System name="LASER BATTERY" hp={100} speed={0.8} maxEnergy={5} />
        <System name="LASER BATTERY" hp={100} speed={0.8} maxEnergy={5} />
        <System name="SHIELD GENERATOR" hp={100} speed={5} maxEnergy={6} />
        <System
          name="THRUSTERS"
          hp={100}
          customAttributes={{ DODGE: "5%" }}
          maxEnergy={3}
        />
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
