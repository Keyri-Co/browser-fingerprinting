export function countTruthy(values: any): number {
  return values.reduce((sum: number, value: any) => sum + (value ? 1 : 0), 0);
}

export function areSetsEqual(set1: Set<unknown>, set2: Set<unknown>): boolean {
  if (set1 === set2) {
    return true;
  }
  if (set1.size !== set2.size) {
    return false;
  }

  if (set1.values) {
    for (let iter = set1.values(), step = iter.next(); !step.done; step = iter.next()) {
      if (!set2.has(step.value)) {
        return false;
      }
    }
    return true;
  } else {
    // An implementation for browsers that don't support Set iterators
    let areEqual = true;
    set1.forEach((value) => {
      if (areEqual && !set2.has(value)) {
        areEqual = false;
      }
    });
    return areEqual;
  }
}

export function toFloat(value: number | string): number {
  if (typeof value === 'number') return value;
  return parseFloat(value);
}

export function replaceNaN(value: any, replacement: any) {
  return typeof value === 'number' && isNaN(value) ? replacement : value;
}

export function toInt(value: number | string): number {
  if (typeof value === 'number') return value;
  return parseInt(value);
}

export function round(value: number, base = 1): number {
  if (Math.abs(base) >= 1) {
    return Math.round(value / base) * base
  } else {
    // Sometimes when a number is multiplied by a small number, precision is lost,
    // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
    const counterBase = 1 / base
    return Math.round(value * counterBase) / counterBase
  }
}

export function assertEvalToString(value: any): boolean {
  return value === eval.toString().length;
}
