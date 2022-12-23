function getFullInfoAboutDevice() {
  const screenColorDepth = getColorDepth();
  const colorGamut = getColorGamut();
  const contrastPreferences = getContrastPreference();
  const cookiesEnabled = areCookiesEnabled();
  const osInfo = getOSInfo();
  const deviceMemory = getDeviceMemory();
  const deviceColorsForced = areColorsForced();
  const hardwareConcurrency = getHardwareConcurrency();
  const usingHDR = isHDR();
  const colorsInverted = areColorsInverted();
  const languages = getLanguages();
  const osCpu = getOsCpu();
  const platform = getPlatform();
  const screenResolution = getScreenResolution();
  const timezone = getTimezone();
  const touchSupport = JSON.stringify(getTouchSupport());
  const gpu = JSON.stringify(getVideoCardInfo());

  const navigator = getNavigatorValues();
  const appName = navigator.appName;
  const appVersion = navigator.appVersion;
  const userAgent = navigator.userAgent;
  const pdfViewerEnabled = navigator.pdfViewerEnabled;
  const appCodeName = navigator.appCodeName;
  const product = navigator.product;
  const currentBrowserBuildNumber = navigator.productSub;
  const screenFrame = screenFrameBackup;
  const connection = JSON.stringify(navigator.connection);

  return {
    constants: {
      gpu,
      timezone,
      product,
      appName,
      appCodeName,
      platform,
      deviceMemory,
      touchSupport,
      osInfo,
      osCpu,
      hardwareConcurrency,
      screenFrame,
      screenColorDepth,
      colorGamut,
    },
    changedParams: {
      screenResolution,
      currentBrowserBuildNumber,
      contrastPreferences,
      cookiesEnabled,
      languages,
      userAgent,
      pdfViewerEnabled,
      deviceColorsForced,
      usingHDR,
      colorsInverted,
      appVersion,
      connection,
    }
  }
}

