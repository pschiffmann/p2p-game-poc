import { useEffect, useState } from "react";
import { ProjectileState } from "../shared/protocol";
import { DmgTextMap } from "./dmg-text";

declare module "csstype" {
  interface Properties {
    readonly "--x-left"?: number;
    readonly "--y-left"?: number;
    readonly "--x-right"?: number;
    readonly "--y-right"?: number;
    readonly "--time-to-impact"?: number;
  }
}

export interface ProjectileProps {
  readonly projectile: ProjectileState;
  readonly direction: "ltr" | "rtl";
  setDmgText(f: (prev: DmgTextMap) => DmgTextMap): void;
}

const typeToClassName = {
  "ION CANNON": "ion",
  "ROCKET LAUNCHER": "rocket",
  "LASER BATTERY": "laser",
} as const;

const typeToBitmap = {
  "ION CANNON": "spaceships/PNG_Animations/Shots/Shot2/shot2_asset.png",
  "ROCKET LAUNCHER": "spaceships/PNG_Animations/Shots/Shot1/shot1_asset.png",
  "LASER BATTERY": "spaceships/PNG_Animations/Shots/Shot4/shot4_5.png",
} as const;

export const Projectile: React.FC<ProjectileProps> = ({
  projectile,
  direction,
  setDmgText,
}) => {
  const [style] = useState(() => ({
    "--x-left": Math.random() * 74 + 366,
    "--y-left": Math.random() * 200 + 237,
    "--x-right": Math.random() * 74 + 836,
    "--y-right": Math.random() * 200 + 237,
    "--time-to-impact": projectile.timeToImpact,
  }));
  const cls = typeToClassName[projectile.type];

  useEffect(() => {
    if (projectile.timeToImpact !== 0) return;
    const { damageType, damangeDone } = projectile;
    const x = direction === "ltr" ? style["--x-right"] : style["--x-left"];
    const y = direction === "ltr" ? style["--y-right"] : style["--y-left"];
    setDmgText((prev) => ({
      ...prev,
      [projectile.id]: { damageType, damangeDone, x, y },
    }));
    setTimeout(
      () =>
        setDmgText((prev) => {
          const result = { ...prev };
          delete result[projectile.id];
          return result;
        }),
      1000
    );
  }, [projectile.timeToImpact]);

  return (
    <img
      className={`projectile projectile--${cls} projectile--${direction}`}
      style={style}
      src={typeToBitmap[projectile.type]}
    />
  );
};
