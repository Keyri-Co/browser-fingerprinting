<p align="center">
    <a href="">
        <img src="https://keyri.com/wp-content/uploads/2022/09/Keyri-Grey-Logo-Website-300x147.png" width=200 />
    </a>
</p>

<p align="center">A library from Keyri for fingerprinting web browsers</p>

<p align="center">
    <a href="https://keyri.com"><b>Website</b></a> •
    <a href="https://docs.keyri.com/"><b>Documentation</b></a>
</p>

## Features

- Retrieve device data for logging and analytics
- Create identifier based on device data
- Register device with service public key
- Creating custom events based on public key

## Installing

### Package manager

Using npm:

```bash
$ npm install keyri-fingerprint
```

Once the package is installed, you can import the library using `import` or `require`:

```js
import { Device } from 'keyri-fingerprint';
```

If you use `require` for importing, **only default export is available**:

```js
const Device = require('keyri-fingerprint').Device;
```

## Example

> **Note** CommonJS usage

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();

await device.load(); // load and set params with async loaders

const deviceMainParams: Record<string, string> = device.getMainParams();
const deviceHash: string = device.createFingerprintHash();
const cryptoCookie: string = await device.initCryptoCookie();
```

## API

You can initialize Device instance with next params:

```ts
import { Device } from 'keyri-fingerprint';
import { Environments } from './types';

const device: Device = new Device({ apiKey: YOUR_PUBLIC_API_KEY, environment: 'production' });
```

You can find `apiKey` in Keyri Dashboard after you create new service. It give you possibility to use pro-version of library and create custom events, analyze devices signals etc.

`environment` is optional field which can configure which environment back-end of Keyri you want to use.

After you create new `Device` instance you will be able to use the following public methods:

| Method                               | Arguments                                                                                                                                         | Return                   | Description                                                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| async load()                         | -                                                                                                                                                 | Promise<`Device`>        | Method load async params and set to `Device`                                                                                                                 |
| createFingerprintHash()              | -                                                                                                                                                 | `string`                 | This method allow create fingerprint hash string based on device params                                                                                      |
| async initCryptoCookie()             | -                                                                                                                                                 | `string`                 | this method allow create cryptoCookie hash based on ECDSA encryption                                                                                         |
| getMainParams()                      | -                                                                                                                                                 | `Record<string, string>` | Method return object with device parameters                                                                                                                  |
| async me()                           | -                                                                                                                                                 | `Record<string, string>` | Method return object with device parameters from Keyri back-end \*\*\*ApiKey required in instance initializer                                                |
| async synchronizeDevice()            | -                                                                                                                                                 | `Record<string, string>` | Method return object with device parameters from Keyri back-end and register if device not exist \*\*\*ApiKey required in instance initializer               |
| async generateEvent(params: IParams) | `interface IParams { eventType: FingerprintLogEvents; eventResult: FingerprintLogResult; signals?: Array<FingerprintSignals>; userId?: string; }` | `Record<string, string>` | Method will create new custom event on Keyri side, analyze all signals, risk parameters and return back result \*\*\*ApiKey required in instance initializer |

### Responses examples

#### createFingerprintHash()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();

await device.load();

const deviceHash = device.createFingerprintHash();
console.log(deviceHash); // 'de91eb974773aa4937bd9b54d375ecf9'
```

#### initCryptoCookie()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();

await device.load();

const cryptoCookie = device.initCryptoCookie();
console.log(cryptoCookie); // 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7Nsej5VVE3LpilLLVfNFgxCifr4w1R5XxLJosivrzp7BeDj9bRwwKpIMnkvx0rTg5DySMQfzj5M6jZde+egoug=='
```

#### getMainParams()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();
await device.load();

const deviceMainParams: Record<string, string> = device.getConstants();

console.log(JSON.stringify(deviceMainParams));
```

