export interface ShipProps {
  readonly name: string;
  readonly className: string;
}

export const ShipA: React.FC<ShipProps> = ({ name, className }) => {
  return (
    <div className={`${className} ship ship-a`}>
      <img className="ship__base" src="spaceships/Ship2/Ship2.png" />
      <div className="ship__name">{name}</div>
    </div>
  );
};
