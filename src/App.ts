
import Canvas from "./Canvas";
import AppState from "./AppState"

interface Body {
  draw: () => void
  update: () => void
}

class Prisoner implements Body {
  context: CanvasRenderingContext2D
  draw() {

  }
  update(){
    
  }
  constructor(context: CanvasRenderingContext2D) {
    this.context = context
  }
}
class App {
  appState: AppState
  canvas: Canvas
  bodies: Body[]

  constructor() {
    this.appState = new AppState()
    this.canvas = new Canvas(document.getElementById("canvas")! as HTMLCanvasElement)
    this.main()
    this.bodies = [new Prisoner(this.canvas.context)]
  }

  main() {
    this.canvas.context.beginPath()
    this.canvas.context.arc(100,75,30,0,2 * Math.PI)
    this.canvas.context.stroke()

    this.bodies.forEach(body => {
      body.update()
    })

    this.bodies.forEach(body => {
      body.draw()
    })

  }
}

export default App