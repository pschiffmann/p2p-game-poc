declare module "csstype" {
  interface Properties {
    readonly "--speed"?: string;
  }
}

export interface SystemProps {
  readonly name: string;
  readonly hp: number;
  readonly speed?: number;
  readonly customAttributes?: { readonly [name: string]: string };
  readonly maxEnergy: number;
  readonly currentEnergy: number;
  setEnergy?(): void;
  attack?(): void;
  deactivate?(): void;
}

export const System: React.FC<SystemProps> = ({
  name,
  hp,
  speed,
  customAttributes,
  maxEnergy,
  currentEnergy,
  setEnergy,
  attack,
  deactivate,
}) => {
  return (
    <div className="system">
      <div className="system__name">{name}</div>
      <div className="system__health">HP: {hp}</div>
      {speed && (
        <>
          <div className="system__speed">SPEED: {speed}s</div>
          <div className="system__charge" style={{ "--speed": `${speed}s` }} />
        </>
      )}
      {customAttributes &&
        Object.entries(customAttributes).map(([name, value]) => (
          <div key={name} className="system__attribute">
            {name}: {value}
          </div>
        ))}
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
