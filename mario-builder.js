const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};
var globalTickIterator = 0;
var blockList = {};

const mirroredCanvas = document.createElement('canvas');
const marioSpecChars = "ቶዱዳጰጀደዤፃይያጶጆዸዥጵዹጺጴቆኖፂፏዶጳቇጿየዩጱዼጁድዓጸፆዾጄጷ";
superMarioChars = "⛹█▓▆▅▄□▤▦▩☵▫╞╡≣║│╔╕╚╛◠╭╮▣ቶዱዳጰጀደዤፃይያጶጆዸዥ⡀⠂⠁࿙࿚‚ጵዹጺጴቆኖፂፏዶጳቇጿᘯᙉየዩጱዼጁድዓጸፆዾጄጷ⚃⚅⩨⩩⠛⣿⚌⚊◩◨⸙ᴥ◙⦈⦇⯊⯋ሸᙁ";
const smSmall = "▫";
const sm_halfY = "▫";
const sm_halfX = "▫";
const sm_wide = "ጵዹጺጴቆኖፂፏዶጳቇጿ"
const sm_offsetX = "ሸ"
bufferLargeChars = false;
var charImages = [];

for (block in superMarioChars) {
  charImages.push(new Image)
}
class MaterialLayer {
  constructor(string) {
    this.begin = string[0];
    this.middle = string[1];
    this.end = string[2];
    this.single = string[3];
    this.subSurface = string[4];
  }
}
class MaterialLayerVPipe extends MaterialLayer {
  constructor(string) {
    super(string);
    this.entranceLeft = string[0];
    this.entranceRight = string[1];
    this.tubeLeft = string[2];
    this.tubeRight = string[3];
    this.exitLeft = string[4];
    this.exitRight = string[5];

  }
}
let materialOptions = {
  bush: new MaterialLayer("╭◠╮"),
  grass: new MaterialLayer("▅█▆▄▓"),
  dud: new MaterialLayer("□□□□"),
  dud_stacked: new MaterialLayer("▤▤▤▤▤"),
  stone: new MaterialLayer("▩▩▩▩"),
  stone_stacked: new MaterialLayer("▦▦▦▦▦"),
  dirt: new MaterialLayer("▓▓▓▓▓"),
  lava: new MaterialLayer("☵☵☵☵"),
  pipe_h: new MaterialLayer("╞≣╡≣"),
  brick: new MaterialLayer("⩨⩨⩨⩨"),
  brick_stacked: new MaterialLayer("⩩⩩⩩⩩⩩"),
  flip_block: new MaterialLayer("⚌⚌⚌⚌"),
  coin: new MaterialLayer("▫▫▫▫▫"),
  blank: new MaterialLayer("⚃⚃⚃⚃"),
  blank_stacked: new MaterialLayer("⚅⚅⚅⚅⚅"),
  quad: new MaterialLayer("◩◩◩◩"),
  quad_stacked: new MaterialLayer("◨◨◨◨◨"),
  msg_block: new MaterialLayer("◙◙◙◙"),
  pipe_V: new MaterialLayerVPipe("╔╕║│╚╛"), // this is a special case
}

let material = materialOptions.grass;

function changeOption(option) {
  material = materialOptions[option];

}

