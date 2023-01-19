import { exitFullscreen, getFullscreenElement, selectorToElement, withIframe } from './utils/dom';
import { x64hash128 } from './utils/hashing';
import { getFilters } from './utils/dom-blockers';
import { MaybePromise, suppressUnhandledRejectionWarning, wait } from './utils/async';
import {
  CanvasFingerprint,
  ContrastPreference,
  FrameSize,
  IGetTouchSupport,
  IGetVideoCardInfo,
  InnerErrorName,
  PluginData,
  PluginMimeTypeData,
  SpecialFingerprint,
} from './types';
import { canvasToString, doesSupportWinding, isSupported, makeCanvasContext, renderGeometryImage, renderTextImage } from './utils/canvas';
import { objectToCanonicalString, paramToString, unknownStringValue as defaultStringValue } from './utils/formaters';
import { baseFonts, defaultPresetText, fontList, fontsPreferencesPresets, testFontString, textSizeForFontInfo, vendorFlavorKeys } from './utils/constants';
import { matchGenerator } from './utils/css-helpers';
import { countTruthy, replaceNaN, round, toFloat, toInt } from './utils/data';
import { isAndroid, isChromium, isChromium86OrNewer, isDesktopSafari, isEdgeHTML, isIPad, isTrident, isWebKit, isWebKit606OrNewer } from './utils/browser';

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){return false;}');

export class Device {
  private hash: Function;
  private unknownStringValue = defaultStringValue;
  screenColorDepth: string = this.unknownStringValue;
  colorGamut: string = this.unknownStringValue;
  contrastPreferences: string = this.unknownStringValue;
  cookiesEnabled: string = this.unknownStringValue;
  osInfo: string = this.unknownStringValue;
  deviceMemory: string = this.unknownStringValue;
  deviceColorsForced: string = this.unknownStringValue;
  hardwareConcurrency: string = this.unknownStringValue;
  usingHDR: string = this.unknownStringValue;
  colorsInverted: string = this.unknownStringValue;
  languages: string = this.unknownStringValue;
  osCpu: string = this.unknownStringValue;
  platform: string = this.unknownStringValue;
  screenResolution: string = this.unknownStringValue;
  timezone: string = this.unknownStringValue;
  touchSupport: string = this.unknownStringValue;
  maxTouchPoints: string = this.unknownStringValue;
  private gpu: string = this.unknownStringValue;
  gpuVendor: string = this.unknownStringValue;
  gpuRenderer: string = this.unknownStringValue;
  private navigator?: Navigator;
  appName: string = this.unknownStringValue;
  appVersion: string = this.unknownStringValue;
  userAgent: string = this.unknownStringValue;
  pdfViewerEnabled: string = this.unknownStringValue;
  appCodeName: string = this.unknownStringValue;
  product: string = this.unknownStringValue;
  currentBrowserBuildNumber: string = this.unknownStringValue;
  screenFrame: string = this.unknownStringValue;
  connection: string = this.unknownStringValue;
  fonts: string = this.unknownStringValue;
  domBlockers: string = this.unknownStringValue;
  fontPreferences: string = this.unknownStringValue;
  audioFingerprint: string = this.unknownStringValue;
  sessionStorage: string = this.unknownStringValue;
  localStorage: string = this.unknownStringValue;
  indexedDB: string = this.unknownStringValue;
  openDatabase: string = this.unknownStringValue;
  cpuClass: string = this.unknownStringValue;
  plugins: string = this.unknownStringValue;
  canvas: string = this.unknownStringValue;
  vendorFlavors: string = this.unknownStringValue;
  monochromeDepth: string = this.unknownStringValue;
  motionReduced: string = this.unknownStringValue;
  math: string = this.unknownStringValue;
  architecture: string = this.unknownStringValue;
  constructor() {
    this.hash = x64hash128;

    const isScriptRunnedInBrowser = isBrowser();
    if (!isScriptRunnedInBrowser) return;

    this.screenColorDepth = paramToString(this.getColorDepth());
    this.colorGamut = paramToString(this.getColorGamut());
    this.contrastPreferences = paramToString(this.getContrastPreference());
    this.cookiesEnabled = paramToString(this.areCookiesEnabled());
    this.osInfo = paramToString(this.getOSInfo());
    this.deviceMemory = paramToString(this.getDeviceMemory());
    this.deviceColorsForced = paramToString(this.areColorsForced());
    this.hardwareConcurrency = paramToString(this.getHardwareConcurrency());
    this.usingHDR = paramToString(this.isHDR());
    this.colorsInverted = paramToString(this.areColorsInverted());
    this.languages = paramToString(this.getLanguages());
    this.osCpu = paramToString(this.getOsCpu());
    this.platform = paramToString(this.getPlatform());
    this.screenResolution = paramToString(this.getScreenResolution());
    this.timezone = paramToString(this.getTimezone());
    this.touchSupport = paramToString(JSON.stringify(this.getTouchSupport()));
    this.maxTouchPoints = paramToString(this.getTouchSupport().maxTouchPoints);
    this.gpu = paramToString(JSON.stringify(this.getVideoCardInfo()));
    this.gpuVendor = paramToString(this.getVideoCardInfo().vendor);
    this.gpuRenderer = paramToString(this.getVideoCardInfo().renderer);

    this.navigator = this.getNavigatorValues();
    this.appName = paramToString(navigator.appName);
    this.appVersion = paramToString(navigator.appVersion);
    this.userAgent = paramToString(navigator.userAgent);
    this.pdfViewerEnabled = paramToString(navigator.pdfViewerEnabled);
    this.appCodeName = paramToString(navigator.appCodeName);
    this.product = paramToString(navigator.product);
    this.currentBrowserBuildNumber = paramToString(navigator.productSub);
    this.connection = paramToString(JSON.stringify((navigator as any).connection));
    this.sessionStorage = paramToString(this.getSessionStorage());
    this.localStorage = paramToString(this.getLocalStorage());
    this.indexedDB = paramToString(this.getIndexedDB());
    this.openDatabase = paramToString(this.getOpenDatabase());
    this.cpuClass = paramToString(this.getCpuClass());
    this.plugins = paramToString(this.getPlugins());
    this.canvas = paramToString(this.getCanvasFingerprint());
    this.vendorFlavors = paramToString(this.getVendorFlavors());
    this.monochromeDepth = paramToString(this.getMonochromeDepth());
    this.motionReduced = paramToString(this.isMotionReduced());
    this.math = paramToString(this.getMathFingerprint());
    this.architecture = paramToString(this.getArchitecture());
  }

