import { selectorToElement, withIframe } from './utils/dom';
import { x64hash128 } from './utils/hashing';
import { getFilters } from './utils/dom-blockers';
import { MaybePromise, suppressUnhandledRejectionWarning, wait } from './utils/async';
import { ContrastPreference, IGetTouchSupport, IGetVideoCardInfo, InnerErrorName, Preset, SpecialFingerprint } from './types';

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){return false;}');

export class Device {
  private hash: Function;
  private unknownStringValue = 'unknown';
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
  constructor() {
    this.hash = x64hash128;

    const isScriptRunnedInBrowser = isBrowser();
    if (!isScriptRunnedInBrowser) return;
    this.watchScreenFrame();

    this.screenColorDepth = this.paramToString(this.getColorDepth());
    this.colorGamut = this.paramToString(this.getColorGamut());
    this.contrastPreferences = this.paramToString(this.getContrastPreference());
    this.cookiesEnabled = this.paramToString(this.areCookiesEnabled());
    this.osInfo = this.paramToString(this.getOSInfo());
    this.deviceMemory = this.paramToString(this.getDeviceMemory());
    this.deviceColorsForced = this.paramToString(this.areColorsForced());
    this.hardwareConcurrency = this.paramToString(this.getHardwareConcurrency());
    this.usingHDR = this.paramToString(this.isHDR());
    this.colorsInverted = this.paramToString(this.areColorsInverted());
    this.languages = this.paramToString(this.getLanguages());
    this.osCpu = this.paramToString(this.getOsCpu());
    this.platform = this.paramToString(this.getPlatform());
    this.screenResolution = this.paramToString(this.getScreenResolution());
    this.timezone = this.paramToString(this.getTimezone());
    this.touchSupport = this.paramToString(JSON.stringify(this.getTouchSupport()));
    this.maxTouchPoints = this.paramToString(this.getTouchSupport().maxTouchPoints);
    this.gpu = this.paramToString(JSON.stringify(this.getVideoCardInfo()));
    this.gpuVendor = this.paramToString(this.getVideoCardInfo().vendor);
    this.gpuRenderer = this.paramToString(this.getVideoCardInfo().renderer);

    this.navigator = this.getNavigatorValues();
    this.appName = this.paramToString(navigator.appName);
    this.appVersion = this.paramToString(navigator.appVersion);
    this.userAgent = this.paramToString(navigator.userAgent);
    this.pdfViewerEnabled = this.paramToString(navigator.pdfViewerEnabled);
    this.appCodeName = this.paramToString(navigator.appCodeName);
    this.product = this.paramToString(navigator.product);
    this.currentBrowserBuildNumber = this.paramToString(navigator.productSub);
    this.screenFrame = this.paramToString(this.screenFrameBackup);
    this.connection = this.paramToString(JSON.stringify((navigator as any).connection));
  }

  async load() {
    this.fonts = await this.getFonts();
    this.domBlockers = await this.getDomBlockers();
    this.fontPreferences = await this.getFontPreferences();
    this.audioFingerprint = this.paramToString(await this.getAudioFingerprint());
    return this;
  }