```json
{
  "gpuVendor": "Google Inc. (Apple)",
  "gpuRenderer": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
  "timezone": "Europe/Kiev",
  "product": "Gecko",
  "appName": "Netscape",
  "appCodeName": "Mozilla",
  "platform": "MacIntel",
  "deviceMemory": "8",
  "maxTouchPoints": "0",
  "osInfo": "x86",
  "osCpu": "unknown",
  "hardwareConcurrency": "8",
  "screenColorDepth": "30",
  "colorGamut": "p3",
  "currentBrowserBuildNumber": "20030107",
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  "fonts": "[\"Arial Unicode MS\",\"Gill Sans\",\"Helvetica Neue\",\"Menlo\"]",
  "domBlockers": "[]",
  "fontPreferences": "{\"default\":147.5625,\"apple\":147.5625,\"serif\":147.5625,\"sans\":144.015625,\"mono\":132.625,\"min\":9.234375,\"system\":146.09375}",
  "screenResolution": "[900,1440]",
  "contrastPreferences": "0",
  "cookiesEnabled": "false",
  "languages": "[[\"ru-RU\"]]",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  "pdfViewerEnabled": "true",
  "deviceColorsForced": "false",
  "usingHDR": "true",
  "colorsInverted": "unknown",
  "audioFingerprint": "124.04344968475198",
  "sessionStorage": "true",
  "localStorage": "true",
  "indexedDB": "true",
  "openDatabase": "true",
  "cpuClass": "unknown",
  "plugins": "[{\"name\":\"PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chrome PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chromium PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Microsoft Edge PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"WebKit built-in PDF\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]}]",
  "vendorFlavors": "[\"chrome\"]",
  "monochromeDepth": "0",
  "motionReduced": "false",
  "math": "{\"acos\":1.4473588658278522,\"acosh\":709.889355822726,\"acoshPf\":355.291251501643,\"asin\":0.12343746096704435,\"asinh\":0.881373587019543,\"asinhPf\":0.8813735870195429,\"atanh\":0.5493061443340548,\"atanhPf\":0.5493061443340548,\"atan\":0.4636476090008061,\"sin\":0.8178819121159085,\"sinh\":1.1752011936438014,\"sinhPf\":2.534342107873324,\"cos\":-0.8390715290095377,\"cosh\":1.5430806348152437,\"coshPf\":1.5430806348152437,\"tan\":-1.4214488238747245,\"tanh\":0.7615941559557649,\"tanhPf\":0.7615941559557649,\"exp\":2.718281828459045,\"expm1\":1.718281828459045,\"expm1Pf\":1.718281828459045,\"log1p\":2.3978952727983707,\"log1pPf\":2.3978952727983707,\"powPI\":1.9275814160560204e-50}",
  "architecture": "127",
  "adBlockers": "false",
  "doNotTrack": "false",
  "navigatorPropertiesCount": "64",
  "buildID": "Unsupported",
  "javaEnabled": "false",
  "browserPermissions": "{\"sensors\":\"granted\",\"video_capture\":\"prompt\",\"clipboard_read\":\"prompt\",\"clipboard_write\":\"granted\",\"geolocation\":\"prompt\",\"background_sync\":\"granted\",\"audio_capture\":\"prompt\",\"midi\":\"granted\",\"notifications\":\"prompt\",\"payment_handler\":\"granted\",\"durable_storage\":\"prompt\"}",
  "supportedAudioFormats": "{\"audio/aac\":\"probably\",\"audio/flac\":\"probably\",\"audio/mpeg\":\"probably\",\"audio/mp4; codecs=\\\"mp4a.40.2\\\"\":\"probably\",\"audio/ogg; codecs=\\\"flac\\\"\":\"probably\",\"audio/ogg; codecs=\\\"vorbis\\\"\":\"probably\",\"audio/ogg; codecs=\\\"opus\\\"\":\"probably\",\"audio/wav; codecs=\\\"1\\\"\":\"probably\",\"audio/webm; codecs=\\\"vorbis\\\"\":\"probably\",\"audio/webm; codecs=\\\"opus\\\"\":\"probably\"}",
  "audioContext": "{\"channelCount\":2,\"channelCountMode\":\"max\",\"channelInterpretation\":\"speakers\",\"maxChannelCount\":2,\"numberOfInputs\":1,\"numberOfOutputs\":0,\"sampleRate\":48000,\"state\":\"suspended\"}",
  "frequencyAnalyserProperties": "{\"channelCount\":2,\"channelCountMode\":\"max\",\"channelInterpretation\":\"speakers\",\"fftSize\":2048,\"frequencyBinCount\":1024,\"maxDecibels\":-30,\"minDecibels\":-100,\"numberOfInputs\":1,\"numberOfOutputs\":1,\"smoothingTimeConstant\":0.8}",
  "supportedVideoFormats": "{\"video/ogg; codecs=\\\"theora\\\"\":\"probably\",\"video/mp4; codecs=\\\"avc1.42E01E\\\"\":\"probably\",\"video/webm; codecs=\\\"vp8, vorbis\\\"\":\"probably\",\"video/webm; codecs=\\\"vp9\\\"\":\"probably\",\"application/x-mpegURL; codecs=\\\"avc1.42E01E\\\"\":\"\",\"video/mp4; codecs=\\\"flac\\\"\":\"probably\",\"video/ogg; codecs=\\\"opus\\\"\":\"probably\",\"video/webm; codecs=\\\"vp9, opus\\\"\":\"probably\"}"
}
```

