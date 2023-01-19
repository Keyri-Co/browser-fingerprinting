export function objectToCanonicalString(object: Record<string, string>): string {
  let result = '';
  for (const objectKey of Object.keys(object).sort()) {
    const component = object[objectKey];
    result += `${result ? '|' : ''}${objectKey.replace(/([:|\\])/g, '\\$1')}:${component}`;
  }
  return result;
}

export const unknownStringValue = 'unknown';
export function paramToString(value: any): string {
  if (typeof value === 'undefined') return unknownStringValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return value.toString();
}