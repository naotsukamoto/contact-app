export function withTimeout<T>(request: Promise<T>, milliseconds = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("データの読み込みがタイムアウトしました"));
    }, milliseconds);
    request.then(resolve, reject).finally(() => window.clearTimeout(timeout));
  });
}
