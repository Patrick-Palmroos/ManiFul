export const hslToHex = (h: number, s: number, l: number): string => {
  //normalizing the values.
  s /= 100;
  l /= 100;

  //dividing hue circle into 12 segments.
  const k = (n: number) => (n + h / 30) % 12;
  //a value conversion.
  const a = s * Math.min(l, 1 - l);
  //Calculating the rgb values
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));

  //conversion to hex
  const hex = [f(0), f(8), f(4)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');

  return `#${hex}`;
};
