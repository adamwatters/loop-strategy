import AppState from "./AppState";

class UI {
  penCanvas: HTMLElement;
  drawButton: HTMLElement;
  arrowsButton: HTMLElement;
  pauseButton: HTMLElement;
  arrowsPrecisionButton: HTMLElement;
  // debugModeButton: HTMLElement;
  testsButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;
  logElement: HTMLElement;
  logCount: number;
  
  constructor(appState: AppState) {
    this.drawButton = document.getElementById("draw-button");
    this.arrowsButton = document.getElementById("arrows-button");
    this.pauseButton = document.getElementById("pause-button");
    this.arrowsPrecisionButton = document.getElementById("arrows-precision-button");
    // this.debugModeButton = document.getElementById("debug-mode-button");
    this.saveButton = <HTMLButtonElement> document.getElementById("save-button");
    this.testsButton = <HTMLButtonElement> document.getElementById("tests-button");
    this.logElement = document.getElementById("log");
    this.logCount = 0

    const {debugMode} = appState.getState()
    // initial dom setup
    if (!debugMode) {
      document.body.classList.add('demo')
    }

    appState.addCallback((update) => {
      const {drawMode} = update 
      if(drawMode) {
        this.drawButton.innerText = "Scroll";
      } else {
        this.drawButton.innerText = "Draw";
      }
    })

    // button click handlers
    // this.debugModeButton.onclick = () => {
    //   const {debugMode} = appState.getState()
    //   if (debugMode) {
    //     appState.setState({debugMode: false})
    //     document.body.classList.add('demo')
    //     this.debugModeButton.innerText = "Mode: Demo";
    //   } else {
    //     appState.setState({debugMode: true})
    //     document.body.classList.remove('demo')
    //     this.debugModeButton.innerText = "Mode: Debug";
    //   }
    // };

    this.testsButton.onclick = () => {
      appState.setState({testMode: true, drawMode: false})
    };

    this.saveButton.onclick = () => {
      const {lastPath} = appState.getState()
      appState.setState({saving: true, drawMode: false})
    };

    this.arrowsPrecisionButton.onclick = () => {
      const {perciseArrows} = appState.getState()
      if (perciseArrows) {
        appState.setState({perciseArrows: false})
        this.arrowsPrecisionButton.innerText = "Arrow Precision: Low";
      } else {
        appState.setState({perciseArrows: true})
        this.arrowsPrecisionButton.innerText = "Arrow Precision: High";
      }
    };

    this.arrowsButton.onclick = () => {
      const {showArrows} = appState.getState()
      if (showArrows) {
        appState.setState({showArrows: false})
        this.arrowsButton.innerText = "Show Arrows";
      } else {
        appState.setState({showArrows: true})
        this.arrowsButton.innerText = "Hide Arrows";
      }
    };

    this.drawButton.onclick = () => {
      const {drawMode} = appState.getState()
      if (!drawMode) {
        appState.setState({drawMode: true})
        this.drawButton.innerText = "Scroll";
      } else {
        appState.setState({drawMode: false})
        this.drawButton.innerText = "Draw";
      }
    };
  }

  log(text: string) {
    let logMessage = document.createElement('div')
    logMessage.innerText = `${this.logCount} - ${text}`
    this.logCount ++
    this.logElement.insertBefore(logMessage, this.logElement.childNodes[2])
  }
}

export default UI