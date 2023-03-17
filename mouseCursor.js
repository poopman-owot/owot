owot.addEventListener("mousemove", showCursor);
w.setFlushInterval(100)
ee = "🮰";
erase = " ";
firstLetter = true;
oldCoords = [0, 0, 0, 0];

function showCursor(e) {
    event_mouseup(e);
    firstLetter = true;
    writeCharTo(erase, 0, oldCoords[0], oldCoords[1], oldCoords[2], oldCoords[3]);
    erase = (getChar(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]))
    writeCharTo(ee, 0, cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]);
    oldCoords = cursorCoords;
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
cursorRenderingEnabled = false;
defaultCursor = "none"