function getVideoCardInfo() {
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

function getColorDepth() {
  return window.screen.colorDepth
}

function getColorGamut() {
  // rec2020 includes p3 and p3 includes srgb
  for (const gamut of ['rec2020', 'p3', 'srgb']) {
    if (matchMedia(`(color-gamut: ${gamut})`).matches) {
      return gamut;
    }
  }
  return undefined
}


const ContrastPreference = {
  Less: -1,
  None: 0,
  More: 1,
  ForcedColors: 10,
}

function getContrastPreference() {
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

function areCookiesEnabled() {
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

function getOSInfo() {
  const arch = navigator.userAgent.match(/x86_64|Win64|WOW64/) ||
  navigator.cpuClass === 'x64' ? 'x64' : 'x86'
  return arch;
}

function getNavigatorValues() {
  return navigator;
}

function getDeviceMemory() {
  // `navigator.deviceMemory` is a string containing a number in some unidentified cases
  return replaceNaN(toFloat(navigator.deviceMemory), undefined)
}

function toFloat(value) {
  return parseFloat(value)
}

function replaceNaN(value, replacement) {
  return typeof value === 'number' && isNaN(value) ? replacement : value
}

function areColorsForced() {
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

function getHardwareConcurrency() {
  // sometimes hardware concurrency is a string
  return replaceNaN(toInt(navigator.hardwareConcurrency), undefined)
}

function toInt(value) {
  return parseInt(value);
}

function isHDR() {
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

function areColorsInverted() {
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

function getLanguages() {
  const n = navigator
  const result = []

  const language = n.language;
  if (language !== undefined) {
    result.push([language])
  }

  if (Array.isArray(n.languages)) {
    // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
    // the value of `navigator.language`. Therefore the value is ignored in this browser.
    if (!(isChromium() && isChromium86OrNewer())) {
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

function isChromium() {
  // Based on research in October 2020. Tested to detect Chromium 42-86.
  const w = window
  const n = navigator

  return (
    countTruthy([
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

function isChromium86OrNewer() {
  // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
  const w = window

  return (
    countTruthy([
      !('MediaSettingsRange' in w),
      'RTCEncodedAudioFrame' in w,
      '' + w.Intl === '[object Intl]',
      '' + w.Reflect === '[object Reflect]',
    ]) >= 3
  )
}

function countTruthy(values) {
  return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
}

function getOsCpu() {
  return navigator.oscpu;
}

function getPlatform() {
  // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
  const {platform} = navigator

  // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
  // iPad uses desktop mode by default since iOS 13
  // The value is 'MacIntel' on M1 Macs
  // The value is 'iPhone' on iPod Touch
  if (platform === 'MacIntel') {
    if (isWebKit() && !isDesktopSafari()) {
      return isIPad() ? 'iPad' : 'iPhone'
    }
  }

  return platform
}

function isWebKit() {
  // Based on research in September 2020
  const w = window
  const n = navigator

  return (
    countTruthy([
      'ApplePayError' in w,
      'CSSPrimitiveValue' in w,
      'Counter' in w,
      n.vendor.indexOf('Apple') === 0,
      'getStorageUpdates' in n,
      'WebKitMediaKeys' in w,
    ]) >= 4
  )
}

function isDesktopSafari() {
  const w = window

  return (
    countTruthy([
      'safari' in w, // Always false in Karma and BrowserStack Automate
      !('DeviceMotionEvent' in w),
      !('ongestureend' in w),
      !('standalone' in navigator),
    ]) >= 3
  )
}

function isIPad() {
  // Checked on:
  // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
  // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
  // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
  // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14

  // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
  if (navigator.platform === 'iPad') {
    return true
  }

  const s = screen
  const screenRatio = s.width / s.height

  return (
    countTruthy([
      'MediaSource' in window, // Since iOS 13
      !!Element.prototype.webkitRequestFullscreen, // Since iOS 12
      // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
      screenRatio > 0.65 && screenRatio < 1.53,
    ]) >= 2
  )
}

let screenFrameBackup;
let screenFrameSizeTimeoutId;
const screenFrameCheckInterval = 2500;

function watchScreenFrame() {
  if (screenFrameSizeTimeoutId !== undefined) {
    return;
  }
  const checkScreenFrame = () => {
    const frameSize = getCurrentScreenFrame();
    if (isFrameSizeNull(frameSize)) {
      screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, screenFrameCheckInterval);
    } else {
      screenFrameBackup = frameSize;
      screenFrameSizeTimeoutId = undefined;
    }
  }
  checkScreenFrame();
}

watchScreenFrame();

function getCurrentScreenFrame() {
  const s = screen;

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  //
  // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
  // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
  return [
    replaceNaN(toFloat(s.availTop), null),
    replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat(s.availLeft), 0), null),
    replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat(s.availTop), 0), null),
    replaceNaN(toFloat(s.availLeft), null),
  ]
}

function isFrameSizeNull(frameSize) {
  for (let i = 0; i < 4; ++i) {
    if (frameSize[i]) {
      return false;
    }
  }
  return true;
}

function getScreenResolution() {
  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  // Some browsers even return  screen resolution as not numbers.
  const parseDimension = (value) => replaceNaN(toInt(value), null)
  const dimensions = [parseDimension(s.width), parseDimension(s.height)];
  dimensions.sort().reverse();
  return dimensions;
}

function getTimezone() {
  const DateTimeFormat = window.Intl?.DateTimeFormat
  if (DateTimeFormat) {
    const timezone = new DateTimeFormat().resolvedOptions().timeZone
    if (timezone) {
      return timezone
    }
  }

  // For browsers that don't support timezone names
  // The minus is intentional because the JS offset is opposite to the real offset
  const offset = -getTimezoneOffset()
  return `UTC${offset >= 0 ? '+' : ''}${Math.abs(offset)}`
}

function getTimezoneOffset() {
  const currentYear = new Date().getFullYear()
  // The timezone offset may change over time due to daylight saving time (DST) shifts.
  // The non-DST timezone offset is used as the result timezone offset.
  // Since the DST season differs in the northern and the southern hemispheres,
  // both January and July timezones offsets are considered.
  return Math.max(
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
    toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
  )
}


function getTouchSupport() {
  const n = navigator

  let maxTouchPoints = 0
  let touchEvent;
  if (n.maxTouchPoints !== undefined) {
    maxTouchPoints = toInt(n.maxTouchPoints)
  } else if (n.msMaxTouchPoints !== undefined) {
    maxTouchPoints = n.msMaxTouchPoints
  }
  try {
    document.createEvent('TouchEvent')
    touchEvent = true
  } catch {
    touchEvent = false
  }
  const touchStart = 'ontouchstart' in window
  return {
    maxTouchPoints,
    touchEvent,
    touchStart,
  }
}

async function getFingerprintData(deviceInfo) {
  const fingerprintData = await fetch('https://dev-api.keyri.co/fingerprint/me', {
    method: 'GET', headers: {
      accept: 'application/json',
      gpuvendor: JSON.parse(deviceInfo.constants.gpu).vendor,
      gpurenderer: JSON.parse(deviceInfo.constants.gpu).renderer,
      timezone: deviceInfo.constants.timezone,
      product: deviceInfo.constants.product,
      appname: deviceInfo.constants.appName,
      appcodename: deviceInfo.constants.appCodeName,
      platform: deviceInfo.constants.platform,
      devicememory: deviceInfo.constants.deviceMemory,
      maxtouchpoints: JSON.parse(deviceInfo.constants.touchSupport).maxTouchPoints,
      osinfo: deviceInfo.constants.osInfo,
      oscpu: deviceInfo.constants.osCpu,
      hardwareconcurrency: deviceInfo.constants.hardwareConcurrency,
      screenframe: deviceInfo.constants.screenFrame,
      screencolordepth: deviceInfo.constants.screenColorDepth,
      colorgamut: deviceInfo.constants.colorGamut,
    }
  });

  return fingerprintData.json();
}

async function addFingerprintUser(deviceInfo, name) {
  const fingerprintData = await fetch('https://dev-api.keyri.co/fingerprint/new-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      gpuvendor: JSON.parse(deviceInfo.constants.gpu).vendor,
      gpurenderer: JSON.parse(deviceInfo.constants.gpu).renderer,
      timezone: deviceInfo.constants.timezone,
      product: deviceInfo.constants.product,
      appname: deviceInfo.constants.appName,
      appcodename: deviceInfo.constants.appCodeName,
      platform: deviceInfo.constants.platform,
      devicememory: deviceInfo.constants.deviceMemory.toString(),
      maxtouchpoints: JSON.parse(deviceInfo.constants.touchSupport).maxTouchPoints.toString(),
      osinfo: deviceInfo.constants.osInfo,
      oscpu: deviceInfo.constants.osCpu || 'undefined',
      hardwareconcurrency: deviceInfo.constants.hardwareConcurrency.toString(),
      screenframe: deviceInfo.constants.screenFrame.toString(),
      screencolordepth: deviceInfo.constants.screenColorDepth.toString(),
      colorgamut: deviceInfo.constants.colorGamut,
    })
  });

  return fingerprintData.json();
}