import Script from "./Script"
import base from "./scrap/AirTable"

const classifications = ["circle (select)", "line-through (select)", "squiggle (strike)", "double-back (strike)", "arrow", "??? (ignore)"]
class Save {
  closeButton: HTMLElement
  saveForm: HTMLElement
  saveFormContainer: HTMLElement
  script: Script
  submitButton: HTMLElement
  classificationButtons: HTMLElement
  selectedClassification?: String
  intendedSelectionStartElement: HTMLElement
  intendedSelectionEndElement: HTMLElement
  intendedSelectionStart?: any
  intendedSelectionEnd?: any

  constructor(appState, script){
    this.script = script
    this.saveFormContainer = document.getElementById('save-form-container')
    this.saveForm = document.getElementById('save-form')
    this.closeButton = document.getElementById('save-form_close')
    this.submitButton = document.getElementById('save-form_submit')
    this.classificationButtons = document.getElementById('save-form_classifications')
    this.intendedSelectionStartElement = document.getElementById('intendedSelectionStart')
    this.intendedSelectionEndElement = document.getElementById('intendedSelectionEnd')
    this.selectedClassification = null
    this.intendedSelectionStart = null
    this.intendedSelectionEnd = null
    this.saveFormContainer.onclick = (e) => {
      if (e.clientY < window.innerHeight - this.saveForm.getBoundingClientRect().height) {
        let selected = this.script.findClickedWord(e.clientX, e.clientY)
        if (selected) {
          if(this.intendedSelectionStart == null) {
            this.intendedSelectionStartElement.innerText = selected.word ?? selected.elementID
            this.intendedSelectionStart = selected
          } else {
            if(this.intendedSelectionEnd == null) {
              this.intendedSelectionEndElement.innerText = selected.word ?? selected.elementID
              this.intendedSelectionEnd = selected
            } else {
              this.intendedSelectionEndElement.innerText = "__________"
              this.intendedSelectionStartElement.innerText = selected.word ?? selected.elementID
              this.intendedSelectionStart = selected
              this.intendedSelectionEnd = null
            }
          }
        }
      }
    }
    classifications.forEach(classification => {
      let button = document.createElement("button")
      button.innerText = classification
      button.classList.add("classification-button")
      button.onclick = () => {
        if (this.selectedClassification === classification) {
          // button.classList.remove("selected")
          this.selectedClassification = null
        } else {
          this.selectedClassification = classification
          button.classList.add("selected")
          this.classificationButtons.childNodes.forEach(c => {
            let node = <HTMLElement> c
            if (node.innerText !== classification) {
              node.classList.remove("selected")
              // button.classList.remove("selected")
            }
          })
        }
      }
      this.classificationButtons.appendChild(button)
    })
    this.submitButton.addEventListener('click', () => {
      let {lastPath, lastScroll, lastGesture, lastSelection} = appState.getState()
      let nameInput = <HTMLInputElement> document.getElementById('save-form_name')
      let noteInput = <HTMLTextAreaElement> document.getElementById('save-form_note')
      base('test-cases').create([
        {
          "fields": {
            "time": Date().toString(),
            "name": nameInput.value,
            "note": noteInput.value,
            "expected-gesture": this.selectedClassification,
            "expected-start": JSON.stringify(this.intendedSelectionStart),
            "expected-end": JSON.stringify(this.intendedSelectionEnd),
            "gesture": lastGesture,
            "selection": JSON.stringify(lastSelection),
            "path": JSON.stringify(lastPath),
            "scroll": lastScroll,
            "windowWidth": window.innerWidth,
            "windowHeight": window.innerHeight,
          }
        },
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      });
      appState.setState({
        saving: false,
        drawMode: true
      })
    })

    this.closeButton.addEventListener('click', () => {
      appState.setState({
        saving: false,
        drawMode: false
      })
    })

    appState.addCallback(state => {
      if (state.saving) {
        this.saveFormContainer.classList.add("active");
      } else {
        this.saveFormContainer.classList.remove("active");
      }
    })
  }
}


export default Save