  async load() {
    try {
      const [fonts, domBlockers, fontPreferences, audioFingerprint, screenFrame] = await Promise.all([
        this.getFonts(),
        this.getDomBlockers(),
        this.getFontPreferences(),
        this.getAudioFingerprint(),
        this.getRoundedScreenFrame(),
      ]);
      this.fonts = paramToString(fonts);
      this.domBlockers = paramToString(domBlockers);
      this.fontPreferences = paramToString(fontPreferences);
      this.audioFingerprint = paramToString(audioFingerprint);
      this.screenFrame = paramToString(screenFrame);
      return this;
    } catch (err: any) {
      return this;
    }
  }

  createFingerprintHash(): Promise<string> {
    const nonHashedString = objectToCanonicalString(this.getMainParams());
    const hash = this.hash(nonHashedString);
    return hash;
  }

  getMainParams(): Record<string, string> {
    if (isNode()) return { environment: 'node-js' };
    return {
      gpuVendor: this.gpuVendor,
      gpuRenderer: this.gpuRenderer,
      timezone: this.timezone,
      product: this.product,
      appName: this.appName,
      appCodeName: this.appCodeName,
      platform: this.platform,
      deviceMemory: this.deviceMemory,
      maxTouchPoints: this.maxTouchPoints,
      osInfo: this.osInfo,
      osCpu: this.osCpu,
      hardwareConcurrency: this.hardwareConcurrency,
      screenFrame: this.screenFrame,
      screenColorDepth: this.screenColorDepth,
      colorGamut: this.colorGamut,
      currentBrowserBuildNumber: this.currentBrowserBuildNumber,
      appVersion: this.appVersion,
      fonts: this.fonts,
      domBlockers: this.domBlockers,
      fontPreferences: this.fontPreferences,
      screenResolution: this.screenResolution,
      contrastPreferences: this.contrastPreferences,
      cookiesEnabled: this.cookiesEnabled,
      languages: this.languages,
      userAgent: this.userAgent,
      pdfViewerEnabled: this.pdfViewerEnabled,
      deviceColorsForced: this.deviceColorsForced,
      usingHDR: this.usingHDR,
      colorsInverted: this.colorsInverted,
      connection: this.connection,
      audioFingerprint: this.audioFingerprint,
      sessionStorage: this.sessionStorage,
      localStorage: this.localStorage,
      indexedDB: this.indexedDB,
      openDatabase: this.openDatabase,
      cpuClass: this.cpuClass,
      plugins: this.plugins,
      canvas: this.canvas,
      vendorFlavors: this.vendorFlavors,
      monochromeDepth: this.monochromeDepth,
      motionReduced: this.motionReduced,
      math: this.math,
      architecture: this.architecture,
    };
  }

