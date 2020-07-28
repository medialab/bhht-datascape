const PRETTY_NUMBER = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export function prettyNumber(x) {
  return x.toString().replace(PRETTY_NUMBER, ',');
}
