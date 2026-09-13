export class Timer {
  private timerId: number | null = null;

  public run(delayMs: number, callback: () => void) {
    this.clear();
    this.timerId = setTimeout(callback, delayMs);
  }

  public clear() {
    if (this.timerId === null)
      return;
    clearTimeout(this.timerId);
    this.timerId = null;
  }
}