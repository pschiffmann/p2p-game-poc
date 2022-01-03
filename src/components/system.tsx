import { SystemType } from "../shared/protocol";
import { calculateCurrentSpeed, systemAttributes } from "../shared/systems";

declare module "csstype" {
  interface Properties {
    readonly "--speed"?: string;
  }
}

export interface SystemProps {
  readonly type: SystemType;
  readonly hp: number;
  readonly currentEnergy: number;
  setEnergy?(): void;
  attack?(): void;
  deactivate?(): void;
}

export const System: React.FC<SystemProps> = ({
  type,
  hp,
  currentEnergy,
  setEnergy,
  attack,
  deactivate,
}) => {
  const attributes = systemAttributes[type];
  const maxEnergy = attributes["MAX ENERGY"];
  const speed = calculateCurrentSpeed(type, currentEnergy);
  return (
    <div className="system">
      <div className="system__name">{type}</div>
      <div className="system__details">
        <div className="system__details-icon">i</div>
        <div className="system__details-popover">
          {Object.entries(attributes).map(([name, value]) => (
            <div key={name} className="system__details-attribute">
              {name}:{" "}
              {name === "BASE DODGE" || name === "DODGE/ENERGY"
                ? `${100 * value}%`
                : value}
            </div>
          ))}
        </div>
      </div>
      <div className="system__health">HP: {hp}</div>
      {speed !== 0 && (
        <div className="system__charge" style={{ "--speed": `${speed}s` }}>
          {speed}s
        </div>
      )}
      <div
        className={
          "system__energy" + (setEnergy ? "" : " system__energy--readonly")
        }
      >
        {new Array(maxEnergy).fill(0).map((_, i) => {
          const index = maxEnergy - i;
          return (
            <div
              key={i}
              className={
                "system__energy-bar" +
                (index <= currentEnergy ? " system__energy-bar--active" : "")
              }
            />
          );
        })}
      </div>
      {attack && (
        <button className="system__action" onClick={attack}>
          attack
        </button>
      )}
      {deactivate && (
        <button className="system__action" onClick={attack}>
          deactivate
        </button>
      )}
    </div>
  );
};
