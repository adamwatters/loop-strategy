import { Point } from "./App"
interface appStateFields {
  debugMode?: boolean
  perciseArrows?: boolean
  showArrows?: boolean
  drawMode?: boolean
  lastPath?: Point[]
  lastScroll?: number
  lastGesture?: string
  lastSelection?: any[]
  testMode?: boolean
  saving?: boolean
}
class AppState {

  state: appStateFields = {
    debugMode: false,
    perciseArrows: true,
    showArrows: true,
    drawMode: false,
    saving: false,
    testMode: false,
    lastPath: [],
    lastSelection: [],
    lastScroll: 0,
    lastGesture: 'empty'
  }

  private handlers: { (update: appStateFields): void; }[] = []

  getState(): appStateFields {
    return this.state
  }

  setState(update: appStateFields): void {
    let merged = {
      ...this.getState(),
      ...update
    }
    this.handlers.forEach(callback => {
      callback(merged)
    })
    this.state = merged
  }

  addCallback = (callback) => {
    this.handlers.push(callback)
  }
}

export default AppState