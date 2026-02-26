import liff from "@line/liff";

// ✅ Promise-based singleton — concurrent calls share the same init promise
// so liff.init() is never called twice even if initLiff() is called concurrently.
let _promise: Promise<typeof liff> | null = null;

export function initLiff(): Promise<typeof liff> {
  if (!_promise) {
    _promise = liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(() => liff)
      .catch((err) => {
        _promise = null; // allow retry on failure
        throw err;
      });
  }
  return _promise;
}


