import CryptoJS from "crypto-js";

interface IGetVideoCardInfo {
  vendor?: string;
  renderer?: string;
  error?: string;
}
interface IGetTouchSupport {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
}
enum ContrastPreference {
  Less = -1,
  None = 0,
  More = 1,
  ForcedColors = 10,
}

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){return false;}');

export class Device {
  private crypto: any;
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
  constructor() {
    this.crypto = CryptoJS;

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

  createFingerprintHash(includeChangeableVariables: boolean = false): string {
    const hashObject = JSON.stringify(includeChangeableVariables ? { ...this.getConstants(), ...this.getChangedParams() } : { ...this.getConstants() });
    const hash = this.crypto.MD5(hashObject);
    return hash;
  }

  getConstants(): Record<string, string> {
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
    };
  }

  getChangedParams(): Record<string, string> {
    if (isNode()) return { environment: 'node-js' };
    return {
      screenResolution: this.screenResolution,
      currentBrowserBuildNumber: this.currentBrowserBuildNumber,
      contrastPreferences: this.contrastPreferences,
      cookiesEnabled: this.cookiesEnabled,
      languages: this.languages,
      userAgent: this.userAgent,
      pdfViewerEnabled: this.pdfViewerEnabled,
      deviceColorsForced: this.deviceColorsForced,
      usingHDR: this.usingHDR,
      colorsInverted: this.colorsInverted,
      appVersion: this.appVersion,
      connection: this.connection,
    };
  }

  private paramToString(value: any): string {
    if (typeof value === 'undefined') return this.unknownStringValue;
    if (typeof value === 'string') return value;
    return value.toString();
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
