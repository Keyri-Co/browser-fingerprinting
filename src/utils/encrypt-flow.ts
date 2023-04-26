import EZCrypto from '@justinwwolcott/ez-web-crypto';
import { proApiPublicKey } from './constants';
import { FingerprintLogEvents, FingerprintLogResult, FingerprintSignals } from '../types';

export async function encryptWithFormattedResponse({
  apiKey,
  serviceEncryptionKey,
  ...data
}: {
  apiKey: string;
  deviceHash: string;
  serviceEncryptionKey: string;
  deviceParams?: Record<string, string>;
  eventType?: FingerprintLogEvents;
  eventResult?: FingerprintLogResult;
  signals?: Array<FingerprintSignals>;
  userId?: string;
  cryptoCookie: string;
}): Promise<{ publicKey: string; ciphertext: string; iv: string; salt: string }> {
  const ezCrypto = new EZCrypto();

  const clientSigningKeys = await ezCrypto.EcMakeSigKeys();
  const timestamp = new Date().getTime();
  const encryptString = timestamp.toString().repeat(2);
  const timestampSignature = await ezCrypto.EcSignData(clientSigningKeys.privateKey as string, btoa(encryptString));

  const plainTextPayload = btoa(
    JSON.stringify({
      ...data,
      timestamp: encryptString,
      timestampSignature,
      clientSigningKey: clientSigningKeys.publicKey,
      serviceEncryptionKey,
      apiKey,
    }),
  );

  const clientEncryptionKeys = await ezCrypto.EcMakeCryptKeys();
  const outputEncrypt = await ezCrypto.HKDFEncrypt(clientEncryptionKeys.privateKey, proApiPublicKey, plainTextPayload);
  return { publicKey: clientEncryptionKeys.publicKey, ...outputEncrypt };
}
