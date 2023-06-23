const LAMPORTS_PER_SOL = 1000000000;

export const formatSolString = (value: string) => {
  if (
    value === "" ||
    Number(Number(value).toFixed(0)) === Number(value) // value can be simplified to an integer, no need to enforce decimals
  ) {
    return value;
  }
  //handle exponential using regex
  //eg. 1e-7, 3.93e-9, 1.000000001e-9
  const exponentialRegex = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/;
  if (exponentialRegex.test(value)) {
    return Number(value).toFixed(9);
  }
  const decimalsToShow = Math.min(value.split(".")[1].length, 9); // 9 is the max decimals for SOL
  return Number(value).toFixed(decimalsToShow);
};

export const lamportsToSol = (lamports: number) => {
  return formatSolString(Number(lamports / LAMPORTS_PER_SOL).toString());
};
