class TouchSurface {
  touchElement: HTMLElement;
  constructor() {
    this.touchElement = document.getElementById("touch-surface")!;
  }

  onStart(handler: (e: Event) => void) {
    for (const ev of ["touchstart", "mousedown"]) {
      this.touchElement.addEventListener(ev, handler);
    }
  }

  onMove(handler: (e: Event) => void) {
    for (const ev of ["touchmove", "mousemove"]) {
      this.touchElement.addEventListener(ev, handler);
    }
  }

  onEnd(handler: (e: Event) => void) {
    for (const ev of ["touchend", "mouseup"]) {
      this.touchElement.addEventListener(ev, handler);
    }
  }
  doOverlap(l1, r1, l2, r2) {
    // To check if either rectangle is actually a line
    // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}

    if (l1.x == r1.x || l1.y == r1.y || l2.x == r2.x || l2.y == r2.y) {
      // the line cannot have positive overlap
      return false;
    }

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
      // console.log("to left")
      return false;
    }

    // If one rectangle is above other
    // signs flipped because coordinates are top down
    if (r1.y <= l2.y + 10 || r2.y <= l1.y + 10) {
      // console.log("above")
      return false;
    }

    return true;
  }
}

export default TouchSurface;
