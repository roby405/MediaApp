export class Timer {
  private timerId: number | null = null;

  public run(delayMs: number, callback: () => void) {
    this.clear();
    this.timerId = window.setTimeout(callback, delayMs);
  }

  public clear() {
    if (this.timerId === null)
      return;
    window.clearTimeout(this.timerId);
    this.timerId = null;
  }
}