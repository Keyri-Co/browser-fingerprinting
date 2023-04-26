import { Environments, IEventParams } from './types';
import { encryptWithFormattedResponse } from './utils/encrypt-flow';

export class FingerprintApi {
  apiKey: string;
  serviceEncryptionKey: string;
  environment: Environments;

  environmentLinks = {
    [Environments.Local]: 'http://localhost:8000',
    [Environments.Development]: 'https://dev-api.keyri.co',
    [Environments.Staging]: 'https://staging.keyri.co',
    [Environments.Production]: 'https://api.keyri.co',
  };
  baseLink: string;
  apiLinks: Record<string, Function> = {
    me: () => `${this.baseLink}/fingerprint/me`,
    newDevice: () => `${this.baseLink}/fingerprint/new-device`,
    createEvent: () => `${this.baseLink}/fingerprint/event`,
  };
  constructor({
    apiKey,
    serviceEncryptionKey = '',
    environment = Environments.Production,
  }: {
    apiKey: string;
    serviceEncryptionKey: string;
    environment?: Environments;
  }) {
    this.apiKey = apiKey;
    if (!this.environmentLinks[environment]) throw new Error('Invalid environment type.');
    this.serviceEncryptionKey = serviceEncryptionKey;
    this.environment = environment;
    this.baseLink = this.environmentLinks[environment];
  }

  async addNewDevice({ deviceParams, deviceHash, cryptoCookie }: { deviceParams: Record<string, string>; deviceHash: string; cryptoCookie: string }) {
    if (!this.apiKey || !this.serviceEncryptionKey) throw new Error('Invalid keys');
    const { ciphertext, publicKey, iv, salt } = await encryptWithFormattedResponse({
      apiKey: this.apiKey,
      serviceEncryptionKey: this.serviceEncryptionKey,
      deviceParams,
      deviceHash,
      cryptoCookie,
    });

    const fingerprintData = await fetch(this.apiLinks.newDevice(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientEncryptionKey: publicKey,
        encryptedPayload: ciphertext,
        iv,
        salt,
      }),
    });

    return fingerprintData.json();
  }

  async createEvent(
    { eventType, eventResult, signals = [], userId }: IEventParams,
    { deviceHash, cryptoCookie }: { deviceHash: string; cryptoCookie: string },
  ) {
    if (!this.apiKey || !this.serviceEncryptionKey) throw new Error('Invalid keys');
    const { ciphertext, publicKey, iv, salt } = await encryptWithFormattedResponse({
      apiKey: this.apiKey,
      serviceEncryptionKey: this.serviceEncryptionKey,
      eventType,
      eventResult,
      signals,
      userId,
      deviceHash,
      cryptoCookie,
    });

    const request = await fetch(this.apiLinks.createEvent(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientEncryptionKey: publicKey,
        encryptedPayload: ciphertext,
        iv,
        salt,
      }),
    });

    const requestData = await request.json();

    return requestData;
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
