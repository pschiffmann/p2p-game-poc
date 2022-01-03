import { useState } from "react";

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
  readonly type: "ion" | "laser" | "rocket";
  readonly direction: "ltr" | "rtl";
  readonly timeToImpact: number;
}

const typeToBitmap = {
  ion: "spaceships/PNG_Animations/Shots/Shot2/shot2_asset.png",
  laser: "spaceships/PNG_Animations/Shots/Shot1/shot1_asset.png",
  rocket: "spaceships/PNG_Animations/Shots/Shot4/shot4_5.png",
} as const;

export const Projectile: React.FC<ProjectileProps> = ({
  type,
  direction,
  timeToImpact,
}) => {
  const [style] = useState(() => ({
    "--x-left": Math.random() * 74 + 366,
    "--y-left": Math.random() * 200 + 237,
    "--x-right": Math.random() * 74 + 836,
    "--y-right": Math.random() * 200 + 237,
    "--time-to-impact": timeToImpact,
  }));

  return (
    <img
      className={`projectile projectile--${type} projectile--${direction}`}
      style={style}
      src={typeToBitmap[type]}
    />
  );
};
