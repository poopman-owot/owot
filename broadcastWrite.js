function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function recieveBroadcastWrites(value){
w.broadcastReceive(value);
w.on("cmd", function(arr) {
  if (arr.sender) {
    if (w.socketChannel !== arr.sender) {
      if (isJsonString(arr.data)) {
        const jsonData = JSON.parse(arr.data);
        if (jsonData.broadcast) {
          if (Array.isArray(jsonData.broadcast)) {
            let [tileX, tileY, charX, charY, charColor, char, local, broadcast, noUndo, undoOffset, charBgColor] = jsonData.broadcast;
            local = true;
            broadcast = false;
            broadcastWrite(char, charColor, tileX, tileY, charX, charY, local, broadcast, noUndo, undoOffset, charBgColor);
          }
        }
      }
    }
  }
})

}


// place a character
function broadcastWrite(char, charColor, tileX, tileY, charX, charY, local, broadcast, noUndo, undoOffset, charBgColor) {

  if (!Tile.get(tileX, tileY)) {
 return;
  }
  var tile = Tile.get(tileX, tileY);
  var isErase = char == "\x08";
  if (isErase) {
    char = " ";
    charColor = 0x000000;
    charBgColor = -1;
  }
  if (charBgColor == null) {
    charBgColor = -1;
  }

  var cell_props = tile.properties.cell_props;
  if (!cell_props) cell_props = {};
  var color = tile.properties.color;
  var bgcolor = tile.properties.bgcolor;
  if (!color) color = new Array(tileArea).fill(0);

  var hasChanged = false;
  var prevColor = 0;
  var prevBgColor = -1;
  var prevChar = "";
  var prevLink = getLink(tileX, tileY, charX, charY);

  // delete link locally
  if (cell_props[charY]) {
    if (cell_props[charY][charX]) {
      delete cell_props[charY][charX];
      hasChanged = true;
    }
  }
  // change color locally
  if (!Permissions.can_color_text(state.userModel, state.worldModel)) {
    charColor = 0x000000;
  }
  if (!Permissions.can_color_cell(state.userModel, state.worldModel)) {
    charBgColor = -1;
  }

  // set text color
  prevColor = color[charY * tileC + charX];
  color[charY * tileC + charX] = charColor;
  if (prevColor != charColor) hasChanged = true;
  tile.properties.color = color; // if the color array doesn't already exist in the tile

  // set cell color
  if (!bgcolor && charBgColor != -1) {
    bgcolor = new Array(tileArea).fill(-1);
    tile.properties.bgcolor = bgcolor;
  }
  if (bgcolor) {
    prevBgColor = bgcolor[charY * tileC + charX];
    bgcolor[charY * tileC + charX] = charBgColor;
    if (prevBgColor != charBgColor) hasChanged = true;
  }

  // update cell properties (link positions)
  tile.properties.cell_props = cell_props;

  if (!isErase) {
    currDeco = getCharTextDecorations(char);
    char = clearCharTextDecorations(char);
    char = detectCharEmojiCombinations(char) || char;
    var cBold = textDecorationModes.bold;
    var cItalic = textDecorationModes.italic;
    var cUnder = textDecorationModes.under;
    var cStrike = textDecorationModes.strike;
    if (currDeco) {
      cBold = cBold || currDeco.bold;
      cItalic = cItalic || currDeco.italic;
      cUnder = cUnder || currDeco.under;
      cStrike = cStrike || currDeco.strike;
    }
    if (char == " ") { // don't let spaces be bold/italic
      cBold = false;
      cItalic = false;
    }
    char = setCharTextDecorations(char, cBold, cItalic, cUnder, cStrike);
  }

  // set char locally
  var con = tile.content;
  prevChar = con[charY * tileC + charX]
  con[charY * tileC + charX] = char;
  if (prevChar != char) hasChanged = true;
  w.setTileRedraw(tileX, tileY);
  if (bufferLargeChars) {
    if (charY == 0) w.setTileRedraw(tileX, tileY - 1);
    if (charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY);
    if (charY == 0 && charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY - 1);
  }
  if (!local) {
    if (hasChanged && (!noUndo || noUndo == -1)) {
      if (noUndo != -1) {
        undoBuffer.trim();
      }
      undoBuffer.push([tileX, tileY, charX, charY, prevChar, prevColor, prevLink, prevBgColor, undoOffset]);
    }
  }

  //TEMP
  if (window.payLoad && window.chunkMax && window.cleanMemory) {
    return;
  }

  var editArray = [tileX, tileY, charX, charY, getDate(), char, nextObjId];
  if (tileFetchOffsetX || tileFetchOffsetY) {
    editArray[0] += tileFetchOffsetY;
    editArray[1] += tileFetchOffsetX;
  }

  var charColorAdded = false;
  if (charColor && Permissions.can_color_text(state.userModel, state.worldModel)) {
    editArray.push(charColor);
    charColorAdded = true;
  }
  if (charBgColor != null && charBgColor != -1 && Permissions.can_color_cell(state.userModel, state.worldModel)) {
    if (!charColorAdded) {
      editArray.push(0);
    }
    editArray.push(charBgColor);
  }

  tellEdit.push(editArray); // track local changes
  if (!local) {
    writeBuffer.push(editArray); // send edits to server
  }
  if (broadcast) {

    w.broadcastCommand(`{"broadcast":${JSON.stringify(editArray)}}`, true);
  }
  nextObjId++;
}


