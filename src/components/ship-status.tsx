import { ShipState } from "../shared/protocol";

export interface ShipStatusProps {
  readonly className: string;
  readonly ship: ShipState;
}

export const ShipStatus: React.FC<ShipStatusProps> = ({ className, ship }) => {
  return (
    <div className={`${className} ship-status`}>
      <div className="ship-status__name">{ship.name}</div>
      <div className="ship-status__shield">SHIELD HP: {ship.shieldHp}</div>
      <div className="ship-status__dodge">
        DODGE: {(ship.dodge * 100).toFixed(0)}%
      </div>
      <div className="ship-status__energy">
        {new Array(ship.maxEnergy).fill(0).map((_, i) => (
          <div
            key={i}
            className={
              "ship-status__energy-bar" +
              (i < ship.unusedEnergy ? " ship-status__energy-bar--active" : "")
            }
          />
        ))}
      </div>
    </div>
  );
};
