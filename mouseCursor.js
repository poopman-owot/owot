owot.addEventListener("mousemove", showCursor);
alert("Settings are now found in the menu")
w.setFlushInterval(1)
var doshowCursor = false;
var doshowCursorColor = false;



$("#nav ul").setHTML($("#nav ul").getInnerHTML() + '<li><div id = "crsr-chk"><input type="checkbox"> Show Cursor</div></li><li><div id = "rnbw-chk"><input type="checkbox"> Rainbow Cursor</div></li>');
document.getElementById("crsr-chk").onclick = function() {
  doshowCursor = !doshowCursor;
  cursorRenderingEnabled = !doshowCursor;
  if (doshowCursor) {
    defaultCursor = "none"
  } else {
    defaultCursor = 'text'
  }
}
document.getElementById("rnbw-chk").onclick = function() {
  doshowCursorColor = !doshowCursorColor;

}
ee = "🮰";
erase = " ";
firstLetter = true;
oldCoords = [0, 0, 0, 0];


var cursorColor = YourWorld.Color;


function showCursor(e) {
  if (doshowCursor) {
    console.log(doshowCursor)
    if (doshowCursorColor) {
      cursorColor = ~~(Math.random() * 16777215);
    } else {
      cursorColor = YourWorld.Color;
    }
    event_mouseup(e);
    firstLetter = true;
    writeCharTo(erase, 0, oldCoords[0], oldCoords[1], oldCoords[2], oldCoords[3]);
    erase = (getChar(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]))
    writeCharTo(ee, cursorColor, cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]);
    oldCoords = cursorCoords;
  }
}
document.onkeydown = function(e) {
  if (e.key == "Escape") {
    owot.removeEventListener("mousemove", showCursor);
    location.reload()
  }
}
document.onkeyup = function(e) {
  if (e.key != "Shift" && e.key != "Control" && e.key != "Enter" && e.key != "Backspace" && e.key != "Insert" && e.key != "Home" && e.key != "PageUp" && e.key != "PageDown" && e.key != "Delete" && e.key != "End" && e.key != "NumLock" && e.key.length < 2) {
    if (firstLetter) {
      firstLetter = false;
      erase = e.key;
      console.log(e)
    }
  }
}
document.onmousedown = function() {
  owot.removeEventListener("mousemove", showCursor)
}
document.onmouseup = function() {
  owot.addEventListener("mousemove", showCursor)
}
