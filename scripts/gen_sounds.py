#!/usr/bin/env python3
"""
Synthesizes CRACKD's UI sound effects as 16-bit PCM WAV files — no external
audio assets. v2: modern/sci-fi palette (FM "digital bell" tones, swept
noise whooshes, a simple feedback-delay echo for space) replacing the v1
chiptune/square-wave set. Intro/win/lose are now full short cues with an
arc (attack → body → tail) instead of one-shot blips.

Run: python3 scripts/gen_sounds.py
Outputs into assets/sfx/*.wav
"""
import math
import struct
import wave
import os

SR = 44100
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "sfx")
MUSIC_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "music")


# ---------- primitives ----------

def osc(freq_fn, dur, shape="sine"):
    """One oscillator; `freq_fn(t)` may vary over time (sweeps)."""
    n = int(SR * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        phase += 2 * math.pi * freq_fn(t) / SR
        if shape == "sine":
            out.append(math.sin(phase))
        elif shape == "triangle":
            ph = (phase / (2 * math.pi)) % 1.0
            out.append(4 * abs(ph - 0.5) - 1)
        elif shape == "square":
            ph = (phase / (2 * math.pi)) % 1.0
            out.append(1.0 if ph < 0.5 else -1.0)
    return out


def bell(freq, dur, ratio=1.41, index0=3.0, decay_k=8.0, vol=1.0):
    """
    FM 'digital bell': an inharmonic carrier/modulator ratio (not a clean
    integer) gives a metallic, synthetic chime rather than an organic bell —
    the core timbre for the futuristic keypad/confirm/win tones.
    """
    n = int(SR * dur)
    out = []
    cphase = 0.0
    mphase = 0.0
    mod_freq = freq * ratio
    for i in range(n):
        t = i / SR
        idx = index0 * math.exp(-decay_k * t)
        cphase += 2 * math.pi * freq / SR
        mphase += 2 * math.pi * mod_freq / SR
        s = math.sin(cphase + idx * math.sin(mphase))
        amp = math.exp(-decay_k * 0.55 * t)
        out.append(s * amp * vol)
    a_n = max(1, int(SR * 0.003))
    for i in range(min(a_n, len(out))):
        out[i] *= i / a_n
    return out


def noise(dur, seed=1):
    """Deterministic white noise (xorshift32) so builds are reproducible."""
    n = int(SR * dur)
    x = seed if seed else 1
    out = []
    for _ in range(n):
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= (x >> 17)
        x ^= (x << 5) & 0xFFFFFFFF
        out.append((x / 0xFFFFFFFF) * 2 - 1)
    return out


def lowpass(signal, alpha):
    out = []
    prev = 0.0
    for s in signal:
        prev = alpha * s + (1 - alpha) * prev
        out.append(prev)
    return out


def swept_whoosh(f0, f1, dur, seed=1, lp=0.35):
    """Noise colored by a swept ring-modulator + light smoothing — a airy 'energize' whoosh."""
    n = int(SR * dur)
    raw = noise(dur, seed=seed)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        f = f0 + (f1 - f0) * (t / dur if dur else 0)
        phase += 2 * math.pi * f / SR
        out.append(raw[i] * math.sin(phase))
    return lowpass(out, lp)


def envelope(n, points):
    """`points`: [(time_fraction 0..1, level), ...] sorted; linear interpolation between them."""
    out = []
    for i in range(n):
        t = i / (n - 1) if n > 1 else 0.0
        level = points[-1][1]
        for j in range(len(points) - 1):
            t0, l0 = points[j]
            t1, l1 = points[j + 1]
            if t0 <= t <= t1:
                frac = (t - t0) / (t1 - t0) if t1 > t0 else 0
                level = l0 + (l1 - l0) * frac
                break
        out.append(level)
    return out


def apply_env(signal, points):
    env = envelope(len(signal), points)
    return [s * e for s, e in zip(signal, env)]


def echo(signal, delay_sec, decay, repeats=3):
    """Simple feedback-delay tap — cheap substitute for reverb that reads as 'digital space'."""
    delay_n = int(SR * delay_sec)
    out = list(signal) + [0.0] * (delay_n * repeats)
    for r in range(1, repeats + 1):
        g = decay ** r
        for i, s in enumerate(signal):
            idx = i + delay_n * r
            if idx < len(out):
                out[idx] += s * g
    return out


def gain(signal, g):
    return [s * g for s in signal]


def mix(*layers):
    length = max(len(l) for l in layers)
    out = [0.0] * length
    for layer in layers:
        for i, v in enumerate(layer):
            out[i] += v
    peak = max(1.0, max((abs(v) for v in out), default=1.0))
    return [v / peak for v in out]


def concat(*parts):
    out = []
    for p in parts:
        out.extend(p)
    return out


def silence(dur):
    return [0.0] * int(SR * dur)


def snap_to_loop(freq, loop_dur):
    """Round `freq` to the nearest multiple of 1/loop_dur so it completes a whole
    number of cycles per loop — required for a click-free seamless loop."""
    return round(freq * loop_dur) / loop_dur


def periodic_env(period, loop_dur, shape_fn):
    """A time-varying level built from `t % period`; continuous at the loop
    point as long as `period` divides `loop_dur` evenly and `shape_fn` is
    itself continuous across its own wrap (e.g. built from sin/cos)."""
    n = int(SR * loop_dur)
    out = []
    for i in range(n):
        t = i / SR
        out.append(shape_fn((t % period) / period))
    return out


def pad_to(signal, total_dur):
    n = int(SR * total_dur)
    if len(signal) >= n:
        return signal[:n]
    return signal + [0.0] * (n - len(signal))


def write_wav(name, samples, out_dir=None):
    path = os.path.join(out_dir or OUT_DIR, name)
    with wave.open(path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        frames = b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32000)) for s in samples)
        f.writeframes(frames)
    print(f"wrote {path} ({len(samples)/SR:.3f}s)")


