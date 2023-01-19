export type MaybePromise<T> = Promise<T> | T;

export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith));
}

export function suppressUnhandledRejectionWarning(promise: PromiseLike<unknown>): void {
  promise.then(undefined, () => undefined);
}
