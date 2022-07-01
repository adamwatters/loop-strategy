import { Point } from "./App";
import AppState from "./AppState";
import Canvas from "./Canvas";

class DebugCanvas extends Canvas {
  appState: AppState
  constructor(appState: AppState) {
    super(<HTMLCanvasElement> document.getElementById("debug-canvas"))
    this.appState = appState
    // have to clear the rect to make the canvas transparent
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
  }

  drawBoard() {
    this.context.lineWidth = 4;
    this.context.strokeStyle = "rgba(2,7,159, 0.2)";
    for (var x = 0; x < this.canvas.width; x += 100) {
      for (var y = 0; y < this.canvas.height; y += 100) {
        this.context.strokeRect(x, y, 100, 100);
      }
    }
  }

  drawTriangle(a: Point, b: Point, c: Point, color: string = "black") {
    this.context.beginPath();
    this.context.moveTo(a.x, a.y);
    this.context.lineTo(b.x, b.y);
    this.context.lineTo(c.x, c.y);
    this.context.fillStyle = color
    this.context.fill();
  }

  drawBoxFromCorners(topLeft: {x,y}, bottomRight: {x,y}) {
    this.context.strokeStyle = "rgba(0, 255, 255, 0.9)";
    this.context.strokeRect(topLeft.x,topLeft.y,bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }

  drawBox(x, y, width, height) {
    this.context.strokeStyle = "rgba(2, 255, 2, 0.8)";
    this.context.strokeRect(x,y,width,height);
  }

  drawDirectionArrowForPoint(point){
    let {perciseArrows, showArrows} = this.appState.getState()
    let change = [0,0]
    let color = "black"
    if (point.direction) {
      if(perciseArrows) {
        switch (point.preciseDirection) {
          case 'N':
            change = [0, -50]
            color = "red"
            break;
          case 'Ne':
            change = [35, -35]
            color = "orange"
            break;
          case 'E':
            change = [50, 0]
            color = "yellow"
            break;
          case 'Se':
            change = [35, 35]
            color = "green"
            break;
          case 'S':
            change = [0, 50]
            color = "lightblue"
            break;
          case 'Sw':
            change = [-35, 35]
            color = "darkblue"
            break;
          case 'W':
            change = [-50, 0]
            color = "purple"
            break;
          case 'Nw':
            change = [-35, -35]
            color = "cyan"
            break;
        }
      } else {
        switch (point.direction) {
          case 'n':
            change = [0, -50]
            color = "cyan"
            break;
          case 'e':
            change = [50, 0]
            color = "green"
            break;
          case 's':
            change = [0, 50]
            color = "red"
            break;
          case 'w':
            change = [-50, 0]
            color = "pink"
            break;
        }
      }
      if (showArrows) {
        this.drawArrow(point.x, point.y, point.x + change[0], point.y + change[1], 5, color)
      }
    }
  }

  drawArrow(fromx, fromy, tox, toy, arrowWidth, color){
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
  
    this.context.save();
    this.context.strokeStyle = color;
  
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
    this.context.lineWidth = arrowWidth;
    this.context.stroke();
  
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    this.context.beginPath();
    this.context.moveTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
  
    //path from the side point of the arrow, to the other side point
    this.context.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
  
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    this.context.lineTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
  
    //draws the paths created above
    this.context.stroke();
    this.context.restore();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard()
  }

}

export default DebugCanvas