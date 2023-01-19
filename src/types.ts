export type WritableCSSProperties = {
  [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never;
}[Extract<keyof CSSStyleDeclaration, string>];

export type WritableCSSStyles = Partial<Pick<CSSStyleDeclaration, WritableCSSProperties>>;

export type Preset = [style?: WritableCSSStyles, text?: string];

export type FrameSize = [number | null, number | null, number | null, number | null]
export interface IGetVideoCardInfo {
  vendor?: string;
  renderer?: string;
  error?: string;
}
export interface IGetTouchSupport {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
}
export enum ContrastPreference {
  Less = -1,
  None = 0,
  More = 1,
  ForcedColors = 10,
}

export enum SpecialFingerprint {
  /** Making a fingerprint is skipped because the browser is known to always suspend audio context */
  KnownToSuspend = -1,
  /** The browser doesn't support audio context */
  NotSupported = -2,
  /** An unexpected timeout has happened */
  Timeout = -3,
}

export enum InnerErrorName {
  Timeout = 'timeout',
  Suspended = 'suspended',
}

export type PluginMimeTypeData = {
  type: string;
  suffixes: string;
};

export type PluginData = {
  name: string;
  description: string;
  mimeTypes: PluginMimeTypeData[];
};

export interface CanvasFingerprint {
  winding: boolean;
  geometry: string;
  text: string;
}
