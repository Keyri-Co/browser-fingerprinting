import { Environments, IEventParams } from './types';

export class FingerprintApi {
  apiKey: string;
  environment: Environments;

  environmentLinks = {
    [Environments.Local]: 'http://localhost:8000',
    [Environments.Development]: 'https://dev-api.keyri.co',
    [Environments.Staging]: 'https://stage-api.keyri.co',
    [Environments.Production]: 'https://api.keyri.co',
  };
  baseLink: string;
  apiLinks: Record<string, Function> = {
    me: () => `${this.baseLink}/fingerprint/me`,
    newDevice: () => `${this.baseLink}/fingerprint/new-device`,
    createEvent: () => `${this.baseLink}/fingerprint/event`,
  };
  constructor({ apiKey, environment = Environments.Production }: { apiKey: string; environment?: Environments }) {
    this.apiKey = apiKey;
    if (!this.environmentLinks[environment]) throw new Error('Invalid environment type.');
    this.environment = environment;
    this.baseLink = this.environmentLinks[environment];
  }

  async addNewDevice({ deviceParams, devicehash, cryptocookie }: { deviceParams: Record<string, string>; devicehash: string; cryptocookie: string }) {
    const fingerprintData = await fetch(this.apiLinks.newDevice(), {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devicehash,
        deviceParams,
        cryptocookie,
      }),
    });

    return fingerprintData.json();
  }

  async createEvent(
    { eventType, eventResult, signals = [], userEmail, userId }: IEventParams,
    { devicehash, cryptocookie }: { devicehash: string; cryptocookie: string },
  ) {
    const request = await fetch(this.apiLinks.createEvent(), {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
        devicehash,
        cryptocookie,
      },
      body: JSON.stringify({
        eventType,
        eventResult,
        signals,
        userEmail,
        userId,
      }),
    });

    const requestData = await request.json();

    if (!requestData.result) throw new Error(requestData.error.message);

    return requestData.data;
  }

  async getKnownDeviceData(devicehash: string, cryptocookie: string) {
    const fingerprintData = await fetch(this.apiLinks.me(), {
      method: 'GET',
      headers: {
        'api-key': this.apiKey,
        accept: 'application/json',
        devicehash,
        cryptocookie,
      },
    });

    const body = await fingerprintData.json();
    if (!body.result) throw new Error(body.error.message);
    return body;
  }
}