  private getArchitecture(): number {
    const f = new Float32Array(1);
    const u8 = new Uint8Array(f.buffer);
    f[0] = Infinity;
    f[0] = f[0] - f[0];

    return u8[3];
  }

  private getMathFingerprint(): Record<string, number> {
    const M = Math;
    const fallbackFn = () => 0;
    const acos = M.acos || fallbackFn;
    const acosh = M.acosh || fallbackFn;
    const asin = M.asin || fallbackFn;
    const asinh = M.asinh || fallbackFn;
    const atanh = M.atanh || fallbackFn;
    const atan = M.atan || fallbackFn;
    const sin = M.sin || fallbackFn;
    const sinh = M.sinh || fallbackFn;
    const cos = M.cos || fallbackFn;
    const cosh = M.cosh || fallbackFn;
    const tan = M.tan || fallbackFn;
    const tanh = M.tanh || fallbackFn;
    const exp = M.exp || fallbackFn;
    const expm1 = M.expm1 || fallbackFn;
    const log1p = M.log1p || fallbackFn;

    // Operation polyfills
    const powPI = (value: number) => M.pow(M.PI, value);
    const acoshPf = (value: number) => M.log(value + M.sqrt(value * value - 1));
    const asinhPf = (value: number) => M.log(value + M.sqrt(value * value + 1));
    const atanhPf = (value: number) => M.log((1 + value) / (1 - value)) / 2;
    const sinhPf = (value: number) => M.exp(value) - 1 / M.exp(value) / 2;
    const coshPf = (value: number) => (M.exp(value) + 1 / M.exp(value)) / 2;
    const expm1Pf = (value: number) => M.exp(value) - 1;
    const tanhPf = (value: number) => (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1);
    const log1pPf = (value: number) => M.log(1 + value);

    // Note: constant values are empirical
    return {
      acos: acos(0.123124234234234242),
      acosh: acosh(1e308),
      acoshPf: acoshPf(1e154), // 1e308 will not work for polyfill
      asin: asin(0.123124234234234242),
      asinh: asinh(1),
      asinhPf: asinhPf(1),
      atanh: atanh(0.5),
      atanhPf: atanhPf(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: sinhPf(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: coshPf(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: tanhPf(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: expm1Pf(1),
      log1p: log1p(10),
      log1pPf: log1pPf(10),
      powPI: powPI(-100),
    };
  }

  private getMonochromeDepth(): string | number | undefined {
    const maxValueToCheck = 100;
    if (!matchMedia('(min-monochrome: 0)').matches) {
      return undefined;
    }

    for (let i = 0; i <= maxValueToCheck; ++i) {
      if (matchMedia(`(max-monochrome: ${i})`).matches) {
        return i;
      }
    }

    return 'Too high value';
  }

  private getVendorFlavors(): string[] {
    const flavors: string[] = [];

    for (const key of vendorFlavorKeys) {
      const value = (window as unknown as Record<string, unknown>)[key];
      if (value && typeof value === 'object') {
        flavors.push(key);
      }
    }

    return flavors.sort();
  }

  private isMotionReduced(): boolean | undefined {
    const doesMatch = matchGenerator('prefers-reduced-motion');
    if (doesMatch('reduce')) {
      return true;
    }
    if (doesMatch('no-preference')) {
      return false;
    }
    return undefined;
  }

  private getCanvasFingerprint(): CanvasFingerprint {
    let winding = false;
    let geometry: string;
    let text: string;

    const [canvas, context] = makeCanvasContext();
    if (!isSupported(canvas, context)) {
      geometry = text = ''; // The value will be 'unsupported' in v3.4
    } else {
      winding = doesSupportWinding(context);

      renderTextImage(canvas, context);
      const textImage1 = canvasToString(canvas);
      const textImage2 = canvasToString(canvas); // It's slightly faster to double-encode the text image

      // Some browsers add a noise to the canvas: https://github.com/fingerprintjs/fingerprintjs/issues/791
      // The canvas is excluded from the fingerprint in this case
      if (textImage1 !== textImage2) {
        geometry = text = 'unstable';
      } else {
        text = textImage1;

        // Text is unstable:
        // https://github.com/fingerprintjs/fingerprintjs/issues/583
        // https://github.com/fingerprintjs/fingerprintjs/issues/103
        // Therefore it's extracted into a separate image.
        renderGeometryImage(canvas, context);
        geometry = canvasToString(canvas);
      }
    }

    return { winding, geometry, text };
  }

  private getFonts(): Promise<string[] | undefined> {
    try {
      // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
      // https://github.com/fingerprintjs/fingerprintjs/issues/592
      // https://github.com/fingerprintjs/fingerprintjs/issues/628
      return withIframe((_, { document }) => {
        const holder = document.body;
        holder.style.fontSize = textSizeForFontInfo;

        // div to load spans for the default fonts and the fonts to detect
        const spansContainer = document.createElement('div');

        const defaultWidth: Partial<Record<string, number>> = {};
        const defaultHeight: Partial<Record<string, number>> = {};

        // creates a span where the fonts will be loaded
        const createSpan = (fontFamily: string) => {
          const span = document.createElement('span');
          const { style } = span;
          style.position = 'absolute';
          style.top = '0';
          style.left = '0';
          style.fontFamily = fontFamily;
          span.textContent = testFontString;
          spansContainer.appendChild(span);
          return span;
        };

        // creates a span and load the font to detect and a base font for fallback
        const createSpanWithFonts = (fontToDetect: string, baseFont: string) => {
          return createSpan(`'${fontToDetect}',${baseFont}`);
        };

        // creates spans for the base fonts and adds them to baseFontsDiv
        const initializeBaseFontsSpans = () => {
          return baseFonts.map(createSpan);
        };

        // creates spans for the fonts to detect and adds them to fontsDiv
        const initializeFontsSpans = () => {
          // Stores {fontName : [spans for that font]}
          const spans: Record<string, HTMLSpanElement[]> = {};

          for (const font of fontList) {
            spans[font] = baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont));
          }

          return spans;
        };

        // checks if a font is available
        const isFontAvailable = (fontSpans: HTMLElement[]) => {
          return baseFonts.some(
            (baseFont, baseFontIndex) =>
              fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] || fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont],
          );
        };

        // create spans for base fonts
        const baseFontsSpans = initializeBaseFontsSpans();

        // create spans for fonts to detect
        const fontsSpans = initializeFontsSpans();

        // add all the spans to the DOM
        holder.appendChild(spansContainer);

        // get the default width for the three base fonts
        for (let index = 0; index < baseFonts.length; index++) {
          defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
          defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }

        // check available fonts
        return fontList.filter((font) => isFontAvailable(fontsSpans[font]));
      });
    } catch (err) {
      return new Promise(() => undefined);
    }
  }

