export function calcHypotenuse(a, b) {
  return Math.sqrt(a * a + b * b);
}

export function overlaps( wordTopLeft, wordBottomRight, selectionTopLeft,  selectionBottomRight): {horizontal: number, vertical: number} {
  
  // To check if either rectangle is actually a line
  // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}
  let miss = {
    horizontal: 0,
    vertical: 0
  };

  if (wordTopLeft.x == wordBottomRight.x || wordTopLeft.y == wordBottomRight.y ||
    selectionTopLeft.x == selectionBottomRight.x || selectionTopLeft.y == selectionBottomRight.y) {
      // the line cannot have positive overlap
      return miss;
  }

  // If one rectangle is on left side of other
  if (wordBottomRight.x <= selectionTopLeft.x || selectionBottomRight.x <= wordTopLeft.x) {
    // console.log("to left")
      return miss;
  }

  // If one rectangle is above other
  // signs flipped because coordinates are top down
  if (wordBottomRight.y <= selectionTopLeft.y || selectionBottomRight.y <= wordTopLeft.y ) {
    console.log("in miss Y")
    return miss;
  }

  let xValues = [wordTopLeft.x, wordBottomRight.x, selectionTopLeft.x, selectionBottomRight.x].sort(sortAscending)
  let yValues = [wordTopLeft.y, wordBottomRight.y, selectionTopLeft.y, selectionBottomRight.y].sort(sortAscending)

  let wordWidth = wordBottomRight.x - wordTopLeft.x
  let wordHeight = wordBottomRight.y - wordTopLeft.y 

  let overlapWidth = xValues[2] - xValues[1]
  let overlapHeight = yValues[2] - yValues[1]

  return {
    horizontal: overlapWidth / wordWidth,
    vertical: overlapHeight / wordHeight
  };
}

function sortAscending(a,b) {
  if (a > b) {
    return 1;
  } else if (b > a) {
    return -1;
  } else {
    return 0;
  }
}

export function doOverlap( l1,  r1,  l2,  r2) {
  
  // To check if either rectangle is actually a line
  // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}

  if (l1.x == r1.x || l1.y == r1.y ||
  l2.x == r2.x || l2.y == r2.y) {
      // the line cannot have positive overlap
      return false;
  }

  // If one rectangle is on left side of other
  if (l1.x >= r2.x || l2.x >= r1.x) {
    // console.log("to left")
      return false;
  }

  // If one rectangle is above other
  // signs flipped because coordinates are top down
  if (r1.y <= l2.y + 10 || r2.y <= l1.y + 10) {
    // console.log("above")
      return false;
  }

  return true;
}

export function insertBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}