os.makedirs(OUT_DIR, exist_ok=True)

# --- Generic soft UI tap (buttons, cards, tiles): clean sine, quick downward glide ---
write_wav(
    "tap.wav",
    apply_env(osc(lambda t: 700 - 160 * (t / 0.05), 0.05), [(0, 0), (0.06, 1), (0.5, 0.6), (1, 0)]),
)

# --- Number-key click: futuristic digital chirp (FM bell) + a hairline echo for "space" ---
write_wav(
    "key.wav",
    mix(
        echo(bell(1500, 0.09, ratio=1.5, index0=2.2, decay_k=26, vol=0.55), 0.028, 0.22, repeats=2),
        apply_env(osc(lambda t: 2900, 0.02), [(0, 0), (0.15, 1), (1, 0)]),
    ),
)

# --- Delete key: descending digital sweep + airy noise erase ---
write_wav(
    "delete.wav",
    mix(
        apply_env(osc(lambda t: 950 - 650 * (t / 0.11), 0.11, shape="triangle"), [(0, 0), (0.05, 0.6), (1, 0)]),
        gain(swept_whoosh(1400, 300, 0.1, seed=7), 0.5),
    ),
)

# --- Submit / CRACK: sci-fi confirm — rising FM blip + sub thump ---
write_wav(
    "submit.wav",
    mix(
        concat(
            bell(520, 0.14, ratio=1.6, index0=2.5, decay_k=14, vol=0.6),
            silence(0.02),
            bell(900, 0.1, ratio=1.6, index0=1.8, decay_k=20, vol=0.4),
        ),
        pad_to(apply_env(osc(lambda t: 95, 0.09, shape="sine"), [(0, 0), (0.1, 1), (1, 0)]), 0.26),
    ),
)

# --- Vault opening / Win: energize whoosh -> bolt clunk -> ascending bell cascade -> shimmer tail ---
_win_whoosh = apply_env(swept_whoosh(180, 2400, 0.4, seed=3, lp=0.25), [(0, 0), (0.5, 1), (1, 0.2)])
_win_clunk = mix(
    apply_env(osc(lambda t: 75, 0.22, shape="sine"), [(0, 0), (0.05, 1), (1, 0)]),
    bell(260, 0.35, ratio=1.9, index0=4.0, decay_k=7, vol=0.8),
)
_win_arp = echo(
    concat(
        bell(587.33, 0.28, ratio=1.5, index0=2.6, decay_k=6.5, vol=0.55),  # D5
        bell(783.99, 0.28, ratio=1.5, index0=2.6, decay_k=6.5, vol=0.55),  # G5
        bell(987.77, 0.28, ratio=1.5, index0=2.6, decay_k=6, vol=0.6),  # B5
        bell(1318.51, 0.55, ratio=1.5, index0=2.8, decay_k=3.5, vol=0.7),  # E6
    ),
    0.16,
    0.35,
    repeats=3,
)
_win_shimmer = apply_env(
    mix(
        osc(lambda t: 1318.51, 0.9, shape="sine"),
        osc(lambda t: 1324.0, 0.9, shape="sine"),  # slight detune -> chorus shimmer
        osc(lambda t: 659.25, 0.9, shape="sine"),
    ),
    [(0, 0), (0.15, 0.35), (0.8, 0.2), (1, 0)],
)
write_wav(
    "win.wav",
    mix(
        pad_to(_win_whoosh, 2.3),
        pad_to(concat(silence(0.32), _win_clunk), 2.3),
        pad_to(concat(silence(0.55), _win_arp), 2.3),
        pad_to(concat(silence(1.35), _win_shimmer), 2.3),
    ),
)