#### me()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device({ apiKey: 'PUBLIC_API_KEY' });
await device.load();

const backEndDeviceResponse: Record<string, string> = await device.me();

console.log(JSON.stringify(backEndDeviceResponse));
```

```json
{
  "id": "8eddcc2ade4f9988s7ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
  "fingerprint": "6557eaf4098ebau348418bc76107babd",
  "tlsFingerprint": "390315bb647dcbe7b3b414b731f00aba",
  "cryptoCookie": "MFkwEwYHKoZIzu0CAQYIKoZIzj0DAQcDQgAE7Nsej5VVE3LpilLLVfNFgxCifr4w1R5XxLJosivrzp7BeDj9bRwwKpIMnkvx0rTg5DySMQfzj5M6jZde+egoug==",
  "deviceParams": {
    "gpuVendor": "Google Inc. (Apple)",
    "gpuRenderer": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
    "timezone": "Europe/Kiev",
    "product": "Gecko",
    "appName": "Netscape",
    "appCodeName": "Mozilla",
    "platform": "MacIntel",
    "deviceMemory": "8",
    "maxTouchPoints": "0",
    "osInfo": "x86",
    "osCpu": "unknown",
    "hardwareConcurrency": "8",
    "screenColorDepth": "30",
    "colorGamut": "p3",
    "currentBrowserBuildNumber": "20030107",
    "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "fonts": "[\"Arial Unicode MS\",\"Gill Sans\",\"Helvetica Neue\",\"Menlo\"]",
    "domBlockers": "[]",
    "fontPreferences": "{\"default\":147.5625,\"apple\":147.5625,\"serif\":147.5625,\"sans\":144.015625,\"mono\":132.625,\"min\":9.234375,\"system\":146.09375}",
    "screenResolution": "[900,1440]",
    "contrastPreferences": "0",
    "cookiesEnabled": "false",
    "languages": "[[\"ru-RU\"]]",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "pdfViewerEnabled": "true",
    "deviceColorsForced": "false",
    "usingHDR": "true",
    "colorsInverted": "unknown",
    "audioFingerprint": "124.04344968475198",
    "sessionStorage": "true",
    "localStorage": "true",
    "indexedDB": "true",
    "openDatabase": "true",
    "cpuClass": "unknown",
    "plugins": "[{\"name\":\"PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chrome PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chromium PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Microsoft Edge PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"WebKit built-in PDF\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]}]",
    "vendorFlavors": "[\"chrome\"]",
    "monochromeDepth": "0",
    "motionReduced": "false",
    "math": "{\"acos\":1.4473588658278522,\"acosh\":709.889355822726,\"acoshPf\":355.291251501643,\"asin\":0.12343746096704435,\"asinh\":0.881373587019543,\"asinhPf\":0.8813735870195429,\"atanh\":0.5493061443340548,\"atanhPf\":0.5493061443340548,\"atan\":0.4636476090008061,\"sin\":0.8178819121159085,\"sinh\":1.1752011936438014,\"sinhPf\":2.534342107873324,\"cos\":-0.8390715290095377,\"cosh\":1.5430806348152437,\"coshPf\":1.5430806348152437,\"tan\":-1.4214488238747245,\"tanh\":0.7615941559557649,\"tanhPf\":0.7615941559557649,\"exp\":2.718281828459045,\"expm1\":1.718281828459045,\"expm1Pf\":1.718281828459045,\"log1p\":2.3978952727983707,\"log1pPf\":2.3978952727983707,\"powPI\":1.9275814160560204e-50}",
    "architecture": "127"
  },
  "createdAt": "2023-03-24T13:28:10.646Z",
  "updatedAt": "2023-03-24T13:28:10.646Z",
  "events": [
    {
      "id": "02ded41945c1f3f7517ad00321f60027037e888e4148bb10afc5cfc4830c7cd45af7275b644d0cf400701ee6925dc321",
      "event": "register_device",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.37.68",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-24T13:28:10.934Z",
      "updatedAt": "2023-03-24T13:28:10.934Z"
    },
    {
      "id": "f275216a438382c1e4c1bcb5fb9a74155aac4a1cd66adb1c8b67e1ef3540354d36e1bb70769c6b2ed30bd3d1d1fc0f18",
      "event": "visits",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.34.45",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-28T09:49:48.920Z",
      "updatedAt": "2023-03-28T09:49:48.920Z"
    },
    {
      "id": "215774008243f45ec1dba1d04e1970f69cce0ebcaf28000ad81c99f4348db065215b2a1870f8bd6dbe47899873f365c1",
      "event": "visits",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.34.45",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-28T09:50:01.350Z",
      "updatedAt": "2023-03-28T09:50:01.350Z"
    }
  ]
}
```

#### synchronizeDevice()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device({ apiKey: 'PUBLIC_API_KEY' });
await device.load();

const backEndDeviceResponse: Record<string, string> = await device.synchronizeDevice();

console.log(JSON.stringify(backEndDeviceResponse));
```

