/** Corre após o próximo paint — liberta o main thread no carregamento inicial. */
export function runAfterNextPaint(fn: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
