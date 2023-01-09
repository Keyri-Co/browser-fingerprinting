class Device {
  screenColorDepth;
  colorGamut;
  contrastPreferences;
  cookiesEnabled;
  osInfo;
  deviceMemory;
  deviceColorsForced;
  hardwareConcurrency;
  usingHDR;
  colorsInverted;
  languages;
  osCpu;
  platform;
  screenResolution;
  timezone;
  touchSupport;
  gpu;
  navigator;
  appName;
  appVersion;
  userAgent;
  pdfViewerEnabled;
  appCodeName;
  product;
  currentBrowserBuildNumber;
  screenFrame;
  connection;
  constructor() {
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
    this.gpu = this.paramToString(JSON.stringify(this.getVideoCardInfo()));

    this.navigator = this.getNavigatorValues();
    this.appName = this.paramToString(navigator.appName);
    this.appVersion = this.paramToString(navigator.appVersion);
    this.userAgent = this.paramToString(navigator.userAgent);
    this.pdfViewerEnabled = this.paramToString(navigator.pdfViewerEnabled);
    this.appCodeName = this.paramToString(navigator.appCodeName);
    this.product = this.paramToString(navigator.product);
    this.currentBrowserBuildNumber = this.paramToString(navigator.productSub);
    this.screenFrame = this.paramToString(this.screenFrameBackup);
    this.connection = this.paramToString(JSON.stringify(navigator.connection));
  }

  getConstants() {
    return {
        gpu: this.gpu,
        timezone: this.timezone,
        product: this.product,
        appName: this.appName,
        appCodeName: this.appCodeName,
        platform: this.platform,
        deviceMemory: this.deviceMemory,
        touchSupport: this.touchSupport,
        osInfo: this.osInfo,
        osCpu: this.osCpu,
        hardwareConcurrency: this.hardwareConcurrency,
        screenFrame: this.screenFrame,
        screenColorDepth: this.screenColorDepth,
        colorGamut: this.colorGamut,
      };
  }

  getChangedParams () {
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
     }
  }

  paramToString (value) {
    if (typeof value === 'undefined') return 'unknown';
    if (typeof value === 'string') return value;
    return value.toString();
  }

  getVideoCardInfo () {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) {
      return {
        error: "no webgl",
      };
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    } : {
      error: "no WEBGL_debug_renderer_info",
    };
  }

  getColorDepth () {
    return window.screen.colorDepth
  }

  getColorGamut () {
    // rec2020 includes p3 and p3 includes srgb
    for (const gamut of ['rec2020', 'p3', 'srgb']) {
      if (matchMedia(`(color-gamut: ${gamut})`).matches) {
        return gamut;
      }
    }
    return undefined;
  }

  getContrastPreference () {
    const ContrastPreference = {
      Less: -1,
      None: 0,
      More: 1,
      ForcedColors: 10,
    }
    const doesMatch = (value) => {
      return matchMedia(`(prefers-contrast: ${value})`).matches
    }
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

  areCookiesEnabled () {
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

  getOSInfo () {
    const arch = navigator.userAgent.match(/x86_64|Win64|WOW64/) ||
    navigator.cpuClass === 'x64' ? 'x64' : 'x86'
    return arch;
  }

  getNavigatorValues () {
    return navigator;
  }

  getDeviceMemory () {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return this.replaceNaN(this.toFloat(navigator.deviceMemory), undefined);
  }

  toFloat (value) {
    return parseFloat(value);
  }

  replaceNaN (value, replacement) {
    return typeof value === 'number' && isNaN(value) ? replacement : value;
  }

  areColorsForced () {
    const doesMatch = (value) => {
      return matchMedia(`(forced-colors: ${value})`).matches;
    }
    if (doesMatch('active')) {
      return true;
    }
    if (doesMatch('none')) {
      return false;
    }
    return undefined;
  }

  getHardwareConcurrency () {
    // sometimes hardware concurrency is a string
    return this.replaceNaN(this.toInt(navigator.hardwareConcurrency), undefined)
  }

  toInt (value) {
    return parseInt(value);
  }

  isHDR () {
    const doesMatch = (value) => {
      return matchMedia(`(dynamic-range: ${value})`).matches;
    }
    if (doesMatch('high')) {
      return true;
    }
    if (doesMatch('standard')) {
      return false;
    }
    return undefined;
  }

  areColorsInverted () {
    const doesMatch = (value) => {
      return matchMedia(`(inverted-colors: ${value})`).matches
    }
    if (doesMatch('inverted')) {
      return true
    }
    if (doesMatch('none')) {
      return false
    }
    return undefined
  }

  getLanguages () {
    const n = navigator
    const result = []

    const language = n.language;
    if (language !== undefined) {
      result.push([language])
    }

    if (Array.isArray(n.languages)) {
      // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
      // the value of `navigator.language`. Therefore, the value is ignored in this browser.
      if (!(this.isChromium() && this.isChromium86OrNewer())) {
        result.push(n.languages);
      }
    } else if (typeof n.languages === 'string') {
      const languages = n.languages;
      if (languages) {
        result.push(languages.split(','))
      }
    }

    return result;
  }

  isChromium () {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    const w = window
    const n = navigator

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
    )
  }

  isChromium86OrNewer () {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    const w = window

    return (
      this.countTruthy([
        !('MediaSettingsRange' in w),
        'RTCEncodedAudioFrame' in w,
        '' + w.Intl === '[object Intl]',
        '' + w.Reflect === '[object Reflect]',
      ]) >= 3
    )
  }

  countTruthy (values) {
    return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
  }

  getOsCpu () {
    return navigator.oscpu;
  }

  getPlatform () {
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

  isWebKit () {
    // Based on research in September 2020
    const w = window
    const n = navigator

    return (
      this.countTruthy([
        'ApplePayError' in w,
        'CSSPrimitiveValue' in w,
        'Counter' in w,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w,
      ]) >= 4
    )
  }

  isDesktopSafari () {
    const w = window

    return (
      this.countTruthy([
        'safari' in w, // Always false in Karma and BrowserStack Automate
        !('DeviceMotionEvent' in w),
        !('ongestureend' in w),
        !('standalone' in navigator),
      ]) >= 3
    );
  }

  isIPad () {
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
        !!Element.prototype.webkitRequestFullscreen, // Since iOS 12
        // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
        screenRatio > 0.65 && screenRatio < 1.53,
      ]) >= 2
    );
  }

  screenFrameBackup;
  screenFrameSizeTimeoutId;
  screenFrameCheckInterval = 2500;

  watchScreenFrame () {
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
    }
    checkScreenFrame();
  }

  getCurrentScreenFrame () {
    const s = screen;

    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
      this.replaceNaN(this.toFloat(s.availTop), null),
      this.replaceNaN(this.toFloat(s.width) - this.toFloat(s.availWidth) - this.replaceNaN(this.toFloat(s.availLeft), 0), null),
      this.replaceNaN(this.toFloat(s.height) - this.toFloat(s.availHeight) - this.replaceNaN(this.toFloat(s.availTop), 0), null),
      this.replaceNaN(this.toFloat(s.availLeft), null),
    ];
  }

  isFrameSizeNull (frameSize) {
    for (let i = 0; i < 4; ++i) {
      if (frameSize[i]) {
        return false;
      }
    }
    return true;
  }

  getScreenResolution () {
    const s = screen;

    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    // Some browsers even return  screen resolution as not numbers.
    const parseDimension = (value) => this.replaceNaN(this.toInt(value), null);
    const dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
  }

  getTimezoneOffset () {
    const currentYear = new Date().getFullYear()
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
      // `getTimezoneOffset` returns a number as a string in some unidentified cases
      this.toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      this.toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
    )
  }

  getTimezone () {
    const DateTimeFormat = window.Intl?.DateTimeFormat
    if (DateTimeFormat) {
      const timezone = new DateTimeFormat().resolvedOptions().timeZone
      if (timezone) {
        return timezone
      }
    }

    // For browsers that don't support timezone names
    // The minus is intentional because the JS offset is opposite to the real offset
    const offset = -this.getTimezoneOffset()
    return `UTC${offset >= 0 ? '+' : ''}${Math.abs(offset)}`
  }


  getTouchSupport () {
    const n = navigator

    let maxTouchPoints = 0
    let touchEvent;
    if (n.maxTouchPoints !== undefined) {
      maxTouchPoints = this.toInt(n.maxTouchPoints)
    } else if (n.msMaxTouchPoints !== undefined) {
      maxTouchPoints = n.msMaxTouchPoints;
    }
    try {
      document.createEvent('TouchEvent')
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

async function getFingerprintData(device) {
  const constants = device.getConstants();
  const gpu = constants.gpu !== 'unknown' ? constants.gpu : '{}';
  const fingerprintData = await fetch('https://dev-api.keyri.co/fingerprint/me', {
    method: 'GET', headers: {
      accept: 'application/json',
      gpuvendor: device.paramToString(JSON.parse(gpu).vendor),
      gpurenderer: device.paramToString(JSON.parse(gpu).renderer),
      timezone: constants.timezone,
      product: constants.product,
      appname: constants.appName,
      appcodename: constants.appCodeName,
      platform: constants.platform,
      devicememory: constants.deviceMemory,
      maxtouchpoints: device.paramToString(JSON.parse(constants.touchSupport).maxTouchPoints),
      osinfo: constants.osInfo,
      oscpu: constants.osCpu,
      hardwareconcurrency: constants.hardwareConcurrency,
      screenframe: constants.screenFrame,
      screencolordepth: constants.screenColorDepth,
      colorgamut: constants.colorGamut,
    }
  });

  return fingerprintData.json();
}

async function addFingerprintUser(device, name) {
  const constants = device.getConstants();
  const gpu = constants.gpu !== 'unknown' ? constants.gpu : '{}';
  const fingerprintData = await fetch('https://dev-api.keyri.co/fingerprint/new-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      gpuvendor: device.paramToString(JSON.parse(gpu).vendor),
      gpurenderer: device.paramToString(JSON.parse(gpu).renderer),
      timezone: constants.timezone,
      product: constants.product,
      appname: constants.appName,
      appcodename: constants.appCodeName,
      platform: constants.platform,
      devicememory: constants.deviceMemory,
      maxtouchpoints: device.paramToString(JSON.parse(constants.touchSupport).maxTouchPoints),
      osinfo: constants.osInfo,
      oscpu: constants.osCpu,
      hardwareconcurrency: constants.hardwareConcurrency,
      screenframe: constants.screenFrame,
      screencolordepth: constants.screenColorDepth,
      colorgamut: constants.colorGamut,
    })
  });

  return fingerprintData.json();
}