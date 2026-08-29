import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { tokens } from '../theme/tokens';

const { color } = tokens;

/** The CRACKD combination-dial logo mark used on the Home screen and app icon. */
export function DialLogoIcon({ size = 76 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 120 120" width={size} height={size}>
      <Rect x={4} y={4} width={112} height={112} rx={28} fill={color.vaultCream} stroke={color.ink} strokeWidth={6} />
      <Circle cx={60} cy={60} r={32} fill="none" stroke={color.brass} strokeWidth={6} />
      <Circle cx={60} cy={60} r={14} fill="none" stroke={color.ink} strokeWidth={6} />
      <Line x1={60} y1={30} x2={60} y2={46} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Line x1={60} y1={74} x2={60} y2={90} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Line x1={30} y1={60} x2={46} y2={60} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Line x1={74} y1={60} x2={90} y2={60} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Circle cx={60} cy={60} r={5} fill={color.coral} stroke={color.ink} strokeWidth={3} />
    </Svg>
  );
}

/** Gear glyph for the Settings entry point. */
export function GearIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Path
        d="M10 3 L11.2 3 L11.6 5 A5.9 5.9 0 0 1 13.3 6 L15.2 5.2 L16.2 6.9 L14.7 8.2 A5.9 5.9 0 0 1 14.7 11.8 L16.2 13.1 L15.2 14.8 L13.3 14 A5.9 5.9 0 0 1 11.6 15 L11.2 17 L8.8 17 L8.4 15 A5.9 5.9 0 0 1 6.7 14 L4.8 14.8 L3.8 13.1 L5.3 11.8 A5.9 5.9 0 0 1 5.3 8.2 L3.8 6.9 L4.8 5.2 L6.7 6 A5.9 5.9 0 0 1 8.4 5 Z"
        fill="none"
        stroke={color.textOnDark}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={10} cy={10} r={2.6} fill="none" stroke={color.textOnDark} strokeWidth={1.6} />
    </Svg>
  );
}

/** Back-chevron glyph used inside the raised icon button on Game/Stats/Map headers. */
export function BackChevronIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size * 1.0}>
      <Path d="M12 4 L6 10 L12 16" fill="none" stroke={color.textOnDark} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Backspace / delete glyph for the keypad. */
