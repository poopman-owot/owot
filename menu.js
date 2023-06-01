var shortcut_container = document.createElement("div");
var sc_close = document.createElement("input");
sc_close.id = "sc-close";
sc_close.name = "sc-close";
sc_close.type = "button";
sc_close.style.display = "none"
sc_close.onclick = function() {
  toggleShortcuts();
}
shortcut_container.id = "shortcut-container";
document.body.appendChild(shortcut_container);

function toggleShortcuts() {

  if (shortcut_container.style.display == "none") {
    shortcut_container.style.display = "";
  } else {
    shortcut_container.style.display = "none";
  }
}
menuOptions.textTyle = menu.addOption("Toggle Text Style", function() {
  return toggleTextDecoBar()
});
menuOptions.keybinds = menu.addOption("Show Shortcuts", function() {
  return toggleShortcuts()
});

shortcut_container.innerHTML = `
<style>
#shortcut-container{
    min-height: 20em;
    width: 24em;
    top: 1em;
    right: 1em;
    padding: 1em;
    position: fixed;
    background: rgb(229, 229, 255);
    font-family: monospace;
    overflow-y: scroll;
    height: 90%;
}

small{
font-size: 0.9em
}
strong {
    font-weight: 800;
}
#shortcut-container > dl >li {
    font-size: large;
    font-weight: bolder;
    list-style-type: none;
}
#close-label {
    position: fixed;
    top: 1em;
    right: 2em;
    font-size: xx-large;
    width: 1em;
    height: 1em;
    text-align: center;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.1em;
    border: 1px solid;
}
</style
<div><h1>Shortcut Keys</h1></div>
    <dl>
        <li>Copy A Character</li>
        <dl>
            <li><strong>Ctrl + C</strong> <small>Where your text cursor is</small></li>
            <li><strong>Ctrl + M</strong> <small>Where your mouse cursor is</small></li>
        </dl>
                <li>Copy a cell's color</li>
        <dl>
            <li><strong>Alt + C</strong> <small>where your mouse cursor is</small></li>
        </dl>
                       <li>Select & copy a region of text</li>
        <dl>
            <li><strong>Ctrl + A</strong> <small>or Alt + G</small></li>
        </dl>
                <li>Set text decoration</li>
        <dl>
            <li><strong>Alt + Q</strong></li>
            <li><strong>Ctrl + Q</strong> <small>Not recommended</small></li>
            <li><strong>Ctrl + Shift + F</strong></li>
        </dl>
                        <li>Paste text</li>
        <dl>
            <li><strong>Ctrl + V</strong></li>
        </dl>
                       <li>Undo text</li>
        <dl>
            <li><strong>Ctrl + Z</strong></li>
        </dl>
                       <li>Redo text</li>
        <dl>
            <li><strong>Ctrl + Y</strong></li>
            <li><strong>Ctrl + Shift + Z</strong></li>
        </dl>
                               <li>Go to next line</li>
        <dl>
            <li><strong>Enter</strong></li>
        </dl>
            <li>Go to center (0, 0)</li>
        <dl>
            <li><strong>Home</strong> <small>button is typically to the right of keyboard</small></li>
        </dl>
            <li>Quickly add links or protections</li>
        <dl>
            <li><strong>Hold Ctrl to select cells/tiles</strong></li>
            <li><strong>Hold Shift to unselect cells/tiles</strong></li>
            <li><strong>Ctrl + S or Alt + S to save the links/protections to the page</strong></li>
        </dl>
                    <li>Cancel UI <small>cursor, modals, linking, region selection, protection selection</small></li>
        <dl>
            <li><strong>Esc</strong></li>
        </dl>
           <li>Move around freely</li>
        <dl>
            <li><strong>Esc</strong> <small>then use one of the four arrow keys</small></li>
        </dl>
           <li>Tab 4 spaces</li>
        <dl>
            <li><strong>Tab</strong></li>
        </dl>
           <li>Zoom</li>
        <dl>
            <li><strong>Ctrl + Mouse wheel</strong></li>
        </dl>
           <li>Scroll left/right</li>
        <dl>
            <li><strong>Ctrl + Mouse wheel</strong></li>
        </dl>
                   <li>Erase</li>
        <dl>
            <li><strong>Backspace</strong></li>
        </dl>
                           <li>Erase in-place</li>
        <dl>
            <li><strong>Delete</strong></li>
        </dl>
                           <li>Move text cursor</li>
        <dl>
            <li><strong>Arrow keys</strong></li>
        </dl>
    </dl>
    <label id = "close-label" for="sc-close">✖</label>
    `
shortcut_container.appendChild(sc_close)
toggleShortcuts();
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
