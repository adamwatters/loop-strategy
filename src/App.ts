import Canvas from "./Canvas";
import TouchSurface from "./TouchSurface";

interface Body {
  x: number;
  y: number;
  w: number;
  h: number;
  draw: () => void;
  update: () => void;
}

class Box implements Body {
  context: CanvasRenderingContext2D;
  number: number;
  contains: number;
  w = 40;
  h = 40;
  x: number;
  y: number;

  draw() {
    const { x, y, w, h } = this;
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.lineWidth = 10;
    this.context.stroke();
    this.context.fillStyle = "tan";
    this.context.fill();
    this.context.closePath();
    this.context.font = "26px serif";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.number.toString(), x + w / 2, y + h / 2);
    this.context.font = "20px sans-serif";
    this.context.fillStyle = "hotpink";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.contains.toString(), x + w / 2, y - 15);
  }

  update() {}
  constructor(
    context: CanvasRenderingContext2D,
    number: number,
    contains: number,
    x,
    y
  ) {
    this.x = x;
    this.y = y;
    this.number = number;
    this.contains = contains;
    this.context = context;
  }
}
class Prisoner implements Body {
  number: number;
  w = 30;
  h = 30;
  x = 0;
  y = 300;
  state: string = "searching";
  simulation: Simulation;
  target: number | null;
  count: number = 0;

  draw() {
    let mainLayer: CanvasRenderingContext2D = this.simulation.layers[1].context;
    let backLayer: CanvasRenderingContext2D = this.simulation.layers[0].context;
    const { x, y, w, h } = this;
    if (this.target !== this.number) {
      backLayer.beginPath();
      backLayer.arc(x, y, w / 3, 0, 2 * Math.PI);
      backLayer.fillStyle = "rgba(0,0,255,.01)";
      backLayer.fill();
    }
    backLayer.closePath();
    mainLayer.beginPath();
    mainLayer.arc(x, y, w / 2, 0, 2 * Math.PI);
    mainLayer.lineWidth = 10;
    mainLayer.stroke();
    mainLayer.fillStyle =
      this.state === "searching"
        ? "yellow"
        : this.state === "success"
        ? "limegreen"
        : "red";
    mainLayer.fill();
    mainLayer.closePath();
    mainLayer.font = "30px serif";
    mainLayer.fillStyle = "black";
    mainLayer.textAlign = "center";
    mainLayer.textBaseline = "middle";
    mainLayer.fillText(this.number.toString(), x, y);
  }

  update() {
    let step = this.simulation.step;
    if (
      (this.state === "success" || this.state === "failed") &&
      this.target !== null
    ) {
      if (this.x < 1000 + (this.number % this.simulation.columns) * 40) {
        this.x += step;
      }
      if (this.y < 100 + Math.floor(this.number / this.simulation.rows) * 40) {
        this.y += step;
      }
      if (this.y > 100 + Math.floor(this.number / this.simulation.rows) * 40) {
        this.y -= step;
      }
    }
    if (this.state === "searching") {
      if (this.target !== null) {
        let targetBox = this.simulation.boxes[this.target];
        if (targetBox.x === this.x && targetBox.y === this.y) {
          this.count += 1;
          if (targetBox.contains === this.number) {
            this.state = "success";
          }
          if (
            this.count >
            (this.simulation.rows * this.simulation.columns) / 2
          ) {
            console.log("should fail");
            this.state = "failed";
          }
          this.target = targetBox.contains;
        }
        if (targetBox.x > this.x) {
          this.x += step;
          return;
        }
        if (targetBox.x < this.x) {
          this.x -= step;
          return;
        }
        if (targetBox.y > this.y) {
          this.y += step;
          return;
        }
        if (targetBox.y < this.y) {
          this.y -= step;
          return;
        }
      }
    }
  }

  constructor(number: number, simulation: Simulation, target: number) {
    this.simulation = simulation;
    this.target = target;
    this.number = number;
  }
}

class App {
  layers: Canvas[];
  simulation: Simulation;
  addPrisoner: HTMLButtonElement;
  resetPrisoners: HTMLButtonElement;
  newGame: HTMLButtonElement;
  slowButton: HTMLButtonElement;
  fastButton: HTMLButtonElement;
  loopButton: HTMLButtonElement;
  randomButton: HTMLButtonElement;
  touchSurface: TouchSurface;
  rows: number = 6;
  columns: number = 6;

  reset() {
    this.simulation = new Simulation(
      this.layers,
      this.touchSurface,
      this.rows,
      this.columns
    );
    this.layers[0].clear();
    this.resetButtons();
  }

  assignButton(id: string, field: string) {
    this[field] = document.getElementById(id)! as HTMLButtonElement;
  }

