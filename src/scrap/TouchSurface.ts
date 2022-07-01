class TouchSurface {
  touchElement: HTMLElement

  constructor(appState){
    this.touchElement = document.getElementById('touch-surface')
    appState.addCallback(state => {
      if (state.drawMode) {
        this.touchElement.classList.add("active");
      } else {
        this.touchElement.classList.remove("active");
      }
    })
  }

  onStart(handler: (e: Event) => void) {
    for (const ev of ["touchstart", "mousedown"]) {
      this.touchElement.addEventListener(ev, handler)
    }
  }

  onMove(handler: (e: Event) => void) {
    for (const ev of ["touchmove", "mousemove"]) {
      this.touchElement.addEventListener(ev, handler)
    }
  }

  onEnd(handler: (e: Event) => void) {
    for (const ev of ["touchend", "mouseup"]) {
      this.touchElement.addEventListener(ev, handler)
    }
  }

}

export default TouchSurface