export function DeleteIcon({ size = 30 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 28 20" width={size} height={(size * 20) / 28}>
      <Path
        d="M9 2 L2 10 L9 18 H25 a2 2 0 0 0 2-2 V4 a2 2 0 0 0 -2-2 Z"
        fill={color.vaultCream}
        stroke={color.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Line x1={13} y1={7} x2={19} y2={13} stroke={color.ink} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={19} y1={7} x2={13} y2={13} stroke={color.ink} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/** Gem/flame reward glyph for the Daily Vault card. */
export function DailyVaultIcon({ size = 38 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 40 40" width={size} height={size}>
      <Path
        d="M20 4 C26 12 30 14 30 23 a10 10 0 0 1 -20 0 C10 16 15 12 20 4 Z"
        fill={color.misplaced}
        stroke={color.ink}
        strokeWidth={3}
      />
      <Path
        d="M20 18 c3 4 4 5 4 8 a4 4 0 0 1 -8 0 c0-3 2-5 4-8 Z"
        fill={color.coral}
        stroke={color.ink}
        strokeWidth={2.5}
      />
    </Svg>
  );
}

/** Padlock badge used on the "locked" difficulty tile chip. */
export function LockBadgeIcon({ size = 9, tint = 'rgba(242,228,201,0.55)' }: { size?: number; tint?: string }) {
  return (
    <Svg viewBox="0 0 12 14" width={size} height={(size * 14) / 12}>
      <Rect x={1} y={6} width={10} height={7} rx={2} fill={tint} />
      <Path d="M3 6 V4.5 a3 3 0 0 1 6 0 V6" fill="none" stroke={tint} strokeWidth={2} />
    </Svg>
  );
}

/** Bike-lock illustration for the difficulty map's cracked tile. */
export function BikeLockIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 160 160" width={size} height={size}>
      <Path d="M50 92 V56 a30 30 0 0 1 60 0 V92" fill="none" stroke={color.ink} strokeWidth={20} strokeLinecap="round" />
      <Path d="M50 92 V56 a30 30 0 0 1 60 0 V92" fill="none" stroke="#9FB6B4" strokeWidth={10} strokeLinecap="round" />
      <Rect x={24} y={86} width={112} height={50} rx={15} fill={color.brass} stroke={color.ink} strokeWidth={6} />
      <Rect x={42} y={99} width={20} height={24} rx={5} fill={color.bgDeep} stroke={color.ink} strokeWidth={4} />
      <Rect x={70} y={99} width={20} height={24} rx={5} fill={color.bgDeep} stroke={color.ink} strokeWidth={4} />
      <Rect x={98} y={99} width={20} height={24} rx={5} fill={color.bgDeep} stroke={color.ink} strokeWidth={4} />
      <Circle cx={52} cy={111} r={3.5} fill={color.vaultCream} />
      <Circle cx={80} cy={111} r={3.5} fill={color.vaultCream} />
      <Circle cx={108} cy={111} r={3.5} fill={color.vaultCream} />
    </Svg>
  );
}

/** House-safe illustration for the difficulty map's in-progress tile. */
export function HouseSafeIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 160 160" width={size} height={size}>
      <Rect x={30} y={22} width={100} height={104} rx={18} fill={color.vaultCream} stroke={color.ink} strokeWidth={6} />
      <Rect x={42} y={126} width={20} height={12} rx={4} fill={color.ink} />
      <Rect x={98} y={126} width={20} height={12} rx={4} fill={color.ink} />
      <Rect x={44} y={36} width={72} height={76} rx={10} fill="none" stroke={color.brass} strokeWidth={5} />
      <Circle cx={72} cy={74} r={19} fill={color.brass} stroke={color.ink} strokeWidth={5} />
      <Line x1={72} y1={61} x2={72} y2={70} stroke={color.ink} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={72} cy={74} r={4} fill={color.ink} />
      <Rect x={102} y={66} width={10} height={18} rx={4} fill={color.ink} />
    </Svg>
  );
}

/** Bank-vault illustration for the difficulty map's locked tile (render at reduced opacity). */
export function BankVaultIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 160 160" width={size} height={size}>
      <Rect x={16} y={16} width={128} height={128} rx={24} fill="#41585A" stroke={color.ink} strokeWidth={6} />
      <Circle cx={80} cy={80} r={48} fill="#8FA5A3" stroke={color.ink} strokeWidth={6} />
      <Circle cx={80} cy={80} r={32} fill="none" stroke="#5E7577" strokeWidth={5} />
      <Circle cx={80} cy={80} r={15} fill="none" stroke={color.ink} strokeWidth={6} />
      <Line x1={80} y1={50} x2={80} y2={110} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Line x1={54} y1={65} x2={106} y2={95} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
      <Line x1={106} y1={65} x2={54} y2={95} stroke={color.ink} strokeWidth={6} strokeLinecap="round" />
    </Svg>
  );
}

/** The dial face used on both the win-screen door and its base plate. */
export function DialFace({ size = 300, fill = color.vaultCream }: { size?: number; fill?: string }) {
  return (
    <Svg viewBox="0 0 220 220" width={size} height={size}>
      <Circle cx={110} cy={110} r={92} fill={fill} stroke={color.ink} strokeWidth={7} />
      <Circle cx={110} cy={110} r={66} fill="none" stroke={color.brass} strokeWidth={6} />
      <Circle cx={110} cy={30} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={167} cy={53} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={190} cy={110} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={167} cy={167} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={110} cy={190} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={53} cy={167} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={30} cy={110} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={53} cy={53} r={6} fill={color.brass} stroke={color.ink} strokeWidth={3} />
      <Circle cx={110} cy={110} r={32} fill="none" stroke={color.ink} strokeWidth={7} />
      <Line x1={110} y1={78} x2={110} y2={142} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Line x1={82} y1={94} x2={138} y2={126} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Line x1={138} y1={94} x2={82} y2={126} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Circle cx={110} cy={110} r={10} fill={color.brass} stroke={color.ink} strokeWidth={4} />
    </Svg>
  );
}

