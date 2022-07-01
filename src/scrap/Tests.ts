import base from "./scrap/AirTable"
import { Point } from "./App"
import AppState from "./AppState"
import Script from "./Script"

const classifications = ["circle (select)", "line-through (select)", "squiggle (strike)", "double-back (strike)", "arrow", "??? (ignore)"]
class Tests {
  testsConsole: HTMLElement
  closeButton: HTMLElement
  tests: any[] = []

  constructor(appState: AppState, script: Script, handlePath: (path: Point[]) => any){
    this.testsConsole = document.getElementById('tests-console')
    this.closeButton = document.getElementById('tests-console_close')

    this.closeButton.onclick = () => {
      appState.setState({testMode: false})
    }

    let testRecords = []
    base('test-cases').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 100,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
          testRecords.push(record)
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, (err) => {
        if (err) { console.error(err); return; }
        let processedRecords = testRecords.map(record => {
          return {
            "description": record.fields["description"],
            "scroll": record.fields["scroll"],
            "windowHeight": record.fields["windowHeight"],
            "windowWidth": record.fields["windowWidth"],
            "gesture": record.fields["gesture"],
            "expected-gesture": record.fields["expected-gesture"],
            "path": JSON.parse(record.fields["path"]),
            "expected-end": JSON.parse(record.fields["expected-end"]),
            "expected-start": JSON.parse(record.fields["expected-start"]),
            "selection": JSON.parse(record.fields["selection"]),
          }
        })
        processedRecords.forEach((test, index) => {
          let button = document.createElement('button')
          let container = document.createElement('div')
          container.classList.add("tests-console-section")
          button.classList.add("test-button")
          button.innerText = `test ${index + 1}`
          button.onclick = () => {
            appState.setState({lastPath: test.path, lastScroll: test.scroll})
            // document.body.style.transform = "scale(.4)"
            // document.body.style.width = `${test.windowWidth}px`
            // script.scrollElement.style.height = `${test.windowHeight}px`
            script.scrollTo(test.scroll)
            handlePath(test.path)
          }
          let sizeText = document.createElement('div')
          sizeText.innerText = `width: ${test.windowWidth}px
                            height: ${test.windowHeight}px
                          `
          let selectionText = document.createElement('div')
          selectionText.innerText = `EXPECTED:
                                gesture: ${test["expected-gesture"]}
                                start: ${test["expected-start"].word || test["expected-start"].elementID}
                                end: ${test["expected-end"].word || test["expected-end"].elementID}
                          `
          container.appendChild(button)
          container.appendChild(sizeText)
          container.appendChild(selectionText)
          this.testsConsole.appendChild(container)
        })
    });

    appState.addCallback(state => {
      if (state.testMode) {
        this.testsConsole.classList.add("active");
      } else {
        this.testsConsole.classList.remove("active");
      }
    })
  }
}


export default Tests