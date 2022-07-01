
import AppState from "./AppState";
import Canvas from "./Canvas"
import Script from "./Script";
interface Point {
  x;
  y;
}

interface PenCanvasProps {
  points: Point[];
}
class PenCanvas extends Canvas{
  props: PenCanvasProps
  appState: AppState
  script: Script
  isFading: boolean = false;

  constructor(props: PenCanvasProps, appState: AppState, script: Script) {
    super(<HTMLCanvasElement> document.getElementById("pen-canvas"))
    this.props = props
    this.appState = appState
    this.script = script
    // have to clear the rect to make the canvas transparent
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineCap = "round";
    this.context.lineJoin = "round";
    let color = "blue"
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.context.lineWidth = 5
    // start the animation loop
    this.animate.bind(this)()
  }

  // should really only use animate to fade out...
  fadeCounter = 25
  animate() {
    const {points} = this.props
    const {saving, lastPath, lastScroll, testMode} = this.appState.getState()
    if(saving || testMode) {
      let offset = 2 * (this.script.scrollY() - lastScroll)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.globalAlpha = 1
      lastPath.forEach((point, i) => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (i === 1) {
          this.context.beginPath();
          this.context.moveTo(point.x, point.y - offset);
        }
        if (i > 1) {
          let previous =  lastPath[i-1]
          const xc = (point.x + previous.x) / 2;
          const yc = (point.y - offset + previous.y - offset) / 2;
          this.context.quadraticCurveTo(previous.x, previous.y - offset, xc, yc);
          this.context.stroke()
        }
      })
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.globalAlpha = this.fadeCounter / 25
      if (points.length > 0) {
        points.forEach((point, i) => {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          if (i === 1) {
            this.context.beginPath();
            this.context.moveTo(point.x, point.y);
          }
          if (i > 1) {
            let previous =  points[i-1]
            const xc = (point.x + previous.x) / 2;
            const yc = (point.y + previous.y) / 2;
            this.context.quadraticCurveTo(previous.x, previous.y, xc, yc);
            this.context.stroke()
          }
        })
      }
  
      if(points.length === 0) {
        // reset state
        this.isFading = false
        this.fadeCounter = 25
      } else {
        if (this.fadeCounter > 0 && this.isFading) {
          this.fadeCounter = this.fadeCounter - 1
        }
      }
    }
    setTimeout(this.animate.bind(this), 20);
  }

  triggerFade(delay?: number) {
    setTimeout(() => {
      this.isFading = true
    }, delay || 1)
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

export default PenCanvas