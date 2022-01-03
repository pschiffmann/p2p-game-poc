export interface ShipStatusProps {
  readonly className: string;
  readonly name: string;
  readonly shieldHp: number;
  readonly maxEnergy: number;
  readonly unusedEnergy: number;
}

export const ShipStatus: React.FC<ShipStatusProps> = ({
  className,
  name,
  shieldHp,
  maxEnergy,
  unusedEnergy,
}) => {
  return (
    <div className={`${className} ship-status`}>
      <div className="ship-status__name">{name}</div>
      <div className="ship-status__shield">SHIELD HP: {shieldHp}</div>
      <div className="ship-status__energy">
        {new Array(maxEnergy).fill(0).map((_, i) => (
          <div
            key={i}
            className={
              "ship-status__energy-bar" +
              (i >= unusedEnergy ? " ship-status__energy-bar--unused" : "")
            }
          />
        ))}
      </div>
    </div>
  );
};