/** The safe's back plate, revealed once the win-screen door swings away. */
export function SafeBackPlate({ size = 300 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 220 220" width={size} height={size}>
      <Circle cx={110} cy={110} r={92} fill="#07242A" stroke={color.ink} strokeWidth={7} />
      <Rect x={80} y={130} width={26} height={16} rx={4} fill={color.brass} stroke={color.ink} strokeWidth={3.5} />
      <Rect x={108} y={130} width={26} height={16} rx={4} fill={color.brass} stroke={color.ink} strokeWidth={3.5} />
      <Rect x={94} y={114} width={26} height={16} rx={4} fill={color.misplaced} stroke={color.ink} strokeWidth={3.5} />
      <Circle cx={140} cy={92} r={10} fill={color.misplaced} stroke={color.ink} strokeWidth={3.5} />
      <Circle cx={76} cy={96} r={8} fill={color.brass} stroke={color.ink} strokeWidth={3.5} />
    </Svg>
  );
}

/** The light-burst rays behind the win-screen safe. */
export function RaysIcon({ size = 300 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 220 220" width={size} height={size}>
      <Path d="M110,110 L220,40 L220,78 Z" fill="#F7E9A8" opacity={0.5} />
      <Path d="M110,110 L210,150 L190,196 Z" fill="#F7E9A8" opacity={0.4} />
      <Path d="M110,110 L10,50 L30,20 Z" fill="#F7E9A8" opacity={0.4} />
      <Path d="M110,110 L0,140 L16,180 Z" fill="#F7E9A8" opacity={0.35} />
    </Svg>
  );
}

/** Clock-with-arrow glyph for the pass-and-play match history entry point. */
export function HistoryIcon({ size = 16, tint = color.brass }: { size?: number; tint?: string }) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Path
        d="M4.2 5.2 A7 7 0 1 1 3 10"
        fill="none"
        stroke={tint}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d="M4.2 2.2 V5.6 H7.6" fill="none" stroke={tint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={10} y1={6.4} x2={10} y2={10.4} stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={10} y1={10.4} x2={12.8} y2={12} stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** Share/export glyph — a dot with two branching nodes — for "share as image" actions. */
export function ShareIcon({ size = 16, tint = color.ink }: { size?: number; tint?: string }) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Circle cx={5} cy={10} r={2.4} fill="none" stroke={tint} strokeWidth={1.8} />
      <Circle cx={15} cy={4.5} r={2.4} fill="none" stroke={tint} strokeWidth={1.8} />
      <Circle cx={15} cy={15.5} r={2.4} fill="none" stroke={tint} strokeWidth={1.8} />
      <Line x1={7.1} y1={8.8} x2={12.9} y2={5.7} stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={7.1} y1={11.2} x2={12.9} y2={14.3} stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** The dented, siren-taped safe illustration for the Lose screen. */
export function LoseSafeIcon({ size = 270 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 220 220" width={size} height={size}>
      <Circle cx={110} cy={110} r={92} fill={color.loseSafeBody} stroke={color.ink} strokeWidth={7} />
      <Circle cx={110} cy={110} r={66} fill="none" stroke={color.loseSafeRing} strokeWidth={6} />
      <Circle cx={110} cy={110} r={32} fill="none" stroke={color.ink} strokeWidth={7} />
      <Line x1={110} y1={78} x2={110} y2={142} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Line x1={82} y1={94} x2={138} y2={126} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Line x1={138} y1={94} x2={82} y2={126} stroke={color.ink} strokeWidth={7} strokeLinecap="round" />
      <Circle cx={110} cy={110} r={10} fill={color.loseSafeRing} stroke={color.ink} strokeWidth={4} />
      <Rect x={14} y={58} width={192} height={26} rx={10} fill={color.alarm} stroke={color.ink} strokeWidth={5} transform="rotate(-14 110 71)" />
      <Rect x={14} y={140} width={192} height={26} rx={10} fill={color.alarm} stroke={color.ink} strokeWidth={5} transform="rotate(10 110 153)" />
    </Svg>
  );
}
