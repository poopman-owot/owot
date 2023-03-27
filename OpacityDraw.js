function drawOpacity(){
owot.addEventListener("mousemove", showCursor);
alert("Settings are now found in the menu, ctrl = draw")
w.setFlushInterval(1)
var doshowCursor = false;
var doshowCursorColor = false;
var drawOpacity = 10;


$("#nav ul").setHTML($("#nav ul").getInnerHTML() + '<li><div id = "crsr-chk"><input type="checkbox"> Show Cursor</div></li><li><div id = "rnbw-chk"><input type="checkbox"> Rainbow Cursor</div></li><li class="hover">Draw opacity<input style="width:100%" title="Draw Opacity" type="range" min="1" max="100" id="draw-opacity"></li>');
document.getElementById("crsr-chk").onclick = function() {
  doshowCursor = !doshowCursor;
  cursorRenderingEnabled = !doshowCursor;
  if (doshowCursor) {
    defaultCursor = "none"
  } else {
    defaultCursor = 'text'
  }
}
document.getElementById("draw-opacity").value = drawOpacity;
document.getElementById("draw-opacity").onmouseup = function(e) {
drawOpacity = (document.getElementById("draw-opacity").value)
}
document.getElementById("rnbw-chk").onclick = function() {
  doshowCursorColor = !doshowCursorColor;

}
ee = "🮰";
erase = " ";
eraseColor = 0;
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


if (getCharInfo(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]).char == "⠀" || getCharInfo(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]).char == " ")
{colorMix = int_to_rgb(16777215)}
else{
    colorMix = int_to_rgb(getCharInfo(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]).color)
}
     let [cm_r,cm_g,cm_b] = colorMix;
      let [char_r,char_g,char_b] = int_to_rgb(cursorColor);
      if (drawOpacity == 100){
          cm_r
        cm_g,cm_b
      }
      
      let [NC_R, NC_G , NC_B] = [(cm_r*Math.abs(100 - drawOpacity)+(char_r*drawOpacity))/Math.abs(101 - drawOpacity),(cm_g*Math.abs(100 - drawOpacity)+(char_g*drawOpacity))/Math.abs(101 - drawOpacity),(cm_b*Math.abs(100 - drawOpacity)+(char_b*drawOpacity))/Math.abs(101 - drawOpacity)]
      console.log(drawOpacity)
      let newColor = rgb_to_int(NC_R, NC_G , NC_B);
if(e.ctrlKey){

    erase = (getChar(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]))
    eraseColor = getCharColor(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3])
    writeCharTo("█", newColor, cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]);
    oldCoords = cursorCoords;
    cursorColor = newColor
}
      else{
    writeCharTo(erase, eraseColor, oldCoords[0], oldCoords[1], oldCoords[2], oldCoords[3]);
    erase = (getChar(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]))
    eraseColor = getCharColor(cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3])
    writeCharTo(ee, newColor, cursorCoords[0], cursorCoords[1], cursorCoords[2], cursorCoords[3]);
    oldCoords = cursorCoords;
          
      }
      

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
    }
  }
}
document.onmousedown = function() {
  owot.removeEventListener("mousemove", showCursor)
}
document.onmouseup = function() {
    firstClick = true;
  owot.addEventListener("mousemove", showCursor)
}

}
drawOpacity();