function main() {



  w.drawSelect = new RegionSelection()
  let marioEvent;


  const CellToPixelCoords = (...cellCoords) => {
    const [x = 0, y = 0, z = 0, w = 0] = Array.isArray(cellCoords[0]) ? cellCoords[0] : cellCoords;

    if (cellCoords.length > 4 || x === undefined || y === undefined || z === undefined || w === undefined) {
      console.error(`CellToPixelCoords: Invalid cellCoords. Arguments can either be [x, y, z, w] or x, y, z, w. Your cellCoords was: ${cellCoords}`);
      return;
    }

    const X = Math.round(x) * tileW + z * cellW + Math.round(positionX) + Math.round(owotWidth / 2);
    const Y = Math.round(y) * tileH + w * cellH + Math.round(positionY) + Math.round(owotHeight / 2);

    return [X, Y];
  }

  function drawSelectionStart(start, end, width, height) {
    renderCursor(start)
    w.drawSelect.stopSelectionUI(true)
    let [pageX, pageY] = CellToPixelCoords(start)
    marioEvent.pageX = pageX;
    marioEvent.pageY = pageY;
    event_mouseup(marioEvent, pageX, pageY);
    let pasteString = "";
    let [X, Y, x, y] = start; //topleft
    let [a, b, c, d] = end; //bottom right
    let topRight = [a, Y, c, y]; //top right
    let bottomLeft = [X, b, x, d] // bottom left

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        if (material instanceof MaterialLayerVPipe) {
          if (width > 1) {

            // only handle this spaceial case if we have 2+ in length
            // the pipes are only 2 wide so anyhting larger is ignored	
            //if the tube has height;
            if (h == 0) {
              //handle entrance
              if ((w == 0 || w % 2 === 0) && w < width - 1) {
                //handle left
                //check the cell above. there is is, then instead of an entrance we will make a tube

                pasteChar = isEmptyCell(start, "up") ? material.entranceLeft : pasteChar = material.tubeLeft;

                if (height == 1) {

                  if (isEmptyCell(start, "up")) {
                    //if there is nothin above 
                    pasteChar = material.entranceLeft;
                  } else if (isEmptyCell(bottomLeft, "down") && !isEmptyCell(start, "up")) {
                    //something above but nothin below
                    pasteChar = material.exitLeft;
                  } else if (isEmptyCell(bottomLeft, "down") && !isEmptyCell(start, "up")) {
                    //something above and something below
                    pasteChar = material.tubeLeft;
                  }
                }


              } else if (width % 2 == 0 || w < width - 1) {
                //handle right
                //check the cell above. there is is, then instead of an entrance we will make a tube
                pasteChar = isEmptyCell(topRight, "up") ? material.entranceRight : pasteChar = material.tubeRight;

                if (height == 1) {
                  if (isEmptyCell(start, "up")) {
                    //if there is nothin above 
                    pasteChar = material.entranceRight;
                  } else if (isEmptyCell(end, "down") && !isEmptyCell(start, "up")) {
                    //something above but nothin below
                    pasteChar = material.exitRight;
                  } else if (isEmptyCell(end, "down") && !isEmptyCell(start, "up")) {
                    //something above and something below
                    pasteChar = material.tubeRight;
                  }
                }
              } else {
                pasteChar = null;
              }
            } else if (h > 0 && h < height - 1) {
              //handle the tube portion.
              if ((w == 0 || w % 2 === 0) && w < width - 1) {
                pasteChar = material.tubeLeft;
              } else if (width % 2 == 0 || w < width - 1) {
                pasteChar = material.tubeRight;
              } else {
                pasteChar = null;
              }
            } else if (h > 0 && h == height - 1) {
              //handle the exit portion.
              if ((w == 0 || w % 2 === 0) && w < width - 1) {
                pasteChar = isEmptyCell(bottomLeft, "down") ? material.exitLeft : pasteChar = material.tubeLeft;
              } else if (width % 2 == 0 || w < width - 1) {
                pasteChar = isEmptyCell(end, "down") ? material.exitRight : pasteChar = material.tubeRight;
              } else {
                pasteChar = null;
              }
            }

          } else {
            pasteChar = null;
          }

        } else {
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

        }
        if (pasteChar) {
          pasteString += pasteChar;
        }

      }
      if (h !== height - 1) {
        pasteString += "\n";
      }


    }

    paste(pasteString);



  }
  const paste = (pasteString) => {

    elm.textInput.value = pasteString;
  };

  function drawtSelectionCancel() {
    elm.draw_selection.style.color = "";
  }

  function drawSelection() {
    if (w.drawSelect.isSelecting) {
      elm.draw_selection.style.color = "";
      w.drawSelect.stopSelectionUI();
    } else {
      elm.draw_selection.style.color = "#F3DB65";
      w.drawSelect.startSelection();
    }
  }

  function isEmptyCell(location, direction) {
    let [X, Y, x, y] = location;
    let char = "C";
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
    char = direction[0] || "C";
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

  w.drawSelect.onselection(drawSelectionStart);


  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  document.addEventListener("mousedown", (e) => {
    marioEvent = e;
    if (e.button === 1) {
      mouseDown = true;

    }
    if (e.button === 2 && e.button !== 3 && e.button !== 1) {
      w.drawSelect.startSelection();

    }
  })

  setInterval(() => {
    globalTickIterator++;
    renderTiles(true);
  }, 100);
  replaceCharWithImage(superMarioChars, sm_halfY, sm_wide, sm_offsetX);
} //end of main


function loadScript(url, callback) {
  var file;

  if (url.endsWith('.js')) {
    file = document.createElement('script');
    file.type = 'text/javascript';
    file.src = url;
  } else if (url.endsWith('.css')) {
    // Remove .map extension from URL, if present
    var cssUrl = url.replace(/\.map$/, '');
    file = document.createElement('link');
    file.rel = 'stylesheet';
    file.type = 'text/css';
    file.href = cssUrl;
    console.log(file)
  }

  if (typeof callback === 'function') {
    file.onload = function() {
      callback();
    };
  }

  document.head.appendChild(file);
}


function mb_ui() {
  // Create a string with the HTML code for the sidebar
  let generateOptions = "";
  // Loop through the keys of the object using a for...in loop
  for (var option in materialOptions) {
    // Check if the key exists in the object (not inherited from the prototype)
    if (materialOptions.hasOwnProperty(option)) {
      if (option) {
        // Print the key name to the console
        generateOptions += `
		<label style='font-size: 0.7em;'>
      <input type="radio" onchange="changeOption('${option}')" name="option" id = "radio-${option}" value="${option}" checked>
      ${option}
    </label>
`
      }
    }
  }

  var sidebarHtml = `
<div class="col-3 sidebar" style="
		position: absolute;
    left: 0;
    top: 0;
    background: #f4f4f4;
    padding: 1em;
    height: 100%;
">
<p><strong>Mario Builder</strong> <br><small>Early Beta</small></p>
  <form>
${generateOptions}
  </form>
</div>
`;

  // Get a reference to the container where the sidebar should be inserted
  var container = document.body;
  // Insert the HTML code for the sidebar into the container
  container.insertAdjacentHTML('beforeend', sidebarHtml);
  document.getElementById("radio-grass").checked = true;
  var modal = new Modal();
  modal.createForm();
  modal.setFormTitle("Right-click to start making,\nLeft-drag to select where to build\n");
  modal.setMaximumSize(360, 300);
  modal.onSubmit(function() {});
  modal.open();
}

loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@1.60/mario-image-src.js`, function() {
  loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.48/broadcastWrite.js`, function() {
    loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.53/helper-functions.js`, function() {
      loadScript(`https://cdnjs.cloudflare.com/ajax/libs/picocss/1.5.2/pico.fluid.classless.css`, function() {
        main();
        mb_ui();
      })
    })
  })
})
