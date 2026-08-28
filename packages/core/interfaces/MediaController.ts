export interface MediaController {
  play: () => Promise<void> | void;
  pause: () => Promise<void> | void;
  seek: (val: number) => Promise<void> | void;
  getCurrentTime: () => Promise<number> | number;
}

