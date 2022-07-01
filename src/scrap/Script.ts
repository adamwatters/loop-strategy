class Script { 
  pagesOnMarkedScript: Element[];
  pagesOnCleanScript: Element[];
  scrollElement: HTMLElement = document.getElementById("script-wrapper")
  constructor() {
    this.pagesOnMarkedScript = Array.from(document.querySelectorAll("#visible-script .pdf_page"));
    this.pagesOnCleanScript = Array.from(document.querySelectorAll("#hidden-script .pdf_page"));
  }

  scrollTo(destination: number) {
    this.scrollElement.scrollTop = destination
  }

  scrollY() {
    return this.scrollElement.scrollTop
  }

  findClickedWord(x, y) {
    let elementsToCheck = this.getVisibleElements().clean
    let maybeClickedElement = elementsToCheck.find(element => {
      let box = element.getBoundingClientRect()
      return x > box.left && x < box.right && y > box.top && y < box.bottom
    })
    if(maybeClickedElement) {
      var clickedElement = <HTMLElement> maybeClickedElement
      var child = clickedElement.childNodes[0]
      var words = child.textContent.split(' ');
      var start = 0;
      var end = 0;
      let clickedWord = words.find(word => {
        var range = document.createRange();
        range.setStart(child, start);
        end = start+word.length;
        range.setEnd(child, end);
        var rects = range.getClientRects();
        var rectWasClicked = isClickInRects(rects);
        start = end + 1;
        return rectWasClicked
      })
      if (clickedWord) {
        return {elementID: clickedElement.id, word: clickedWord, wordPosition: start }
      } else {
        return {elementID: clickedElement.id }
      }
    }
    
    function isClickInRects(rects) {
        for (var i = 0; i < rects.length; ++i) {
            var r = rects[i]
            if (r.left<x && r.right>x && r.top<y && r.bottom>y) {            
                return r;
            }
        }
        return false;
    }
  }

  // this would be better named "getElementsOnVisiblePages"
  getVisibleElements() {
    let visibleElementsMarked = []
    let visibleElementsClean = []
    this.pagesOnMarkedScript.forEach(page => {
      if (isElementInView(page)) {
        visibleElementsMarked = [...visibleElementsMarked, ...Array.from(page.children)]
      }
    })
    this.pagesOnCleanScript.forEach(page => {
      if (isElementInView(page)) {
        visibleElementsClean = [...visibleElementsClean, ...Array.from(page.children)]
      }
    })
    return {marked: visibleElementsMarked, clean: visibleElementsClean}
  }
}

function isElementInView(myElement) {
  var bounding = myElement.getBoundingClientRect();
  var myElementHeight = myElement.offsetHeight;
  var myElementWidth = myElement.offsetWidth;
  var bounding = myElement.getBoundingClientRect();

  if (bounding.top >= -myElementHeight 
      && bounding.left >= -myElementWidth
      && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth
      && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight) {
      return true
  } else {
      return false
  }
}

export default Script