var contextMenu = document.createElement("div");
contextMenu.class = "context-menu";
contextMenu.id = "contextMenu";
document.body.appendChild(contextMenu);
contextMenu.innerHTML = `
  <ul>
    <li><button name = "copy-char" ></button><label id="cpy-btn" for="copy-char">Copy char</label></li>
    <li><button  name = "paste"></button><label id="pst-btn" for="paste">Paste here</label></li>
    <li><button name = "cc-color"></button><label id="cpy-clr-btn" for="cc-color">Copy char color</label></li>
    <li><button name = "cc-color-bg"></button><label id="cpy-clr-bg-btn" for="cc-color-bg">Copy char background color</label></li>
    <li><button name = "RegionSelect"></button><label id="region-select-btn" for="RegionSelect">Region Select</label></li>
  </ul>

<style>

#contextMenu {
  display: none;
  position: absolute !important;
 font-family:monospace;

  list-style: none !important;
  z-index: 1 !important;
  touch-action: none !important; 
    padding: 1em !important;
    min-width: 10em !important;
    flex-wrap: nowrap !important;
    place-content: center !important;
    align-items: center !important;
}
#contextMenu button{
display:none;

}
#contextMenu ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

#contextMenu li {
  padding: 8px 12px;
  cursor: pointer;
background-color: #E5E5FF;
  border: 1px solid #ccc !important;
}
#contextMenu li:hover {
  background-color: #f4f4f4;
}
</style>
`;

const targetElement = document;
let touchTimer;

// Show the context menu on right-click or long press
targetElement.addEventListener('contextmenu', handleContextMenu);
targetElement.addEventListener('touchstart', handleTouchStart);
targetElement.addEventListener('touchend', handleTouchEnd);

// Hide the context menu when clicked outside
document.addEventListener('click', function(e) {

  hideContextMenu();

});

function handleContextMenu(e) {
  e.preventDefault();
  showContextMenu(e.pageX, e.pageY);
}

function handleTouchStart(e) {
  touchTimer = setTimeout(() => {
    e.preventDefault();
    showContextMenu(e.touches[0].pageX, e.touches[0].pageY);
  }, 500); // Adjust the duration as needed
}

function handleTouchEnd() {
  clearTimeout(touchTimer);
}

// Position and show the context menu
function showContextMenu(x, y) {
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.style.display = 'flex';
  contextMenu.style.position = "absolute";





}

// Hide the context menu
function hideContextMenu() {
  contextMenu.style.display = 'none';
}
copybtn = document.getElementById("cpy-btn");
pst_btn = document.getElementById("pst-btn");
cpy_clr_btn = document.getElementById("cpy-clr-btn");
cpy_clr_bg_btn = document.getElementById("cpy-clr-bg-btn");
region_select_btn = document.getElementById("region-select-btn");
copybtn.onclick = function() {
  forceCopy()
};

pst_btn.onclick = function() {
  forcePaste()
};

cpy_clr_btn.onclick = function() {

  forceCopyColor()
};
cpy_clr_bg_btn.onclick = function() {

  forceCopyColor(true)
};

region_select_btn.onclick = function() {

  w.regionSelect.startSelection();

};


function forceCopy() {
  var pos_ref = cursorCoords;
  if (pos_ref) {
    var tileX = pos_ref[0];
    var tileY = pos_ref[1];
    var charX = pos_ref[2];
    var charY = pos_ref[3];
    var char = getChar(tileX, tileY, charX, charY);
    char = char.replace(/\r|\n/g, " ");
    w.clipboard.copy(char);
  }

}

function forceCopyColor(bg = false) {
  console.log(bg)
  var pos = currentPosition;
  if (!pos) return;
  var tileX = pos[0];
  var tileY = pos[1];
  var charX = pos[2];
  var charY = pos[3];
  var color;
  if (!bg) {
    color = getCharColor();
    w.changeColor(color);
  } else {
    color = getCharBgColor();
    w.changeBgColor(color);
  }
}

function forcePaste() {

  // Check if the Clipboard API is available
  if (navigator.clipboard) {
    // Read clipboard data
    navigator.clipboard.readText()
      .then(text => {
        elm.textInput.value = text;
        // Do something with the clipboard data
      })
      .catch(error => {
        console.error("Failed to read clipboard data:", error);
      });
  } else {
    console.error("Clipboard API not available");
  }

}
