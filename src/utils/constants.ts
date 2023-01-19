import {Preset} from "../types";

export const vendorFlavorKeys = [
  // Blink and some browsers on iOS
  'chrome',

  // Safari on macOS
  'safari',

  // Chrome on iOS (checked in 85 on 13 and 87 on 14)
  '__crWeb',
  '__gCrWeb',

  // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
  'yandex',

  // Yandex Browser on iOS (checked in 21.2 on 14)
  '__yb',
  '__ybro',

  // Firefox on iOS (checked in 32 on 14)
  '__firefox__',

  // Edge on iOS (checked in 46 on 14)
  '__edgeTrackingPreventionStatistics',
  'webkit',

  // Opera Touch on iOS (checked in 2.6 on 14)
  'oprt',

  // Samsung Internet on Android (checked in 11.1)
  'samsungAr',

  // UC Browser on Android (checked in 12.10 and 13.0)
  'ucweb',
  'UCShellJava',

  // Puffin on Android (checked in 9.0)
  'puffinDevice',

  // UC on iOS and Opera on Android have no specific global variables
  // Edge for Android isn't checked
];

export const textSizeForFontInfo = '48px';
// M or w because these two characters take up the maximum width
// And use a LLi so that the same matching fonts can get separated
export const testFontString = 'mmMwWLliI0O&1';
export const baseFonts = ['monospace', 'sans-serif', 'serif'] as const;
export const fontList = [
  // This is android-specific font from "Roboto" family
  'sans-serif-thin',
  'ARNO PRO',
  'Agency FB',
  'Arabic Typesetting',
  'Arial Unicode MS',
  'AvantGarde Bk BT',
  'BankGothic Md BT',
  'Batang',
  'Bitstream Vera Sans Mono',
  'Calibri',
  'Century',
  'Century Gothic',
  'Clarendon',
  'EUROSTILE',
  'Franklin Gothic',
  'Futura Bk BT',
  'Futura Md BT',
  'GOTHAM',
  'Gill Sans',
  'HELV',
  'Haettenschweiler',
  'Helvetica Neue',
  'Humanst521 BT',
  'Leelawadee',
  'Letter Gothic',
  'Levenim MT',
  'Lucida Bright',
  'Lucida Sans',
  'Menlo',
  'MS Mincho',
  'MS Outlook',
  'MS Reference Specialty',
  'MS UI Gothic',
  'MT Extra',
  'MYRIAD PRO',
  'Marlett',
  'Meiryo UI',
  'Microsoft Uighur',
  'Minion Pro',
  'Monotype Corsiva',
  'PMingLiU',
  'Pristina',
  'SCRIPTINA',
  'Segoe UI Light',
  'Serifa',
  'SimHei',
  'Small Fonts',
  'Staccato222 BT',
  'TRAJAN PRO',
  'Univers CE 55 Medium',
  'Vrinda',
  'ZWAdobeF',
] as const;

export const fontsPreferencesPresets: Record<string, Preset> = {
  /**
   * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
   * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
   */
  default: [],
  /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
  apple: [{ font: '-apple-system-body' }],
  /** User can change it in desktop Chrome and desktop Firefox. */
  serif: [{ fontFamily: 'serif' }],
  /** User can change it in desktop Chrome and desktop Firefox. */
  sans: [{ fontFamily: 'sans-serif' }],
  /** User can change it in desktop Chrome and desktop Firefox. */
  mono: [{ fontFamily: 'monospace' }],
  /**
   * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
   * The height can be 0 in Chrome on a retina display.
   */
  min: [{ fontSize: '1px' }],
  /** Tells one OS from another in desktop Chrome. */
  system: [{ fontFamily: 'system-ui' }],
};
export const defaultPresetText = 'mmMwWLliI0fiflO&1';