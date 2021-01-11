export class TicToc2 {
  private readonly ticAt: number;
  private lastToc: number;

  constructor(private now = () => Date.now()) {
    this.ticAt = this.lastToc = now();
  }

  toc() {
    const now = this.now();
    const sinceLast = now - this.lastToc;
    this.lastToc = now;
    return sinceLast;
  }
}
