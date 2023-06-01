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
