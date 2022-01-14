export const pi2 = Math.PI * 2;

export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(x, max));
}
