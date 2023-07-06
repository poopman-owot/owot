//basic owot settings
w.broadcastReceive(true);

//init global vars
var app = {
  c: "chat",
  t: "/test",
  cmd: "cmd",
  id: w.clientId,
};

var lines = {
  id: app.id,
  data: []
}
var localDraw = [];
var historyDraw = [];
var isCtrlPressed = false;
var drawBuffer = [];
//init base  functions
function run(a, b) {
  w.on(a, b);
}

function cancel(a, b) {
  w.off(a, b);
}

function send(a) {
  network.chat(a);
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return JSON.parse(str);
  } catch (error) {
    return false;
  }
}

function convertToNestedArray(string) {
  if (typeof string == "string") {
    var hexArray = string.split(',');
    var nestedArray = hexArray.map((hex) => parseInt(hex, 16));
    return nestedArray;
  }
  return string
}

function convertToHexString(array) {
  return array.map((element) => element.toString(16)).join(',');
}

function addToShiftArray(array, element, n) {
  array.push(element); // Add the new element to the array

  if (array.length > n) {
    array.shift(); // Remove the first element from the array
  }

  return array;
}

function getLastEntries(array, max) {
  var startIndex = Math.max(array.length - max, 0);
  return array.slice(startIndex);
}
function getFirstNEntries(array, n) {
  return array.slice(0, n);
}

function CellToPixelCoords(tileX, tileY, charX, charY) {
  if (Array.isArray(tileX)) {
    // If the first argument is an array, destructure the values
    [tileX, tileY, charX, charY] = tileX;
  }
  tileX /= 2;
  tileY /= 2;
  // calculate in-tile cell position
  var charXInTile = tileX * tileC + charX;
  var charYInTile = tileY * tileR + charY;

  // calculate global cell position
  var charXGlobal = Math.floor(tileX * tileC * cellW + charXInTile * cellW + positionX + Math.trunc(owotWidth / 2));
  var charYGlobal = Math.floor(tileY * tileR * cellH + charYInTile * cellH + positionY + Math.trunc(owotHeight / 2));

  return [charXGlobal, charYGlobal];
}

function sendmessage(namespace = "", obj = {
  data: null
}) {
  obj.namespace = namespace;
  const o = JSON.stringify(obj);
  network.cmd(o, true);
}

run(app.cmd, function(e) {
  const sender = e.sender;
  const d = isValidJSON(e.data);
  if (d) {
    if (d.namespace == "linedraw" || d.namespace == "linedraw_history") {
      onMessageReceived(d)
    }

  }
})

// Setup main appliction functions
function onMessageReceived(e) {
  if (e.namespace == "linedraw") {
    addToShiftArray(localDraw, e.data, 3000);
  } else if (e.namespace == "linedraw_history" && e.data[0] !== app.id) {
if(historyDraw.length < e.data[2] && localDraw.length < 3000 ){
      e.data[1].forEach((element) => {
       
        if (element.length) {

addToShiftArray(historyDraw, convertToNestedArray(element), 3000);
addToShiftArray(localDraw, convertToNestedArray(element), 3000);
          
        }
      })
  }}
}



// Setup Application UI
// Clone the canvas node
var paintCanvas = owot.cloneNode(true);

// Set styles for paint_canvas
paintCanvas.id = "paint_canvas"; // Set an ID for the cloned canvas
paintCanvas.style.position = "absolute"; // Example: set position to absolute
paintCanvas.style.left = owot.offsetLeft + "px"; // Example: match left position
paintCanvas.style.top = owot.offsetTop + "px"; // Example: match top position
paintCanvas.style.zIndex = parseInt(owot.style.zIndex) + 1; // Example: higher z-index
paintCanvas.style.cursor = "crosshair";
// Disable pointer events for paint_canvas
paintCanvas.style.pointerEvents = "none";

// Append paint_canvas to the parent of owot
owot.parentNode.appendChild(paintCanvas);

// Add event listeners 


// Event listener for keydown event
document.addEventListener("keydown", function(event) {
  if (event.key === "Control") {
    isCtrlPressed = true;
    paintCanvas.style.pointerEvents = "auto";
  }
});

// Event listener for keyup event
document.addEventListener("keyup", function(event) {
  if (event.key === "Control") {
    isCtrlPressed = false;
    paintCanvas.style.pointerEvents = "none";
  }
});

// Event listener for mousedown event on paint_canvas
paintCanvas.addEventListener("mousedown", function(event) {

  if (isCtrlPressed && event.button === 0) {
    // Prevent default behavior to disable text selection
    event.preventDefault();

    // Get the starting position of the mouse click
    var startX = event.clientX - paintCanvas.offsetLeft;
    var startY = event.clientY - paintCanvas.offsetTop;

    // Add the starting position to the drawing data array
    lines.data[0] = startX;
    lines.data[1] = startY;
    /*
    x,y,X,Y,ox,oy
    0 1 2 3  4 5
    */
    // Event listener for mousemove event
    var drawEventListener = function(event) {
      // Calculate the current position of the mouse
      var currentX = event.clientX - paintCanvas.offsetLeft;
      var currentY = event.clientY - paintCanvas.offsetTop;

      // Update the starting position for the next draw segment
      startX = currentX;
      startY = currentY;

      // Add the current position to the drawing data array
      lines.data[2] = startX;
      lines.data[3] = startY
      const [x, y] = CellToPixelCoords(0, 0, 0, 0);
      lines.data[4] = x;
      lines.data[5] = y;
      sendmessage("linedraw", lines);
      lines.data[0] = startX;
      lines.data[1] = startY;
    };

    // Event listener for mousemove event on document
    document.addEventListener("mousemove", drawEventListener);

    // Event listener for mouseup event on document
    document.addEventListener("mouseup", function() {
      // Remove the mousemove event listener
      document.removeEventListener("mousemove", drawEventListener);
    });
  }

});

function drawLine(data) {
  var ctx = paintCanvas.getContext("2d");
  ctx.beginPath();
  const [X, Y] = CellToPixelCoords(0, 0, 0, 0);
  const x = X - data[4];
  const y = Y - data[5];
  ctx.moveTo(data[0] + x, data[1] + y);
  ctx.lineTo(data[2] + x, data[3] + y);
  ctx.stroke();
}

function renderDrawing() {
  var ctx = paintCanvas.getContext("2d");
  ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  for (i = 0; i < localDraw.length; i++) {
    drawLine(localDraw[i])
  }
  for (i = 0; i < historyDraw.length; i++) {
    drawLine(historyDraw[i])
  }

  requestAnimationFrame(renderDrawing);
}

sendmessage("linedraw", lines);
renderDrawing();


var send_history_data;

function sendHistory() {
  //copy the local changes


    if (localDraw.length > 100) {


clearInterval(send_history_data)
 drawBuffer = [];
send_history_data = setInterval(function(){
      structuredClone(localDraw).forEach((element) => {
       
        if (element.length) {
          drawBuffer.push(convertToHexString(element));
        }
      })
    

     d = getFirstNEntries(drawBuffer,4);
     drawBuffer =  drawBuffer.splice(4);
     
    var data = [app.id, d,localDraw.length];
    sendmessage("linedraw_history", {
      data
    });
},10)

  }
}
setInterval(function() {
  sendHistory();
}, 10000)
