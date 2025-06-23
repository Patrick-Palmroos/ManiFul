/**
 * Converts HSL (Hue, Saturation, Lightness) values to a HEX colors.
 *
 * @param {number} h - The hue (0–360).
 * @param {number} s - The saturation (0–100).
 * @param {number} l - The lightness (0–100).
 * @returns {string} A HEX color string ("#fffff").
 */
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

/**
 * Generates an array of descending HEX color values by manipulating lightness.
 *
 * @param {Object} params - Configuration object.
 * @param {number} params.count - Number of colors to generate.
 * @param {number} [params.baseHue=360] - Base hue (0–360).
 * @param {number} [params.baseSaturation=100] - Base saturation (0–100).
 * @param {number} [params.startLightness=70] - Starting lightness (0–100).
 * @param {number} [params.step=5] - Amount to decrease lightness per step.
 * @returns {string[]} An array of HEX colors.
 */
export const generateDescendingColors = ({
  count,
  baseHue = 360,
  baseSaturation = 100,
  startLightness = 70,
  step = 5,
}: {
  count: number;
  baseHue: number;
  baseSaturation: number;
  startLightness: number;
  step: number;
}): string[] => {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const lightness = Math.max(0, startLightness - i * step);
    const hexColor = hslToHex(baseHue, baseSaturation, lightness);
    colors.push(hexColor);
  }

  return colors;
};