function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function recieveBroadcastWrites(value){
w.broadcastReceive(value);
w.on("cmd", function(arr) {
  if (arr.sender) {
    if (w.socketChannel !== arr.sender) {
      if (isJsonString(arr.data)) {
        const jsonData = JSON.parse(arr.data);
        if (jsonData.broadcast) {
          if (Array.isArray(jsonData.broadcast)) {
            let [tileX, tileY, charX, charY, charColor, char, local, broadcast, noUndo, undoOffset, charBgColor] = jsonData.broadcast;
            local = true;
            broadcast = false;
            broadcastWrite(char, charColor, tileX, tileY, charX, charY, local, broadcast, noUndo, undoOffset, charBgColor);
          }
        }
      }
    }
  }
})

}


// place a character
function broadcastWrite(char, charColor, tileX, tileY, charX, charY, local, broadcast, noUndo, undoOffset, charBgColor) {

  if (!Tile.get(tileX, tileY)) {
 return;
  }
  var tile = Tile.get(tileX, tileY);
  var isErase = char == "\x08";
  if (isErase) {
    char = " ";
    charColor = 0x000000;
    charBgColor = -1;
  }
  if (charBgColor == null) {
    charBgColor = -1;
  }

  var cell_props = tile.properties.cell_props;
  if (!cell_props) cell_props = {};
  var color = tile.properties.color;
  var bgcolor = tile.properties.bgcolor;
  if (!color) color = new Array(tileArea).fill(0);

  var hasChanged = false;
  var prevColor = 0;
  var prevBgColor = -1;
  var prevChar = "";
  var prevLink = getLink(tileX, tileY, charX, charY);

  // delete link locally
  if (cell_props[charY]) {
    if (cell_props[charY][charX]) {
      delete cell_props[charY][charX];
      hasChanged = true;
    }
  }
  // change color locally
  if (!Permissions.can_color_text(state.userModel, state.worldModel)) {
    charColor = 0x000000;
  }
  if (!Permissions.can_color_cell(state.userModel, state.worldModel)) {
    charBgColor = -1;
  }

  // set text color
  prevColor = color[charY * tileC + charX];
  color[charY * tileC + charX] = charColor;
  if (prevColor != charColor) hasChanged = true;
  tile.properties.color = color; // if the color array doesn't already exist in the tile

  // set cell color
  if (!bgcolor && charBgColor != -1) {
    bgcolor = new Array(tileArea).fill(-1);
    tile.properties.bgcolor = bgcolor;
  }
  if (bgcolor) {
    prevBgColor = bgcolor[charY * tileC + charX];
    bgcolor[charY * tileC + charX] = charBgColor;
    if (prevBgColor != charBgColor) hasChanged = true;
  }

  // update cell properties (link positions)
  tile.properties.cell_props = cell_props;

  if (!isErase) {
    currDeco = getCharTextDecorations(char);
    char = clearCharTextDecorations(char);
    char = detectCharEmojiCombinations(char) || char;
    var cBold = textDecorationModes.bold;
    var cItalic = textDecorationModes.italic;
    var cUnder = textDecorationModes.under;
    var cStrike = textDecorationModes.strike;
    if (currDeco) {
      cBold = cBold || currDeco.bold;
      cItalic = cItalic || currDeco.italic;
      cUnder = cUnder || currDeco.under;
      cStrike = cStrike || currDeco.strike;
    }
    if (char == " ") { // don't let spaces be bold/italic
      cBold = false;
      cItalic = false;
    }
    char = setCharTextDecorations(char, cBold, cItalic, cUnder, cStrike);
  }

  // set char locally
  var con = tile.content;
  prevChar = con[charY * tileC + charX]
  con[charY * tileC + charX] = char;
  if (prevChar != char) hasChanged = true;
  w.setTileRedraw(tileX, tileY);
  if (bufferLargeChars) {
    if (charY == 0) w.setTileRedraw(tileX, tileY - 1);
    if (charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY);
    if (charY == 0 && charX == tileC - 1) w.setTileRedraw(tileX + 1, tileY - 1);
  }
  if (!local) {
    if (hasChanged && (!noUndo || noUndo == -1)) {
      if (noUndo != -1) {
        undoBuffer.trim();
      }
      undoBuffer.push([tileX, tileY, charX, charY, prevChar, prevColor, prevLink, prevBgColor, undoOffset]);
    }
  }

  //TEMP
  if (window.payLoad && window.chunkMax && window.cleanMemory) {
    return;
  }

  var editArray = [tileX, tileY, charX, charY, getDate(), char, nextObjId];
  if (tileFetchOffsetX || tileFetchOffsetY) {
    editArray[0] += tileFetchOffsetY;
    editArray[1] += tileFetchOffsetX;
  }

  var charColorAdded = false;
  if (charColor && Permissions.can_color_text(state.userModel, state.worldModel)) {
    editArray.push(charColor);
    charColorAdded = true;
  }
  if (charBgColor != null && charBgColor != -1 && Permissions.can_color_cell(state.userModel, state.worldModel)) {
    if (!charColorAdded) {
      editArray.push(0);
    }
    editArray.push(charBgColor);
  }

  tellEdit.push(editArray); // track local changes
  if (!local) {
    writeBuffer.push(editArray); // send edits to server
  }
  if (broadcast) {

    w.broadcastCommand(`{"broadcast":${JSON.stringify(editArray)}}`, true);
  }
  nextObjId++;
}
function recieveBroadcastScore(value){
w.broadcastReceive(value);
w.on("cmd", function(arr) {
  if (arr.sender) {
    if (w.socketChannel !== arr.sender) {
      const username = (arr.username) ? arr.username : "anon";
      if (isJsonString(arr.data)) {
        const jsonData = JSON.parse(arr.data);
        if (jsonData.broadcast) {
         console.log(username, jsonData.broadcast)
        }
      }
    }
  }
})

}

