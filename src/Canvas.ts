class Canvas {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas
    this.context = canvas.getContext("2d")!;
    this.canvas.width = this.canvasWidth()
    this.canvas.height = this.canvasHeight()
    // window resize listener to reset canvases
    let isResizing = false
    let lastResizeTimeout // closure to keep track of last timeout so it can be canceled
    window.addEventListener('resize', e => {
      if(isResizing) {
        clearTimeout(lastResizeTimeout)
        lastResizeTimeout = setTimeout(() => {
          isResizing = false
          this.resize(this.canvasWidth(), this.canvasHeight())
        }, 100)
      } else {
        isResizing = true
      }
    })
  }

  canvasWidth() { return window.innerWidth }
  canvasHeight() { return window.innerHeight }

  resize(width: number, height: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export default Canvas