```json
{
  "id": "8eddcc2ade4f9988s7ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
  "fingerprint": "6557eaf4098ebau348418bc76107babd",
  "tlsFingerprint": "390315bb647dcbe7b3b414b731f00aba",
  "cryptoCookie": "MFkwEwYHKoZIzu0CAQYIKoZIzj0DAQcDQgAE7Nsej5VVE3LpilLLVfNFgxCifr4w1R5XxLJosivrzp7BeDj9bRwwKpIMnkvx0rTg5DySMQfzj5M6jZde+egoug==",
  "deviceParams": {
    "gpuVendor": "Google Inc. (Apple)",
    "gpuRenderer": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
    "timezone": "Europe/Kiev",
    "product": "Gecko",
    "appName": "Netscape",
    "appCodeName": "Mozilla",
    "platform": "MacIntel",
    "deviceMemory": "8",
    "maxTouchPoints": "0",
    "osInfo": "x86",
    "osCpu": "unknown",
    "hardwareConcurrency": "8",
    "screenColorDepth": "30",
    "colorGamut": "p3",
    "currentBrowserBuildNumber": "20030107",
    "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "fonts": "[\"Arial Unicode MS\",\"Gill Sans\",\"Helvetica Neue\",\"Menlo\"]",
    "domBlockers": "[]",
    "fontPreferences": "{\"default\":147.5625,\"apple\":147.5625,\"serif\":147.5625,\"sans\":144.015625,\"mono\":132.625,\"min\":9.234375,\"system\":146.09375}",
    "screenResolution": "[900,1440]",
    "contrastPreferences": "0",
    "cookiesEnabled": "false",
    "languages": "[[\"ru-RU\"]]",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "pdfViewerEnabled": "true",
    "deviceColorsForced": "false",
    "usingHDR": "true",
    "colorsInverted": "unknown",
    "audioFingerprint": "124.04344968475198",
    "sessionStorage": "true",
    "localStorage": "true",
    "indexedDB": "true",
    "openDatabase": "true",
    "cpuClass": "unknown",
    "plugins": "[{\"name\":\"PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chrome PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Chromium PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"Microsoft Edge PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]},{\"name\":\"WebKit built-in PDF\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]}]",
    "vendorFlavors": "[\"chrome\"]",
    "monochromeDepth": "0",
    "motionReduced": "false",
    "math": "{\"acos\":1.4473588658278522,\"acosh\":709.889355822726,\"acoshPf\":355.291251501643,\"asin\":0.12343746096704435,\"asinh\":0.881373587019543,\"asinhPf\":0.8813735870195429,\"atanh\":0.5493061443340548,\"atanhPf\":0.5493061443340548,\"atan\":0.4636476090008061,\"sin\":0.8178819121159085,\"sinh\":1.1752011936438014,\"sinhPf\":2.534342107873324,\"cos\":-0.8390715290095377,\"cosh\":1.5430806348152437,\"coshPf\":1.5430806348152437,\"tan\":-1.4214488238747245,\"tanh\":0.7615941559557649,\"tanhPf\":0.7615941559557649,\"exp\":2.718281828459045,\"expm1\":1.718281828459045,\"expm1Pf\":1.718281828459045,\"log1p\":2.3978952727983707,\"log1pPf\":2.3978952727983707,\"powPI\":1.9275814160560204e-50}",
    "architecture": "127"
  },
  "createdAt": "2023-03-24T13:28:10.646Z",
  "updatedAt": "2023-03-24T13:28:10.646Z",
  "events": [
    {
      "id": "02ded41945c1f3f7517ad00321f60027037e888e4148bb10afc5cfc4830c7cd45af7275b644d0cf400701ee6925dc321",
      "event": "register_device",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.37.68",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-24T13:28:10.934Z",
      "updatedAt": "2023-03-24T13:28:10.934Z"
    },
    {
      "id": "f275216a438382c1e4c1bcb5fb9a74155aac4a1cd66adb1c8b67e1ef3540354d36e1bb70769c6b2ed30bd3d1d1fc0f18",
      "event": "visits",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.34.45",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-28T09:49:48.920Z",
      "updatedAt": "2023-03-28T09:49:48.920Z"
    },
    {
      "id": "215774008243f45ec1dba1d04e1970f69cce0ebcaf28000ad81c99f4348db065215b2a1870f8bd6dbe47899873f365c1",
      "event": "visits",
      "location": {
        "city": "Raccoon City",
        "country": "Unknown",
        "countryCode": "RC",
        "continent_name": "Europe",
        "continent_code": "EU",
        "latitude": 48.5161018371582,
        "longitude": 32.25809860229492
      },
      "ip": "109.95.34.45",
      "result": "success",
      "signals": [],
      "fingerprintId": "8eddcc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
      "applicationId": "4cfae52a69132d59ed3e83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
      "userId": "f8b3717735f10912a073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
      "createdAt": "2023-03-28T09:50:01.350Z",
      "updatedAt": "2023-03-28T09:50:01.350Z"
    }
  ]
}
```

