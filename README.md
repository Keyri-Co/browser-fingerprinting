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
- Separated blocks of information for constant device data and changeable

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

const deviceMainParams: Record<string, string> = device.getConstants();
const deviceAdditionalParams: Record<string, string> = device.getChangedParams();
const deviceHash: string = device.createFingerprintHash();
```

## API

After you create new `Device` instance you will be able to use next public methods:

| Method                  | Arguments                                               | Return                   | Description                                                                                                |
| ----------------------- | ------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| createFingerprintHash() | includeChangeableParams: boolean (**default: _false_**) | `string`                 | This method allow create fingerprint hash string based on device params                                    |
| getConstants()          | -                                                       | `Record<string, string>` | Method return object with device parameter which cannot be changed                                         |
| getChangedParams()      | -                                                       | `Record<string, string>` | Method return floating device parameters which unsuitable for fingerprinting but can be used for analytics |

### Responses examples

#### createFingerprintHash()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();
const deviceHash = device.createFingerprintHash();
console.log(deviceHash); // '683277a53901f2e5dda703c852b940d1'
```

#### getConstants()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();
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
  "screenFrame": "25,0,81,0",
  "screenColorDepth": "30",
  "colorGamut": "rec2020"
}
```

#### getChangedParams()

```ts
import { Device } from 'keyri-fingerprint';

const device: Device = new Device();
const deviceAdditionalParams: Record<string, string> = device.getChangedParams();

console.log(JSON.stringify(deviceAdditionalParams));
```

```json
{
  "screenResolution": "900,1440",
  "currentBrowserBuildNumber": "20030107",
  "contrastPreferences": "0",
  "cookiesEnabled": "false",
  "languages": "ru-RU",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "pdfViewerEnabled": "true",
  "deviceColorsForced": "false",
  "usingHDR": "true",
  "colorsInverted": "unknown",
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "connection": "{}"
}
```

> **Note** If you try to get device params in `nodeJs` environment you always will receive the same response object
>
> ```json
> {
>   "environment": "node-js"
> }
> ```
