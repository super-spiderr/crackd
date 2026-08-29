/**
 * The combination panel, guess-history rows, and the Lose screen's code
 * reveal all lay out `codeLength` digit boxes in a row. Their default sizes
 * were tuned for 4 digits; at 5-6 (Bank Vault / Master Vault) the same fixed
 * widths overflow a 390pt-wide phone. These breakpoints shrink box/pin size
 * and gap together as codeLength grows so everything still fits.
 */
export function comboSlotSizing(codeLength: number): { size: number; gap: number } {
  if (codeLength <= 4) return { size: 58, gap: 12 };
  if (codeLength === 5) return { size: 48, gap: 9 };
  return { size: 40, gap: 7 }; // 6
}

export function guessRowSizing(codeLength: number): { cell: number; pin: number; gap: number } {
  if (codeLength <= 4) return { cell: 32, pin: 17, gap: 8 };
  if (codeLength === 5) return { cell: 26, pin: 15, gap: 6 };
  return { cell: 22, pin: 13, gap: 4 }; // 6
}

export function codeRevealSizing(codeLength: number): { box: number; gap: number } {
  if (codeLength <= 4) return { box: 54, gap: 10 };
  if (codeLength === 5) return { box: 46, gap: 8 };
  return { box: 40, gap: 6 }; // 6
}
