import { ShipProps } from "./ship-a";

export const ShipB: React.FC<ShipProps> = ({ name, className }) => {
  return (
    <div className={`${className} ship ship-b`}>
      <img className="ship__base" src="spaceships/Ship6/Ship6.png" />
      <div className="ship__name">{name}</div>
    </div>
  );
};
