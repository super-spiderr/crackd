// Design tokens ported from the CRACKD design canvas ("Tokens · drop-in React Native" panel).
// A few pragmatic additions (marked "extra") fill in colors that appear in the mockups
// but weren't broken out as named tokens in the source panel.

export const tokens = {
  color: {
    bgDeep: '#0E3B3E',
    bgMidnight: '#0B2C36',
    ink: '#0B2224',
    surfaceRaised: '#123F42',
    surfaceRaisedEdge: '#2A5457', // extra: border used on the raised icon buttons
    vaultCream: '#F2E4C9',
    creamEdge: '#C9B489',
    creamBright: '#FBF3DF',
    brass: '#E0A63C',
    brassEdge: '#A8761F',
    exact: '#3DD68C',
    exactEdge: '#1F9660',
    misplaced: '#F7B32B',
    misplacedEdge: '#B87F14',
    dead: '#5E7577',
    deadBorder: '#3E5A5B',
    coral: '#FF6B4A',
    coralEdge: '#B93F22',
    alarm: '#D63A3A',
    textOnDark: '#F2E4C9',
    textDimOnDark: 'rgba(242,228,201,0.55)',
    textFaintOnDark: 'rgba(242,228,201,0.4)',
    lightBg: '#F6EEDC',
    lightBg2: '#EFE2C4',
    lightSurface: '#FFFFFF',
    lightEdge: '#D5C8A6',

    // extra: misc colors pulled directly from screen mockups
    deleteKeyBg: '#3E5A5B',
    deleteKeyEdge: '#24393A',
    slateMuted: '#8FA9A8',
    brownMuted: '#7A6A45',
    lockedTileBg: 'rgba(242,228,201,0.1)',
    lockedTileEdge: 'rgba(242,228,201,0.2)',
    loseSafeBody: '#D9CBAD',
    loseSafeRing: '#B8935E',

    // extra: added for 2-player duel color picking — rounds out the palette
    // with hues distinct from the existing accent colors above.
    duelBlue: '#4A9DE0',
    duelPurple: '#9B6BE0',
  },
  type: {
    display: 'Bungee_400Regular', // logo, digits, headlines
    ui: 'Outfit_400Regular', // body copy
    uiMedium: 'Outfit_500Medium',
    uiSemiBold: 'Outfit_600SemiBold',
    uiBold: 'Outfit_700Bold',
    uiExtraBold: 'Outfit_800ExtraBold',
    logo: 44,
    h1: 30,
    dial: 34,
    key: 22,
    body: 15,
    label: 12,
    caption: 11,
    labelTracking: 3,
  },
  radius: { card: 20, button: 16, key: 15, dial: 14, chip: 9, phone: 44 },
  space: { xs: 6, s: 10, m: 14, l: 20, xl: 30 },
  border: { thick: 3, hairline: 2, edgeDepth: 5 }, // edgeDepth = bottom "shadow" offset
  motion: {
    keypress: 80,
    keySpringBack: 120,
    dialSpin: 500,
    dialStagger: 150,
    pinDrop: 350,
    pinStagger: 100,
    doorOpen: 600,
    shake: 200,
    transition: 240,
    snap: [0.34, 1.56, 0.64, 1] as const, // cubic-bezier overshoot
  },
};

export type Tokens = typeof tokens;
