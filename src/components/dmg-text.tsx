import { ProjectileState } from "../shared/protocol";

export interface DmgTextProps
  extends Pick<ProjectileState, "damageType" | "damangeDone"> {
  readonly x: number;
  readonly y: number;
}

export interface DmgTextMap {
  readonly [projectileId: string]: DmgTextProps;
}

export const DmgText: React.FC<DmgTextProps> = ({
  damageType,
  damangeDone,
  x,
  y,
}) => {
  return (
    <div
      className={`dmg-text dmg-text--${damageType}`}
      style={{ left: x, top: y }}
    >
      {damageType === "miss" ? "MISS" : damangeDone}
    </div>
  );
};
