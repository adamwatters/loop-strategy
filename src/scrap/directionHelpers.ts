export function directionFromPoints(a, b) {
  let changeX = a.x - b.x
  let changeY = a.y - b.y
  if (Math.abs(changeX) >= Math.abs(changeY)) {
    if (changeX > 0) {
      return "e"
    } else {
      return "w"
    }
  } else {
    if (changeY > 0) {
      return "s"
    } else {
      return "n"
    }
  }
}

export function preciseDirectionFromPoints(a,b) {
  let changeX = a.x - b.x
  let changeY = a.y - b.y
  let angle = Math.atan2(changeY, changeX)*180/Math.PI
  if (angle <=  -157.5 || angle > 157.5) {
    return "W"
  }
  if (angle > -157.5 && angle <= -112.5) {
    return "Nw"
  }
  if (angle > -112.5 && angle <= -67.5) {
    return "N"
  }
  if (angle > -67.5 && angle <= -22.5) {
    return "Ne"
  }
  if (angle > -22.5 && angle <= 22.5) {
    return "E"
  }
  if (angle > 22.5 && angle <= 67.5) {
    return "Se"
  }
  if (angle > 67.5 && angle <= 112.5) {
    return "S"
  }
  if (angle > 112.5 && angle <= 157.5) {
    return "Sw"
  }
  return ""
}

export function directionChangeType(first, second) {
  switch (first) {
    case 'n':
      switch (second) {
        case 'e':
          return 'cw'
        case 'w':
          return 'ccw'
        case 's':
          return 'r'
      }
    case 'e':
      switch (second) {
        case 's':
          return 'cw'
        case 'n':
          return 'ccw'
        case 'w':
          return 'r'
      }
    case 's':
      switch (second) {
        case 'w':
          return 'cw'
        case 'e':
          return 'ccw'
        case 'n':
          return 'r'
      }
    case 'w':
      switch (second) {
        case 'n':
          return 'cw'
        case 's':
          return 'ccw'
        case 'e':
          return 'r'
      }
  }
}

export function nextDirection(direction, loopDirection) {
  if (loopDirection === "cw") {
    switch (direction) {
      case 'n':
        return 'e'
      case 'e':
        return 's'
      case 's':
        return 'w'
      case 'w':
        return 'n'
    }
  } else {
    switch (direction) {
      case 'n':
        return 'w'
      case 'w':
        return 's'
      case 's':
        return 'e'
      case 'e':
        return 'n'
    }
  }
}