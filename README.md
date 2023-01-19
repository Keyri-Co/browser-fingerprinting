<p align="center">
    <a href="">
        <img src="https://keyri.com/wp-content/uploads/2022/09/Keyri-Grey-Logo-Website-300x147.png" width=200 />
    </a>
</p>

<p align="center">Library, which can be used with Keyri functionallity for building fingerprint system</p>

<p align="center">
    <a href="https://keyri.com"><b>Website</b></a> •
    <a href="https://docs.keyri.com/"><b>Documentation</b></a>
</p>

## Features

- Retrieve device data for logging and analytics
- Create identifier, based on device parameters

## Installing

### Package manager

Using npm:

```bash
$ npm install keyri-fingerprint
```

Once the package is installed, you can import the library using `import` or `require` approach:

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
```

## API

After you create new `Device` instance you will be able to use next public methods:

| Method                  | Arguments | Return                   | Description                                                             |
| ----------------------- | --------- | ------------------------ | ----------------------------------------------------------------------- |
| async load()            | -         | Promise<`Device`>        | Method load async params and set to `Device`                            |
| createFingerprintHash() | -         | `string`                 | This method allow create fingerprint hash string based on device params |
| getMainParams()         | -         | `Record<string, string>` | Method return object with device parameters                             |

### Responses examples

#### createFingerprintHash()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();

await device.load();

const deviceHash = device.createFingerprintHash();
console.log(deviceHash); // 'de91eb974773aa4937bd9b54d375ecf9'
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
  "screenFrame": "[25,0,84,0]",
  "screenColorDepth": "30",
  "colorGamut": "rec2020",
  "currentBrowserBuildNumber": "20030107",
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "fonts": "[\"Arial Unicode MS\",\"Gill Sans\",\"Helvetica Neue\",\"Menlo\"]",
  "domBlockers": "unknown",
  "fontPreferences": "{\"default\":147.5625,\"apple\":147.5625,\"serif\":147.5625}",
  "screenResolution": "[900,1440]",
  "contrastPreferences": "0",
  "cookiesEnabled": "false",
  "languages": "[[\"ru-RU\"]]",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "pdfViewerEnabled": "true",
  "deviceColorsForced": "false",
  "usingHDR": "true",
  "colorsInverted": "unknown",
  "connection": "{}",
  "audioFingerprint": "124.04344968475198",
  "sessionStorage": "true",
  "localStorage": "true",
  "indexedDB": "true",
  "openDatabase": "true",
  "cpuClass": "unknown",
  "plugins": "[{\"name\":\"PDF Viewer\",\"description\":\"Portable Document Format\",\"mimeTypes\":[{\"type\":\"application/pdf\",\"suffixes\":\"pdf\"},{\"type\":\"text/pdf\",\"suffixes\":\"pdf\"}]}]",
  "canvas": "{\"winding\":true,\"geometry\":\"data:image/png;base64,iVB...\"}",
  "vendorFlavors": "[\"chrome\"]",
  "monochromeDepth": "0",
  "motionReduced": "false",
  "math": "{\"acos\":1.4473588658278522}",
  "architecture": "127"
}
```

> **Note** If you try to get device params in `nodeJs` environment you always will receive the same response object
>
> ```json
> {
>   "environment": "node-js"
> }
> ```
