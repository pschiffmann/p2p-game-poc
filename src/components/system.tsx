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
  attack?(): void;
  deactivate?(): void;
}

export const System: React.FC<SystemProps> = ({
  name,
  hp,
  speed,
  customAttributes,
  maxEnergy,
  attack,
  deactivate,
}) => {
  return (
    <div className="system">
      <div className="system__name">{name}</div>
      <div className="system__health">HP: {hp}</div>
      {speed && (
        <>
          <div className="system__speed">Speed: {speed}s</div>
          <div className="system__charge" style={{ "--speed": `${speed}s` }} />
        </>
      )}
      {customAttributes &&
        Object.entries(customAttributes).map(([name, value]) => (
          <div key={name} className="system__attribute">
            {name}: {value}
          </div>
        ))}
      <div className="system__energy">
        {new Array(maxEnergy).fill(0).map((_, i) => (
          <div key={i} className="system__energy-bar" />
        ))}
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
