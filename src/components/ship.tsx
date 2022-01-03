export interface ShipProps {
  readonly className: string;
  readonly type: "a" | "b";
  readonly name: string;
}

const typeToBitmap = {
  a: "spaceships/Ship2/Ship2.png",
  b: "spaceships/Ship6/Ship6.png",
} as const;

export const Ship: React.FC<ShipProps> = ({ className, name, type }) => {
  return (
    <div className={`${className} ship ship-${type}`}>
      <img className="ship__base" src={typeToBitmap[type]} />
      <div className="ship__name">{name}</div>
    </div>
  );
};
