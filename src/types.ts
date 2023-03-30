export interface IEventParams {
  eventType: FingerprintLogEvents;
  eventResult: FingerprintLogResult;
  signals?: Array<FingerprintSignals>;
  userId?: string;
}

export enum FingerprintLogResult {
  Success = 'success',
  Fail = 'fail',
  Incomplete = 'incomplete',
}

export enum FingerprintSignals {
  MultipleAccountSignups = 'multiple_account_signups',
  NewDeviceType = 'new_device_type',
  MultipleAccountAccessPerDevice = 'multiple_account_access_per_device',
  SuspiciousIP = 'suspicious_ip',
  VpnProxy = 'vpn_proxy',
  TOR = 'tor',
  ImprobableTravel = 'improbable_travel',
  NewIPCountry = 'new_ip_country',
  MaxEventsPerTimeframe = 'max_events_per_timeframe',
  EmulatorDetection = 'emulator_detection',
  JailbrokenRooted = 'jailbroken_rooted',
  SwizzlingDetected = 'swizzling_detected',
  TamperingDetected = 'tampering_detected',
  Debuggable = 'debuggable',
  DangerousApps = 'dangerous_apps',
  MaliciousPackages = 'malicious_packages',
  NewCountry = 'new_country',
  BotDetection = 'bot_detection',
  HeadlessBrowser = 'headless_browser',
  BlockedDevice = 'blocked_device',
  BlockedEmail = 'blocked_email',
}

export enum FingerprintLogEvents {
  Access = 'access',
  Visits = 'visits',
  Login = 'login',
  Signup = 'signup',
  AttachNewDevice = 'attach_new_device',
  EmailChange = 'email_change',
  ProfileUpdate = 'profile_update',
  PasswordReset = 'password_reset',
  Withdrawal = 'withdrawal',
  Deposit = 'deposit',
  Purchase = 'purchase',
}

export enum Environments {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export type WritableCSSProperties = {
  [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never;
}[Extract<keyof CSSStyleDeclaration, string>];

export type WritableCSSStyles = Partial<Pick<CSSStyleDeclaration, WritableCSSProperties>>;

export type Preset = [style?: WritableCSSStyles, text?: string];

export type FrameSize = [number | null, number | null, number | null, number | null];
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
