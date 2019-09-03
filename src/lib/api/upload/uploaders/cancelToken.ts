export default function cancelToken() {
  let cancel;
  const token = new CancelToken(function executor(c) {
    cancel = c;
  });

  return {
    token: token,
    cancel: cancel,
  };
}

class CancelToken {
  public reason: object;
  public promise: any;

  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    this.reason = null;

    const token = this;
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }

      token.reason = { message: message };
      resolvePromise(token.reason);
    });
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
}
