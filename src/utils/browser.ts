import { assertEvalToString, countTruthy } from './data';

export function isTrident(): boolean {
  const w = window;
  const n = navigator;

  // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
  return countTruthy(['MSCSSMatrix' in w, 'msSetImmediate' in w, 'msIndexedDB' in w, 'msMaxTouchPoints' in n, 'msPointerEnabled' in n]) >= 4;
}

export function isChromium86OrNewer(): boolean {
  // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
  const w = window;

  return countTruthy([!('MediaSettingsRange' in w), 'RTCEncodedAudioFrame' in w, '' + w.Intl === '[object Intl]', '' + w.Reflect === '[object Reflect]']) >= 3;
}

export function isChromium(): boolean {
  // Based on research in October 2020. Tested to detect Chromium 42-86.
  const w = window;
  const n = navigator;

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
  );
}

export function isEdgeHTML(): boolean {
  // Based on research in October 2020
  const w = window;
  const n = navigator;

  return countTruthy(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 && !isTrident();
}

export function isWebKit(): boolean {
  // Based on research in September 2020
  const w = window;
  const n = navigator;

  return (
    countTruthy([
      'ApplePayError' in w,
      'CSSPrimitiveValue' in w,
      'Counter' in w,
      n.vendor.indexOf('Apple') === 0,
      'getStorageUpdates' in n,
      'WebKitMediaKeys' in w,
    ]) >= 4
  );
}

export function isDesktopSafari(): boolean {
  const w = window;

  return (
    countTruthy([
      'safari' in w, // Always false in Karma and BrowserStack Automate
      !('DeviceMotionEvent' in w),
      !('ongestureend' in w),
      !('standalone' in navigator),
    ]) >= 3
  );
}

export function isIPad(): boolean {
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
    countTruthy([
      'MediaSource' in window, // Since iOS 13
      // @ts-ignore
      !!Element.prototype.webkitRequestFullscreen, // Since iOS 12
      // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
      screenRatio > 0.65 && screenRatio < 1.53,
    ]) >= 2
  );
}

export function isWebKit606OrNewer(): boolean {
  // Checked in Safari 9–14
  const w = window;

  return countTruthy(['DOMRectList' in w, 'RTCPeerConnectionIceEvent' in w, 'SVGGeometryElement' in w, 'ontransitioncancel' in w]) >= 3;
}

export function isGecko(): boolean {
  const w = window;

  // Based on research in September 2020
  return (
    countTruthy([
      'buildID' in navigator,
      'MozAppearance' in (document.documentElement?.style ?? {}),
      'onmozfullscreenchange' in w,
      'mozInnerScreenX' in w,
      'CSSMozDocumentRule' in w,
      'CanvasCaptureMediaStream' in w,
    ]) >= 4
  );
}

export function isAndroid(): boolean {
  const isItChromium = isChromium();
  const isItGecko = isGecko();

  // Only 2 browser engines are presented on Android.
  // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
  if (!isItChromium && !isItGecko) {
    return false;
  }

  const w = window;

  // Chrome removes all words "Android" from `navigator` when desktop version is requested
  // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
  return (
    countTruthy(['onorientationchange' in w, 'orientation' in w, isItChromium && !('SharedWorker' in w), isItGecko && /android/i.test(navigator.appVersion)]) >=
    2
  );
}

export function isSafari(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf('Apple') === 0 && assertEvalToString(37);
}

export function isChrome(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf('Google') === 0 && assertEvalToString(33);
}

export function isFirefox(): boolean {
  return document.documentElement !== undefined && (document as any).documentElement.style.MozAppearance !== undefined && assertEvalToString(37);
}

export function isMSIE(): boolean {
  return (
    (navigator as any).msSaveBlob !== undefined && assertEvalToString(39)
  );
}

export function identifyChromium(): string {
  const ua = navigator.userAgent;
  if (ua.match(/Chrome/)) {
    if ((navigator as any).brave !== undefined) {
      return "Brave";
    } else if (ua.match(/Edg/)) {
      return "Edge";
    } else if (ua.match(/OPR/)) {
      return "Opera";
    }
    return "Chrome";
  } else {
    return "Chromium";
  }
}