# --- Lose: modern power-down/error — descending FM alert x2, glitch burst, sub rumble tail ---
_lose_alert = concat(
    bell(420, 0.22, ratio=1.35, index0=2.0, decay_k=9, vol=0.6),
    silence(0.05),
    bell(330, 0.26, ratio=1.35, index0=2.0, decay_k=8, vol=0.6),
)
_lose_glitch = apply_env(
    mix(swept_whoosh(1800, 200, 0.14, seed=11, lp=0.5), noise(0.14, seed=13)),
    [(0, 0), (0.1, 1), (0.6, 0.4), (1, 0)],
)
_lose_rumble = echo(
    apply_env(osc(lambda t: 90 - 40 * (t / 0.9), 0.9, shape="sine"), [(0, 0), (0.08, 1), (0.7, 0.5), (1, 0)]),
    0.09,
    0.3,
    repeats=2,
)
write_wav(
    "lose.wav",
    mix(
        pad_to(_lose_alert, 2.0),
        pad_to(concat(silence(0.58), _lose_glitch), 2.0),
        pad_to(concat(silence(0.78), _lose_rumble), 2.0),
    ),
)

# --- Intro: futuristic boot chime — rising sweep -> bright bell hit -> soft detuned pad tail ---
_intro_sweep = apply_env(osc(lambda t: 200 + 1000 * (t / 0.45), 0.45, shape="sine"), [(0, 0), (0.6, 0.7), (1, 0.15)])
_intro_bell = bell(880, 0.5, ratio=1.5, index0=2.4, decay_k=5.5, vol=0.75)
_intro_pad = apply_env(
    mix(osc(lambda t: 880, 0.7, shape="sine"), osc(lambda t: 884, 0.7, shape="sine")),
    [(0, 0), (0.2, 0.3), (0.8, 0.15), (1, 0)],
)
write_wav(
    "intro.wav",
    mix(
        pad_to(_intro_sweep, 1.55),
        pad_to(concat(silence(0.4), _intro_bell), 1.55),
        pad_to(concat(silence(0.75), _intro_pad), 1.55),
    ),
)


# --- Background music: a seamless ambient "vault heist" loop for gameplay ---
# Every continuous layer uses a frequency/period snapped to a whole number of
# cycles per loop, so the waveform's phase (and its derivative) is identical
# at t=0 and t=LOOP_DUR — the loop point is mathematically click-free, not
# just faded to silence. The one non-periodic layer (air texture, plain noise)
# is faded to exactly 0 at both edges instead, for the same reason.
os.makedirs(MUSIC_DIR, exist_ok=True)
LOOP_DUR = 8.0

_pulse_env = periodic_env(2.0, LOOP_DUR, lambda ph: max(0.0, math.sin(math.pi * ph)) ** 6)
_sub = [
    s * e * 0.5
    for s, e in zip(osc(lambda t: snap_to_loop(55.0, LOOP_DUR), LOOP_DUR, shape="sine"), _pulse_env)
]

_swell_a = periodic_env(LOOP_DUR, LOOP_DUR, lambda ph: 0.5 + 0.5 * math.sin(2 * math.pi * ph))
_swell_b = periodic_env(LOOP_DUR / 2, LOOP_DUR, lambda ph: 0.5 + 0.5 * math.sin(2 * math.pi * ph + 1.0))

_pad_root = osc(lambda t: snap_to_loop(110.0, LOOP_DUR), LOOP_DUR, shape="sine")
_pad_fifth = osc(lambda t: snap_to_loop(164.8, LOOP_DUR), LOOP_DUR, shape="sine")
_pad_octave = osc(lambda t: snap_to_loop(220.0, LOOP_DUR), LOOP_DUR, shape="sine")
_pad = [
    (r * ea * 0.28) + (f * eb * 0.16) + (o * ea * 0.1)
    for r, f, o, ea, eb in zip(_pad_root, _pad_fifth, _pad_octave, _swell_a, _swell_b)
]

_air = lowpass(noise(LOOP_DUR, seed=42), 0.08)
_air = apply_env(_air, [(0, 0), (0.04, 1), (0.96, 1), (1, 0)])
_air = gain(_air, 0.05)

write_wav("vault_loop.wav", mix(_sub, _pad, _air), out_dir=MUSIC_DIR)

print("done")
