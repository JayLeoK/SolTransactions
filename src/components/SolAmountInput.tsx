import { formatSolString } from "../utils";

type Props = {
  setSolAmount: (nextAmount: string) => void;
  solAmount: string;
  disabled: boolean;
};
const SolAmountInput: React.FC<Props> = ({
  setSolAmount,
  solAmount,
  disabled,
}) => {
  const LAMPERT_UNIT = 0.000000001;

  return (
    <>
      <label htmlFor="amount-input">Amount</label>
      <input
        id="amount-input"
        type="number"
        value={solAmount}
        placeholder="amount (SOL)"
        step={LAMPERT_UNIT}
        min="0"
        onChange={(event) => setSolAmount(formatSolString(event.target.value))}
        required
        disabled={disabled}
      />
    </>
  );
};

export default SolAmountInput;