  createFingerprintHash(): Promise<string> {
    const nonHashedString = this.objectToCanonicalString(this.getMainParams());
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
    };
  }

  private paramToString(value: any): string {
    if (typeof value === 'undefined') return this.unknownStringValue;
    if (typeof value === 'string') return value;
    return value.toString();
  }

  private objectToCanonicalString(object: Record<string, string>): string {
    let result = '';
    for (const objectKey of Object.keys(object).sort()) {
      const component = object[objectKey];
      result += `${result ? '|' : ''}${objectKey.replace(/([:|\\])/g, '\\$1')}:${component}`;
    }
    return result;
  }

  private textSizeForTest = '48px';
  // M or w because these two characters take up the maximum width
  // And use a LLi so that the same matching fonts can get separated
  private testString = 'mmMwWLliI0O&1';
  private baseFonts = ['monospace', 'sans-serif', 'serif'] as const;
  private fontList = [
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
  private getFonts(): Promise<string> {
    // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
    // https://github.com/fingerprintjs/fingerprintjs/issues/592
    // https://github.com/fingerprintjs/fingerprintjs/issues/628
    return withIframe((_, { document }) => {
      const holder = document.body;
      holder.style.fontSize = this.textSizeForTest;

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
        span.textContent = this.testString;
        spansContainer.appendChild(span);
        return span;
      };

      // creates a span and load the font to detect and a base font for fallback
      const createSpanWithFonts = (fontToDetect: string, baseFont: string) => {
        return createSpan(`'${fontToDetect}',${baseFont}`);
      };

      // creates spans for the base fonts and adds them to baseFontsDiv
      const initializeBaseFontsSpans = () => {
        return this.baseFonts.map(createSpan);
      };

      // creates spans for the fonts to detect and adds them to fontsDiv
      const initializeFontsSpans = () => {
        // Stores {fontName : [spans for that font]}
        const spans: Record<string, HTMLSpanElement[]> = {};

        for (const font of this.fontList) {
          spans[font] = this.baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont));
        }

        return spans;
      };

      // checks if a font is available
      const isFontAvailable = (fontSpans: HTMLElement[]) => {
        return this.baseFonts.some(
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
      for (let index = 0; index < this.baseFonts.length; index++) {
        defaultWidth[this.baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
        defaultHeight[this.baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
      }

      // check available fonts
      return JSON.stringify(this.fontList.filter((font) => isFontAvailable(fontsSpans[font])));
    });
  }

  async getDomBlockers(): Promise<string> {
    if (!this.isApplicable()) {
      return this.unknownStringValue;
    }

    const filters = getFilters();
    const filterNames = Object.keys(filters) as Array<keyof typeof filters>;
    const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]));
    const blockedSelectors = await this.getBlockedSelectors(allSelectors);

    const activeBlockers = filterNames.filter((filterName) => {
      const selectors = filters[filterName];
      const blockedCount = this.countTruthy(selectors.map((selector) => blockedSelectors[selector]));
      return blockedCount > selectors.length * 0.6;
    });
    activeBlockers.sort();

    return JSON.stringify(activeBlockers);
  }

  private isApplicable(): boolean {
    // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
    return this.isWebKit() || this.isAndroid();
  }

  private async getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<{ [K in T]?: true }> {
    const d = document;
    const root = d.createElement('div');
    const elements = new Array<HTMLElement>(selectors.length);
    const blockedSelectors: { [K in T]?: true } = {}; // Set() isn't used just in case somebody need older browser support

    this.forceShow(root);

    // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
    // browser will alternate tree modification and layout reading, that is very slow.
    for (let i = 0; i < selectors.length; ++i) {
      const element = selectorToElement(selectors[i]);
      const holder = d.createElement('div'); // Protects from unwanted effects of `+` and `~` selectors of filters
      this.forceShow(holder);
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

  private forceShow(element: HTMLElement) {
    element.style.setProperty('display', 'block', 'important');
  }

  private fontsPresets: Record<string, Preset> = {
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
  private defaultPresetText = 'mmMwWLliI0fiflO&1';
  private async getFontPreferences(): Promise<string> {
    return this.withNaturalFonts((document, container) => {
      const elements: Record<string, HTMLElement> = {};
      const sizes: Record<string, number> = {};

      // First create all elements to measure. If the DOM steps below are done in a single cycle,
      // browser will alternate tree modification and layout reading, that is very slow.
      for (const key of Object.keys(this.fontsPresets)) {
        const [style = {}, text = this.defaultPresetText] = this.fontsPresets[key];

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
      for (const key of Object.keys(this.fontsPresets)) {
        sizes[key] = elements[key].getBoundingClientRect().width;
      }

      return JSON.stringify(sizes);
    });
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

      if (this.isChromium()) {
        // @ts-ignore
        iframeBody.style.zoom = `${1 / iframeWindow.devicePixelRatio}`;
      } else if (this.isWebKit()) {
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
      (buffer) => this.getHash(buffer.getChannelData(0).subarray(hashFromIndex)),
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

  private getHash(signal: ArrayLike<number>): number {
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
    return this.isWebKit() && !this.isDesktopSafari() && !this.isWebKit606OrNewer();
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
    const doesMatch = (value: string) => {
      return matchMedia(`(prefers-contrast: ${value})`).matches;
    };
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

  private getNavigatorValues(): Navigator {
    return navigator;
  }

  private getDeviceMemory(): number | undefined {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return this.replaceNaN(this.toFloat((navigator as any).deviceMemory), undefined);
  }

  private toFloat(value: number | string): number {
    if (typeof value === 'number') return value;
    return parseFloat(value);
  }

  private replaceNaN(value: any, replacement: any) {
    return typeof value === 'number' && isNaN(value) ? replacement : value;
  }

  private areColorsForced(): boolean | undefined {
    const doesMatch = (value: string) => {
      return matchMedia(`(forced-colors: ${value})`).matches;
    };
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
    return this.replaceNaN(this.toInt(navigator.hardwareConcurrency), undefined);
  }

  private toInt(value: number | string): number {
    if (typeof value === 'number') return value;
    return parseInt(value);
  }

  private isHDR(): boolean | undefined {
    const doesMatch = (value: string) => {
      return matchMedia(`(dynamic-range: ${value})`).matches;
    };
    if (doesMatch('high')) {
      return true;
    }
    if (doesMatch('standard')) {
      return false;
    }
    return undefined;
  }

  private areColorsInverted(): boolean | undefined {
    const doesMatch = (value: string) => {
      return matchMedia(`(inverted-colors: ${value})`).matches;
    };
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
      if (!(this.isChromium() && this.isChromium86OrNewer())) {
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

  private isChromium(): boolean {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    const w = window;
    const n = navigator;

    return (
      this.countTruthy([
        'webkitPersistentStorage' in n,
        'webkitTemporaryStorage' in n,
        n.vendor.indexOf('Google') === 0,
        'webkitResolveLocalFileSystemURL' in w,
        'BatteryManager' in w,
        'webkitMediaStream' in w,
        'webkitSpeechGrammar' in w,
      ]) >= 5
    );
  }

  private isChromium86OrNewer(): boolean {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    const w = window;

    return (
      this.countTruthy([!('MediaSettingsRange' in w), 'RTCEncodedAudioFrame' in w, '' + w.Intl === '[object Intl]', '' + w.Reflect === '[object Reflect]']) >= 3
    );
  }

  private countTruthy(values: any): number {
    return values.reduce((sum: number, value: any) => sum + (value ? 1 : 0), 0);
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
      if (this.isWebKit() && !this.isDesktopSafari()) {
        return this.isIPad() ? 'iPad' : 'iPhone';
      }
    }

    return platform;
  }

  private isAndroid(): boolean {
    const isItChromium = this.isChromium();
    const isItGecko = this.isGecko();

    // Only 2 browser engines are presented on Android.
    // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
    if (!isItChromium && !isItGecko) {
      return false;
    }

    const w = window;

    // Chrome removes all words "Android" from `navigator` when desktop version is requested
    // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
    return (
      this.countTruthy([
        'onorientationchange' in w,
        'orientation' in w,
        isItChromium && !('SharedWorker' in w),
        isItGecko && /android/i.test(navigator.appVersion),
      ]) >= 2
    );
  }

  private isGecko(): boolean {
    const w = window;

    // Based on research in September 2020
    return (
      this.countTruthy([
        'buildID' in navigator,
        'MozAppearance' in (document.documentElement?.style ?? {}),
        'onmozfullscreenchange' in w,
        'mozInnerScreenX' in w,
        'CSSMozDocumentRule' in w,
        'CanvasCaptureMediaStream' in w,
      ]) >= 4
    );
  }

  private isWebKit(): boolean {
    // Based on research in September 2020
    const w = window;
    const n = navigator;

    return (
      this.countTruthy([
        'ApplePayError' in w,
        'CSSPrimitiveValue' in w,
        'Counter' in w,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w,
      ]) >= 4
    );
  }

  private isWebKit606OrNewer(): boolean {
    // Checked in Safari 9–14
    const w = window;

    return this.countTruthy(['DOMRectList' in w, 'RTCPeerConnectionIceEvent' in w, 'SVGGeometryElement' in w, 'ontransitioncancel' in w]) >= 3;
  }

  private isDesktopSafari(): boolean {
    const w = window;

    return (
      this.countTruthy([
        'safari' in w, // Always false in Karma and BrowserStack Automate
        !('DeviceMotionEvent' in w),
        !('ongestureend' in w),
        !('standalone' in navigator),
      ]) >= 3
    );
  }

  private isIPad(): boolean {
    // Checked on:
    // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
    // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
    // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14

    // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
    if (navigator.platform === 'iPad') {
      return true;
    }

    const s = screen;
    const screenRatio = s.width / s.height;

    return (
      this.countTruthy([
        'MediaSource' in window, // Since iOS 13
        // @ts-ignore
        !!Element.prototype.webkitRequestFullscreen, // Since iOS 12
        // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
        screenRatio > 0.65 && screenRatio < 1.53,
      ]) >= 2
    );
  }

  private screenFrameBackup?: any[];
  private screenFrameSizeTimeoutId?: any;
  private screenFrameCheckInterval = 2500;

  private watchScreenFrame(): void {
    if (this.screenFrameSizeTimeoutId !== undefined) {
      return;
    }
    const checkScreenFrame = () => {
      const frameSize = this.getCurrentScreenFrame();
      if (this.isFrameSizeNull(frameSize)) {
        this.screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, this.screenFrameCheckInterval);
      } else {
        this.screenFrameBackup = frameSize;
        this.screenFrameSizeTimeoutId = undefined;
      }
    };
    checkScreenFrame();
  }

  private getCurrentScreenFrame(): Array<number> {
    const s = screen;

    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
      this.replaceNaN(this.toFloat((s as any).availTop), null),
      this.replaceNaN(this.toFloat(s.width) - this.toFloat(s.availWidth) - this.replaceNaN(this.toFloat((s as any).availLeft), 0), null),
      this.replaceNaN(this.toFloat(s.height) - this.toFloat(s.availHeight) - this.replaceNaN(this.toFloat((s as any).availTop), 0), null),
      this.replaceNaN(this.toFloat((s as any).availLeft), null),
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
    const parseDimension = (value: any) => this.replaceNaN(this.toInt(value), null);
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
      this.toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      this.toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
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
      maxTouchPoints = this.toInt(n.maxTouchPoints);
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
