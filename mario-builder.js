alert("Very early prototype. Rightclick a cell, and while right-click is pressed, begin left-click dragging to draw. Release to confirm.")
let marioBuilderEvent;
var pasteChar = "█";
let ctrl = false;
let mouseDown = false;
let firstClick;
let mX, mY, posX, posY;
w.protectSelect.tiled = false;

class MaterialLayer {
  constructor(string) {

    this.begin = string[0];
    this.middle = string[1];
    this.end = string[2];
    this.single = string[3];
    this.subSurface = string[4];
  }
}

let bush = new MaterialLayer("╭◠╮");
let grass = new MaterialLayer("▅█▆▄▓");
let material = grass;

const paste = (pasteString) => {
  event_mouseup(marioBuilderEvent);
  elm.textInput.value = pasteString;
};

w.protectSelect.onselection((start, end, width, height) => {
  let pasteString = "";
  protectSelectionCancel();
  w.protectSelect.stopSelectionUI(true);

  let [X, Y, x, y] = start;
  let [a, b, c, d] = end;
  let topRight = [a, Y, c, y];
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (width > 1 && h == 0) {
        if (w == 0 && h == 0) {
          //handle beginning

          pasteChar = isEmptyCell(start, "left") ? material.begin : pasteChar = material.middle;
        } else if (w !== 0 && w != width - 1 && h == 0) {
          //handle middle
          pasteChar = material.middle
        } else if (w == width - 1 && h == 0) {
          //handle end
          pasteChar = isEmptyCell(topRight, "right") ? material.end : pasteChar = material.middle;
        }
      } else {
        //handle single
        pasteChar = isEmptyCell(start, "right") && isEmptyCell(start, "left") ? material.single : pasteChar = material.middle;
      }
      if (h > 0) {
        //handle after top surface
        pasteChar = material.subSurface;
      }

      if (pasteChar) {

        pasteString += pasteChar;
      }
    }
    if (h !== height - 1 && pasteChar) {
      pasteString += "\n";
    }
  }

  w.isProtecting = false;
  paste(pasteString);
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    mouseDown = true;

  }
  if (e.button === 2 && e.button !== 3 && e.button !== 1) {
    ctrl = true;

  }

  marioBuilderEvent = e;
  [mX, mY] = currentMousePosition;
  const MouseLocation = getTileCoordsFromMouseCoords(mX, mY);
  firstClick = getTileCoordsFromMouseCoords(mX, mY);
  [posX, posY] = currentMousePosition;
  renderCursor(MouseLocation);
});

document.addEventListener("mouseup", (e) => {

  cancelEvent(e);
});

function cancelEvent(e) {
  protectSelectionCancel();
  w.protectSelect.stopSelectionUI(true);
  ctrl = false;


  mouseDown = false;
  mX = null;
  mY = null;
  posX = null;
  posY = null;
  firstClick = null
}
setInterval(() => {

  if (!w.protectSelect.isSelecting && ctrl) {
    w.protectSelect.deselect();
    w.protectSelect.startSelection();
  }
}, 10);

function isEmptyCell(location, direction) {
  let [X, Y, x, y] = location;
  if (direction == "left") {
    x -= 1
  }
  if (direction == "right") {
    x += 1
  }
  if (direction == "up") {
    y -= 1
  }
  if (direction == "down") {
    y += 1
  }
  let [a, b, c, d] = CorrectLocation(X, Y, x, y);
  let cellChar = getChar(a, b, c, d);

  return (cellChar == " " || cellChar == "");
}

function CorrectLocation(...args) {
  let location = Array.isArray(args[0]) ? args[0] : args;

  const roundedLocation = location.map((coord) => Math.round(coord));
  const outLocation = [...roundedLocation];

  if (roundedLocation[2] > 15) {
    outLocation[2] = (((roundedLocation[2] % 16 + (roundedLocation[2] < 0 ? 17 : 0)) + 16) % 16);
    outLocation[0] += Math.abs(Math.ceil(-roundedLocation[2] / 16));
  }
  if (roundedLocation[2] < 0) {
    outLocation[2] = (((roundedLocation[2] % 16 + (roundedLocation[2] < 0 ? 17 : 0)) - 1 + 16) % 16);
    outLocation[0] -= Math.ceil(-roundedLocation[2] / 16);
  }
  if (roundedLocation[3] > 7) {
    outLocation[3] = (((roundedLocation[3] % 8 + (roundedLocation[3] < 0 ? 9 : 0)) + 8) % 8);
    outLocation[1] += Math.abs(Math.ceil(-roundedLocation[3] / 8));
  }
  if (roundedLocation[3] < 0) {
    outLocation[3] = (((roundedLocation[3] % 8 + (roundedLocation[3] < 0 ? 9 : 0)) - 1 + 8) % 8);
    outLocation[1] -= Math.ceil(-roundedLocation[3] / 8);
  }

  return outLocation;
}



document.addEventListener('mousemove', e => {

  if (ctrl && posX && posY) {
    if (e.clientX < posX - cellW) {
      cancelEvent();
      console.warn("Event was canceled, right now you can only draw left then down");
    }
    if (e.clientY < posY - cellH) {
      cancelEvent();
      console.warn("Event was canceled, right now you can only draw left then down");
    }



  }
});
