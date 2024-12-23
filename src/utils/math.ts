/**
 * Calculate the modulo ensuring the reslult is a positive integer
 * @param a
 * @param b
 * @returns a % b
 */
export const modulo = (a: bigint, b: bigint): bigint => (BigInt(a) + BigInt(b)) % BigInt(b);
