import { useCallback, useState } from 'react';
import { score } from '../engine/score';

export type Guess = { digits: number[]; exact: number; mis: number };
export type Phase = 'play' | 'won' | 'lost';

export const MAX_ATTEMPTS = 10;
export const SUBMIT_DELAY_MS = 850; // mirrors the "dial spin" settle time before a guess resolves

function newCode(len: number): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
}

type Options = {
  /**
   * Use this exact code instead of generating a random one — how 2-player
   * duels work: each player's hook instance is preset to the *other*
   * player's secret, so `key`/`del`/`submit` here are unchanged, but you're
   * cracking a human-chosen code instead of a random one.
   */
  presetSecret?: number[];
};

/**
 * Port of the design canvas's `Component` class (the "House Safe" game logic)
 * to a React hook: same state shape, same rules (Mastermind-style exact/misplaced
 * pin scoring, 10 attempts, one active digit vault at a time). Scoring itself
 * is delegated to `engine/score` — the same pure function covered by
 * `engine/score.test.ts`, so this hook can't drift from those guarantees.
 */
export function useVaultGame(codeLength: number, options?: Options) {
  const [code, setCode] = useState(() => options?.presetSecret ?? newCode(codeLength));
  const [entry, setEntry] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [phase, setPhase] = useState<Phase>('play');
  const [spinning, setSpinning] = useState(false);

  const reset = useCallback(() => {
    setCode(newCode(codeLength));
    setEntry([]);
    setGuesses([]);
    setPhase('play');
    setSpinning(false);
  }, [codeLength]);

  const key = useCallback(
    (n: number) => {
      if (spinning || phase !== 'play') return;
      setEntry((e) => (e.length >= codeLength ? e : [...e, n]));
    },
    [spinning, phase, codeLength],
  );

  const del = useCallback(() => {
    if (spinning) return;
    setEntry((e) => e.slice(0, -1));
  }, [spinning]);

  const submit = useCallback(() => {
    if (spinning || phase !== 'play' || entry.length < codeLength) return;

    const { exact, misplaced: mis } = score(code.join(''), entry.join(''));

    setSpinning(true);
    const submittedEntry = [...entry];
    setTimeout(() => {
      setGuesses((gs) => {
        const next = [...gs, { digits: submittedEntry, exact, mis }];
        setPhase(exact === codeLength ? 'won' : next.length >= MAX_ATTEMPTS ? 'lost' : 'play');
        return next;
      });
      setEntry([]);
      setSpinning(false);
    }, SUBMIT_DELAY_MS);
  }, [spinning, phase, entry, code, codeLength]);

  return { code, entry, guesses, phase, spinning, key, del, submit, reset };
}
