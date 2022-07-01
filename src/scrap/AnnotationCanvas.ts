import { PathMetadata } from "../App";
import Canvas from "../Canvas"

// need to seperate arrow drawing and arrow data
interface Arrow {
  color?: string,
  pathMetadata: PathMetadata,
  scrollOffset?: number
}

interface Highlight {
  el: HTMLElement
  range?: {start: number, finish: number}
  color?: string
}

interface Box {
  color?: string,
  x: number,
  y: number,
  w: number,
  h: number
}

class AnnotationCanvas extends Canvas{
  isFading: boolean = false;
  isArrow: boolean = false;
  scriptEl = document.getElementById("script-wrapper")
  scrollPosition: number = -1
  arrows: Arrow[] = []
  highlightsData: Highlight[] = []
  boxes: Box[] = []

  constructor() {
    super(<HTMLCanvasElement> document.getElementById("annotation-canvas"))
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

  addHighlight(highlight: Highlight) {
    this.highlightsData.push(highlight)
    // save the offset based on scroll position when arrow is created
    let offset = this.scriptEl.scrollTop * 2
    if (!highlight.range) {
      let boundingRect = highlight.el.getBoundingClientRect()
      this.boxes.push({
        color: highlight.color,
        x: boundingRect.x * 2,
        y: boundingRect.y * 2 + offset,
        w: boundingRect.width * 2,
        h: boundingRect. height * 2
      })
    }
  }

  addArrow(arrow: Arrow) {
    // save the offset based on scroll position when arrow is created
    let offset = this.scriptEl.scrollTop * 2
    this.arrows.push({
      scrollOffset: offset,
      pathMetadata: arrow.pathMetadata,
      color: arrow.color ?? "blue"
    })
  }

  arrowsLengthCache = 0
  boxesLengthCache = 0
  animate() {
    let arrowAdded = this.arrowsLengthCache !== this.arrows.length
    if (arrowAdded) {
      this.arrowsLengthCache = this.arrows.length
    }
    let boxAdded = this.boxesLengthCache !== this.boxes.length
    if (boxAdded) {
      this.boxesLengthCache = this.boxes.length
    }
    let scrollPosition = Math.round(this.scriptEl.scrollTop)
    let needsScrollUpdate = true
    if (needsScrollUpdate || arrowAdded || boxAdded) {
      let currentScrollOffset = scrollPosition * 2
      this.scrollPosition = scrollPosition
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // boxes
      this.boxes.forEach(box => {
        this.context.fillStyle = box.color
        this.context.fillRect(
          box.x,
          box.y - currentScrollOffset,
          box.w,
          box.h
        );
      })

      //arrows
      this.arrows.forEach(arrow => {
        let {start, end} = arrow.pathMetadata
        let offset = arrow.scrollOffset - currentScrollOffset
        this.context.beginPath();
        this.context.moveTo(start.x, start.y + offset);
        let controlX = start.x + 20
        let controlY = start.y + 50
        this.context.strokeStyle = arrow.color
        // this.context.quadraticCurveTo(controlX, controlY + offset, arrow.end.x, arrow.end.y + offset);
        this.context.lineTo(end.x, end.y + offset);
        this.context.stroke();

        // tip
        let WIDTH = 20
        let HEIGHT = 30
        let TIP_OFFSET = 5
        let changeX = end.x - start.x
        let changeY = end.y - start.y
        let angle = Math.atan2(changeY, changeX) - (Math.PI / 2)
        let tipX = (0 * Math.cos(angle)) - (TIP_OFFSET * Math.sin(angle))
        let tipY = (0 * Math.sin(angle)) + (TIP_OFFSET * Math.cos(angle)) + offset
        let corner1X = (-1 * WIDTH * Math.cos(angle)) - (-1 * HEIGHT * Math.sin(angle))
        let corner1Y = (-1 * WIDTH * Math.sin(angle)) + (-1 * HEIGHT * Math.cos(angle)) + offset
        let corner2X = (WIDTH * Math.cos(angle)) - (-1 * HEIGHT * Math.sin(angle))
        let corner2Y = (WIDTH * Math.sin(angle)) + (-1 * HEIGHT * Math.cos(angle)) + offset
        this.context.beginPath();
        this.context.moveTo(end.x + tipX, end.y + tipY);
        this.context.lineTo(end.x + corner1X, end.y + corner1Y);
        this.context.lineTo(end.x + corner2X, end.y + corner2Y);
        this.context.fillStyle = arrow.color
        this.context.fill();

      })

      requestAnimationFrame(this.animate.bind(this));
    } else {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

export default AnnotationCanvas