  constructor() {
    this.layers = [
      new Canvas(document.getElementById("canvas-0")! as HTMLCanvasElement),
      new Canvas(document.getElementById("canvas-1")! as HTMLCanvasElement),
    ];
    this.touchSurface = new TouchSurface();
    this.assignButton("addPrisonerButton", "addPrisoner");
    this.assignButton("resetPrisonersButton", "resetPrisoners");
    this.assignButton("newGameButton", "newGame");
    this.assignButton("slowButton", "slowButton");
    this.assignButton("fastButton", "fastButton");
    this.assignButton("loopButton", "loopButton");
    this.assignButton("randomButton", "randomButton");

    this.reset();

    this.loopButton.addEventListener("click", () => {
      if (this.simulation.speed === 5) {
        this.simulation.speed = 20;
        this.slowButton.className = "active";
        this.fastButton.className = "inactive";
      }
    });

    this.fastButton.addEventListener("click", () => {
      if (this.simulation.speed === 20) {
        this.simulation.speed = 5;
        this.slowButton.className = "inactive";
        this.fastButton.className = "active";
      }
    });

    this.slowButton.addEventListener("click", () => {
      if (this.simulation.speed === 5) {
        this.simulation.speed = 20;
        this.slowButton.className = "active";
        this.fastButton.className = "inactive";
      }
    });
    this.fastButton.addEventListener("click", () => {
      if (this.simulation.speed === 20) {
        this.simulation.speed = 5;
        this.slowButton.className = "inactive";
        this.fastButton.className = "active";
      }
    });

    this.resetPrisoners.addEventListener("click", () => {
      this.layers[0].clear();
      this.simulation.prisoners = [];
      this.addPrisoner.innerText = `Add Prisoner (${this.simulation.prisoners.length}/${this.simulation.boxes.length})`;
    });
    this.addPrisoner.addEventListener("click", () => {
      this.simulation.addPrisoner();
      this.addPrisoner.innerText = `Add Prisoner (${this.simulation.prisoners.length}/${this.simulation.boxes.length})`;
    });
    this.newGame.addEventListener("click", () => {
      this.simulation.shuttingDown = true;
      this.reset();
    });
  }

  resetButtons() {
    this.addPrisoner.innerText = `Add Prisoner (${this.simulation.prisoners.length}/${this.simulation.boxes.length})`;
    if (this.simulation.mode === "loop") {
      this.slowButton.className = "inactive";
      this.fastButton.className = "active";
    } else {
      this.slowButton.className = "active";
      this.fastButton.className = "inactive";
    }
    if (this.simulation.speed === 5) {
      this.slowButton.className = "inactive";
      this.fastButton.className = "active";
    } else {
      this.slowButton.className = "active";
      this.fastButton.className = "inactive";
    }
  }
}
class Simulation {
  layers: Canvas[];
  prisoners: Prisoner[] = [];
  boxes: Box[];
  rows: number;
  columns: number;
  speed: number = 20;
  shuttingDown: boolean = false;
  touchSurface: TouchSurface;
  selected: number = -1;
  selectedOffset: { x: number; y: number } = { x: 0, y: 0 };
  step: number = 4;
  constructor(
    layers: Canvas[],
    touchSurface: TouchSurface,
    rows: number,
    columns: number
  ) {
    this.rows = rows;
    this.columns = columns;
    this.layers = layers;
    this.touchSurface = touchSurface;
    const templateArray = Array.from(Array(this.rows * this.columns)).map(
      (item, index) => index
    );
    const shuffled: number[] = shuffleArray([...templateArray]);
    this.boxes = templateArray.map((item, index) => {
      let x = index % this.columns;
      let y = Math.floor(index / this.rows);
      return new Box(
        this.layers[1].context,
        index,
        shuffled[index],
        500 + x * 80,
        140 + y * 80
      );
    });
    touchSurface.onStart((event: Event) => {
      let x, y;
      x = (<MouseEvent>event).pageX;
      y = (<MouseEvent>event).pageY;
      this.selected = this.boxes.findIndex((box) => {
        return x > box.x && x < box.x + box.w && y > box.y && y < box.y + box.h;
      });
      let box = this.boxes[this.selected];
      if (this.selected !== -1) {
        this.selectedOffset = { x: x - box.x, y: y - box.y };
      }
    });
    touchSurface.onEnd((event: Event) => {
      this.selected = -1;
    });
    touchSurface.onMove((event: Event) => {
      if (this.selected !== -1) {
        let x, y;
        x = (<MouseEvent>event).pageX - this.selectedOffset.x;
        y = (<MouseEvent>event).pageY - this.selectedOffset.y;
        this.boxes[this.selected].x = Math.ceil(x / this.step) * 4;
        this.boxes[this.selected].y = Math.ceil(y / this.step) * 4;
      }
    });
    this.main();
  }

  addPrisoner() {
    if (this.prisoners.length < this.boxes.length) {
      this.prisoners.push(
        new Prisoner(this.prisoners.length, this, this.prisoners.length)
      );
    }
  }

  main() {
    this.tick();
  }

  tick() {
    if (this.shuttingDown) {
      return;
    } else {
      let bodies = [...this.boxes, ...this.prisoners];
      bodies.forEach((body) => {
        body.update();
      });
      this.layers[1].clear();
      bodies.forEach((body) => {
        body.draw();
      });
      setTimeout(() => {
        this.tick();
      }, this.speed);
    }
  }
}

function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default App;
