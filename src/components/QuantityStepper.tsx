import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({ value, onChange }: Props) {
  return (
    <div className="stepper">
      <button aria-label="Decrease quantity" onClick={() => onChange(Math.max(0, value - 1))} type="button">
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button aria-label="Increase quantity" onClick={() => onChange(value + 1)} type="button">
        <Plus size={16} />
      </button>
    </div>
  );
}