#### generateEvent()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device({ apiKey: 'PUBLIC_API_KEY' });
await device.load();

const newEvent: Record<string, string> = await device.generateEvent({ eventType: 'visits', eventResult: 'success' });

console.log(JSON.stringify(newEvent));
```

```json
{
  "id": "5d6c9ce67167u24a2e61d58f4c786c144d9e1a4a7c3df0d3bbac578b01e2401ac024108d43713948ed3b9d5407d53dd2",
  "event": "visits",
  "location": {
    "city": "Raccoon City",
    "country": "Unknown",
    "countryCode": "RC",
    "continent_name": "Europe",
    "continent_code": "EU",
    "latitude": 48.5161018371582,
    "longitude": 32.25809860229492
  },
  "ip": "109.95.37.130",
  "result": "success",
  "signals": [],
  "fingerprintId": "8eddsc2ade4f998837ca4c6927931e1750d6805c22324101e646c3eb27bf32dc27b77319ac0ad0137d11f95b04244ecb",
  "applicationId": "4cfae52a69132d59edhe83062d93e0300770ea26db58f206a526b250715eba8f5d3b0b8b56e6f558a63ca496627a6fe2",
  "userId": "f8b3717735f1091aa073fff2e669d2afb82802c92f9755260a3ae2c7339cbbb7bd9635a158f095ccb03610831a9bc112",
  "updatedAt": "2023-03-31T12:28:46.371Z",
  "createdAt": "2023-03-31T12:28:46.371Z"
}
```

> **Note** If you try to get device params in a `nodeJs` environment, you always will receive the same response object
>
> ```json
> {
>   "environment": "node-js"
> }
> ```