  private getOpenDatabase(): boolean {
    return !!(window as any).openDatabase;
  }

  private getIndexedDB(): boolean | undefined {
    // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
    // visitor identifier in normal and private modes.
    if (isTrident() || isEdgeHTML()) {
      return undefined;
    }
    try {
      return !!window.indexedDB;
    } catch (e) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  private getSessionStorage(): boolean {
    try {
      return !!window.sessionStorage;
    } catch (error) {
      return true;
    }
  }

  private getLocalStorage(): boolean {
    try {
      return !!window.localStorage;
    } catch (e) {
      return true;
    }
  }

  private async getDomBlockers(): Promise<string[] | undefined> {
    try {
      if (!this.isDomBlockersApplicable()) {
        return undefined;
      }

      const filters = getFilters();
      const filterNames = Object.keys(filters) as Array<keyof typeof filters>;
      const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]));
      const blockedSelectors = await this.getBlockedSelectors(allSelectors);

      const activeBlockers = filterNames.filter((filterName) => {
        const selectors = filters[filterName];
        const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]));
        return blockedCount > selectors.length * 0.6;
      });
      activeBlockers.sort();

      return activeBlockers;
    } catch (err) {
      return new Promise(() => undefined);
    }
  }

  private isDomBlockersApplicable(): boolean {
    // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
    return isWebKit() || isAndroid();
  }

  private async getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<{ [K in T]?: true }> {
    const d = document;
    const root = d.createElement('div');
    const elements = new Array<HTMLElement>(selectors.length);
    const blockedSelectors: { [K in T]?: true } = {}; // Set() isn't used just in case somebody need older browser support

    this.forceShowSelector(root);

    // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
    // browser will alternate tree modification and layout reading, that is very slow.
    for (let i = 0; i < selectors.length; ++i) {
      const element = selectorToElement(selectors[i]);
      const holder = d.createElement('div'); // Protects from unwanted effects of `+` and `~` selectors of filters
      this.forceShowSelector(holder);
      holder.appendChild(element);
      root.appendChild(holder);
      elements[i] = element;
    }

    // document.body can be null while the page is loading
    while (!d.body) {
      await wait(50);
    }
    d.body.appendChild(root);

    try {
      // Then check which of the elements are blocked
      for (let i = 0; i < selectors.length; ++i) {
        if (!elements[i].offsetParent) {
          blockedSelectors[selectors[i]] = true;
        }
      }
    } finally {
      // Then remove the elements
      root.parentNode?.removeChild(root);
    }

    return blockedSelectors;
  }

  private forceShowSelector(element: HTMLElement) {
    element.style.setProperty('display', 'block', 'important');
  }

  private async getFontPreferences(): Promise<Record<string, number> | undefined> {
    try {
      return this.withNaturalFonts((document, container) => {
        const elements: Record<string, HTMLElement> = {};
        const sizes: Record<string, number> = {};

        // First create all elements to measure. If the DOM steps below are done in a single cycle,
        // browser will alternate tree modification and layout reading, that is very slow.
        for (const key of Object.keys(fontsPreferencesPresets)) {
          const [style = {}, text = defaultPresetText] = fontsPreferencesPresets[key];

          const element = document.createElement('span');
          element.textContent = text;
          element.style.whiteSpace = 'nowrap';

          for (const name of Object.keys(style) as Array<keyof typeof style>) {
            const value = style[name];
            if (value !== undefined) {
              element.style[name] = value;
            }
          }

          elements[key] = element;
          container.appendChild(document.createElement('br'));
          container.appendChild(element);
        }

        // Then measure the created elements
        for (const key of Object.keys(fontsPreferencesPresets)) {
          sizes[key] = elements[key].getBoundingClientRect().width;
        }

        return sizes;
      });
    } catch (err) {
      return new Promise(() => undefined);
    }
  }

  /**
   * Creates a DOM environment that provides the most natural font available, including Android OS font.
   * Measurements of the elements are zoom-independent.
   * Don't put a content to measure inside an absolutely positioned element.
   */
  private async withNaturalFonts<T>(action: (document: Document, container: HTMLElement) => MaybePromise<T>, containerWidthPx = 4000): Promise<T> {
    /*
     * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
     * - The iframe mustn't have a `display: none;` style;
     * - The text mustn't be positioned absolutely;
     * - The text block must be wide enough.
     *   2560px on some devices in portrait orientation for the biggest font size option (32px);
     * - There must be much enough text to form a few lines (I don't know the exact numbers);
     * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
     *
     * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
     * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
     *   The only way to set it is to use the `srcdoc` attribute of the iframe;
     * - The iframe content must get loaded before adding extra content with JavaScript;
     *
     * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
     *
     * Observations on how page zoom affects the measurements:
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
     * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
     * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
     * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - iOS Safari 14.0: offsetWidth = 100% reliable;
     * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
     * - Chrome 87: offsetWidth = 1px fluctuation;
     * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
     * - Firefox 48, 51: offsetWidth = 10% fluctuation;
     * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
     *   fluctuation;
     * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
     * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
     *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
     *   fluctuate;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
     * - IE 11, Edge 18: offsetWidth = 100% reliable;
     * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
     */
    return withIframe((_, iframeWindow) => {
      const iframeDocument = iframeWindow.document;
      const iframeBody = iframeDocument.body;

      const bodyStyle = iframeBody.style;
      bodyStyle.width = `${containerWidthPx}px`;
      // @ts-ignore
      bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = 'none';

      if (isChromium()) {
        // @ts-ignore
        iframeBody.style.zoom = `${1 / iframeWindow.devicePixelRatio}`;
      } else if (isWebKit()) {
        // @ts-ignore
        iframeBody.style.zoom = 'reset';
      }

      const linesOfText = iframeDocument.createElement('div');
      linesOfText.textContent = [...Array((containerWidthPx / 20) << 0)].map(() => 'word').join(' ');
      iframeBody.appendChild(linesOfText);

      return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  private async getAudioFingerprint(): Promise<number> {
    try {
      const w = window;
      const AudioContext = w.OfflineAudioContext || (w as any).webkitOfflineAudioContext;
      if (!AudioContext) {
        return SpecialFingerprint.NotSupported;
      }

      // In some browsers, audio context always stays suspended unless the context is started in response to a user action
      // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
      // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
      // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
      if (this.doesCurrentBrowserSuspendAudioContext()) {
        return SpecialFingerprint.KnownToSuspend;
      }

      const hashFromIndex = 4500;
      const hashToIndex = 5000;
      const context = new AudioContext(1, hashToIndex, 44100);

      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0;
      compressor.release.value = 0.25;

      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);

      const [renderPromise, finishRendering] = this.startRenderingAudio(context);
      const fingerprintPromise = renderPromise.then(
        (buffer) => this.getAudioHash(buffer.getChannelData(0).subarray(hashFromIndex)),
        (error) => {
          if (error.name === InnerErrorName.Timeout || error.name === InnerErrorName.Suspended) {
            return SpecialFingerprint.Timeout;
          }
          throw error;
        },
      );

      suppressUnhandledRejectionWarning(fingerprintPromise);

      await finishRendering();
      return fingerprintPromise;
    } catch (err) {
      return new Promise(() => undefined);
    }
  }

  private startRenderingAudio(context: OfflineAudioContext) {
    const renderTryMaxCount = 3;
    const renderRetryDelay = 500;
    const runningMaxAwaitTime = 500;
    const runningSufficientTime = 5000;
    let finalize = () => undefined as void;

    const resultPromise = new Promise<AudioBuffer>((resolve, reject) => {
      let isFinalized = false;
      let renderTryCount = 0;
      let startedRunningAt = 0;

      context.oncomplete = (event) => resolve(event.renderedBuffer);

      const startRunningTimeout = () => {
        setTimeout(
          () => reject(this.makeInnerError(InnerErrorName.Timeout)),
          Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()),
        );
      };

      const tryRender = () => {
        try {
          context.startRendering();

          switch (context.state) {
            case 'running':
              startedRunningAt = Date.now();
              if (isFinalized) {
                startRunningTimeout();
              }
              break;

            // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
            // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
            // background on iPhone. Retries usually help in this case.
            case 'suspended':
              // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
              // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
              // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
              // can be suspended when `document.hidden === false` and start running after a retry.
              if (!document.hidden) {
                renderTryCount++;
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(this.makeInnerError(InnerErrorName.Suspended));
              } else {
                setTimeout(tryRender, renderRetryDelay);
              }
              break;
          }
        } catch (error) {
          reject(error);
        }
      };

      tryRender();

      finalize = () => {
        if (!isFinalized) {
          isFinalized = true;
          if (startedRunningAt > 0) {
            startRunningTimeout();
          }
        }
      };
    });

    return [resultPromise, finalize] as const;
  }

  private getAudioHash(signal: ArrayLike<number>): number {
    let hash = 0;
    for (let i = 0; i < signal.length; ++i) {
      hash += Math.abs(signal[i]);
    }
    return hash;
  }

  private makeInnerError(name: InnerErrorName) {
    const error = new Error(name);
    error.name = name;
    return error;
  }

  private doesCurrentBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer();
  }

  private getVideoCardInfo(): IGetVideoCardInfo {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl)
      return {
        error: 'No webgl',
      };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo
      ? {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        }
      : {
          error: 'No WEBGL_debug_renderer_info',
        };
  }

  private getColorDepth(): number {
    return window.screen.colorDepth;
  }

  private getColorGamut(): string | undefined {
    // rec2020 includes p3 and p3 includes srgb
    for (const gamut of ['rec2020', 'p3', 'srgb']) {
      if (matchMedia(`(color-gamut: ${gamut})`).matches) {
        return gamut;
      }
    }
    return undefined;
  }

  private getContrastPreference(): number | undefined {
    const doesMatch = matchGenerator('prefers-contrast');

    if (doesMatch('no-preference')) {
      return ContrastPreference.None;
    }
    if (doesMatch('high') || doesMatch('more')) {
      return ContrastPreference.More;
    }
    if (doesMatch('low') || doesMatch('less')) {
      return ContrastPreference.Less;
    }
    if (doesMatch('forced')) {
      return ContrastPreference.ForcedColors;
    }
    return undefined;
  }

  private areCookiesEnabled(): boolean {
    // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
    // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
    // with site-specific exceptions. Don't rely on it.
    try {
      // Create cookie
      document.cookie = 'cookietest=1; SameSite=Strict;';
      const result = document.cookie.indexOf('cookietest=') !== -1;
      // Delete cookie
      document.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return result;
    } catch (e) {
      return false;
    }
  }

  private getOSInfo(): string {
    const arch = navigator.userAgent.match(/x86_64|Win64|WOW64/) || (navigator as any).cpuClass === 'x64' ? 'x64' : 'x86';
    return arch;
  }

  private getCpuClass(): string | undefined {
    return (navigator as any).cpuClass;
  }

  private getNavigatorValues(): Navigator {
    return navigator;
  }

  private getDeviceMemory(): number | undefined {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return replaceNaN(toFloat((navigator as any).deviceMemory), undefined);
  }

  private areColorsForced(): boolean | undefined {
    const doesMatch = matchGenerator('forced-colors');
    if (doesMatch('active')) {
      return true;
    }
    if (doesMatch('none')) {
      return false;
    }
    return undefined;
  }

  private getHardwareConcurrency(): number | undefined {
    // sometimes hardware concurrency is a string
    return replaceNaN(toInt(navigator.hardwareConcurrency), undefined);
  }

  private isHDR(): boolean | undefined {
    const doesMatch = matchGenerator('dynamic-range');
    if (doesMatch('high')) {
      return true;
    }
    if (doesMatch('standard')) {
      return false;
    }
    return undefined;
  }

  private areColorsInverted(): boolean | undefined {
    const doesMatch = matchGenerator('inverted-colors');
    if (doesMatch('inverted')) {
      return true;
    }
    if (doesMatch('none')) {
      return false;
    }
    return undefined;
  }

  private getLanguages(): Array<Array<string>> {
    const n = navigator;
    const result = [];

    const language = n.language;
    if (language !== undefined) {
      result.push([language]);
    }

    if (Array.isArray(n.languages)) {
      // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
      // the value of `navigator.language`. Therefore, the value is ignored in this browser.
      if (!(isChromium() && isChromium86OrNewer())) {
        result.push(n.languages);
      }
    } else if (typeof n.languages === 'string') {
      const languages: string = n.languages;
      if (languages) {
        result.push(languages.split(','));
      }
    }

    return result;
  }

  private getOsCpu(): string | undefined {
    return (navigator as any).oscpu;
  }

  private getPlatform(): string {
    // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
    const { platform } = navigator;

    // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
    // iPad uses desktop mode by default since iOS 13
    // The value is 'MacIntel' on M1 Macs
    // The value is 'iPhone' on iPod Touch
    if (platform === 'MacIntel') {
      if (isWebKit() && !isDesktopSafari()) {
        return isIPad() ? 'iPad' : 'iPhone';
      }
    }

    return platform;
  }

  private getPlugins(): string | undefined {
    const rawPlugins = navigator.plugins;

    if (!rawPlugins) {
      return undefined;
    }

    const plugins: PluginData[] = [];

    // Safari 10 doesn't support iterating navigator.plugins with for...of
    for (let i = 0; i < rawPlugins.length; ++i) {
      const plugin = rawPlugins[i];
      if (!plugin) {
        continue;
      }

      const mimeTypes: PluginMimeTypeData[] = [];
      for (let j = 0; j < plugin.length; ++j) {
        const mimeType = plugin[j];
        mimeTypes.push({
          type: mimeType.type,
          suffixes: mimeType.suffixes,
        });
      }

      plugins.push({
        name: plugin.name,
        description: plugin.description,
        mimeTypes,
      });
    }

    return JSON.stringify(plugins);
  }

  private screenFrameBackup?: FrameSize;
  private screenFrameSizeTimeoutId?: any;
  private screenFrameCheckInterval = 2500;

  private async watchScreenFrame(): Promise<FrameSize | undefined> {
    if (this.screenFrameSizeTimeoutId !== undefined) {
      return undefined;
    }
    const checkScreenFrame = async (): Promise<FrameSize> => {
      return new Promise((resolve, reject) => {
        const frameSize: FrameSize = this.getCurrentScreenFrame();
        if (this.isFrameSizeNull(frameSize)) {
          this.screenFrameSizeTimeoutId = setTimeout(async () => {
            const result: FrameSize = await checkScreenFrame();
            resolve(result);
          }, this.screenFrameCheckInterval);
        } else {
          this.screenFrameBackup = frameSize;
          this.screenFrameSizeTimeoutId = undefined;
          resolve(frameSize);
        }
      });
    };
    return checkScreenFrame();
  }

  private async getScreenFrame(): Promise<() => Promise<FrameSize>> {
    await this.watchScreenFrame();

    return async (): Promise<FrameSize> => {
      let frameSize = this.getCurrentScreenFrame();

      if (this.isFrameSizeNull(frameSize)) {
        if (this.screenFrameBackup) {
          return [...this.screenFrameBackup];
        }

        if (getFullscreenElement()) {
          // Some browsers set the screen frame to zero when programmatic fullscreen is on.
          // There is a chance of getting a non-zero frame after exiting the fullscreen.
          // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
          await exitFullscreen();
          frameSize = this.getCurrentScreenFrame();
        }
      }

      if (!this.isFrameSizeNull(frameSize)) {
        this.screenFrameBackup = frameSize;
      }

      return frameSize;
    };
  }

  private async getRoundedScreenFrame(): Promise<FrameSize> {
    const screenFrameGetter = await this.getScreenFrame();

    const frameSize = await screenFrameGetter();
    const roundingPrecision = 10;
    const processSize = (sideSize: FrameSize[number]) => (sideSize === null ? null : round(sideSize, roundingPrecision));

    // It might look like I don't know about `for` and `map`.
    // In fact, such code is used to avoid TypeScript issues without using `as`.
    return [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])];
  }

  private getCurrentScreenFrame(): FrameSize {
    const s = screen;

    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
      replaceNaN(toFloat((s as any).availTop), null),
      replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat((s as any).availLeft), 0), null),
      replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat((s as any).availTop), 0), null),
      replaceNaN(toFloat((s as any).availLeft), null),
    ];
  }

  private isFrameSizeNull(frameSize: any[]): boolean {
    for (let i = 0; i < 4; ++i) {
      if (frameSize[i]) {
        return false;
      }
    }
    return true;
  }

  private getScreenResolution(): Array<number> {
    const s = screen;

    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    // Some browsers even return  screen resolution as not numbers.
    const parseDimension = (value: any) => replaceNaN(toInt(value), null);
    const dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
  }

  private getTimezoneOffset(): number {
    const currentYear = new Date().getFullYear();
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
      // `getTimezoneOffset` returns a number as a string in some unidentified cases
      toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
    );
  }

  private getTimezone(): string {
    const DateTimeFormat = window.Intl?.DateTimeFormat;
    if (DateTimeFormat) {
      const timezone = new DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }

    // For browsers that don't support timezone names
    // The minus is intentional because the JS offset is opposite to the real offset
    const offset = -this.getTimezoneOffset();
    return `UTC${offset >= 0 ? '+' : ''}${Math.abs(offset)}`;
  }

  private getTouchSupport(): IGetTouchSupport {
    const n = navigator;

    let maxTouchPoints = 0;
    let touchEvent;
    if (n.maxTouchPoints !== undefined) {
      maxTouchPoints = toInt(n.maxTouchPoints);
    } else if ((n as any).msMaxTouchPoints !== undefined) {
      maxTouchPoints = (n as any).msMaxTouchPoints;
    }
    try {
      document.createEvent('TouchEvent');
      touchEvent = true;
    } catch {
      touchEvent = false;
    }
    const touchStart = 'ontouchstart' in window;
    return {
      maxTouchPoints,
      touchEvent,
      touchStart,
    };
  }
}
