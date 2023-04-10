
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

const PixelToCellCoords = (...pixelCoords) => {
  let [x = 0, y = 0] = Array.isArray(pixelCoords[0]) ? pixelCoords[0] : pixelCoords;

  if (pixelCoords.length > 2 || x === undefined || y === undefined) {
    console.error(`PixelToCellCoords: Invalid pixelCoords. Arguments can either be [x, y] or x, y. Your pixelCoords was: ${pixelCoords}`);
    return;
  }

  return getTileCoordsFromMouseCoords(x, y);
}

const Lerp = (start = 0, end = 0, amt = 0.5, roundResult = false) => {
  let value = (1 - amt) * start + amt * end;
  if (roundResult) {
    value = Math.round(value);
  }
  return value;
}

const LerpArray = (startArray, endArray = startArray.map(() => 0), amt = 0.5, roundResult = false) => {
  let resultArray = startArray.map((value, i) => Lerp(value, endArray[i], amt, roundResult));
  return resultArray;
}

const centerPlayer = (coords, offset = [0, 0], lerpSpeed = 0.01, ...rest) => {
  let x = 0,
    y = 0;
  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (rest.length < 2) {
    [x = 0, y = 0] = rest;
  }
  // Invalid input
  else {
    console.error(`centerPlayer: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ${offset}`);
    return;
  }
  return ScrollWorld(LerpArray([0, 0], SubtractArrays(CellToPixelCoords(coords), [(owotWidth / 2) + x, (owotHeight / 2) + y]), lerpSpeed));
};

const ScrollWorld = (offset = [0, 0], ...rest) => {
  let x = 0,
    y = 0;

  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (rest.length < 2) {
    [x = 0, y = 0] = rest;
  }
  // Invalid input
  else {
    console.error(`ScrollWorld: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ${offset}`);
    return;
  }

  const deltaX = Math.trunc(x);
  const deltaY = Math.trunc(y);

  positionY -= deltaY;
  positionX -= deltaX;

  w.emit("scroll", {
    deltaX: -deltaX,
    deltaY: -deltaY
  });

  return [deltaY, deltaX];
};



const SubtractArrays = (arr1, arr2, roundResult = false) => {
  const resultArray = arr1.map((value, index) => {
    let result = value - arr2[index];
    if (roundResult) {
      result = Math.round(result);
    }
    return result;
  });
  return resultArray;
}

const AddArrays = (arr1, arr2, roundResult = false) => {
  // Create a new array to store the results
  const resultArray = [];

  // Loop through the arrays and add the elements at the same index
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    let value = (arr1[i] + arr2[i]);

    if (roundResult) {
      value = Math.round(value);
    }
    resultArray.push(value);
  }

  return resultArray;
}

function localWriteChar(tileX, tileY, charX, charY, char, color) {
  if (!tiles[tileY + "," + tileX]) return;
  var tile = tiles[tileY + "," + tileX];
  var content = advancedSplit(tile.content);
  content[charY * tileC + charX] = char;
  tile.content = content.join("");
  if (!color) color = 0;
  if (!tile.properties.color) tile.properties.color = Object.assign([], blankColor);
  tile.properties.color[charY * tileC + charX] = color;
  renderTile(tileX, tileY, true);
}

function getNearbyCells(coord, str) {
  const [x, y, z, w] = CorrectLocation(coord);
  return {
    centerChar: DoesCellContainChars(CorrectLocation(x, y, z, w), str),
    rightChar: DoesCellContainChars(CorrectLocation(x, y, z + 1, w), str),
    leftChar: DoesCellContainChars(CorrectLocation(x, y, z - 1, w), str),
    bottomChar: DoesCellContainChars(CorrectLocation(x, y, z, w + 1), str),
    topChar: DoesCellContainChars(CorrectLocation(x, y, z, w - 1), str),
    rightTopChar: DoesCellContainChars(CorrectLocation(x, y, z + 1, w - 1), str),
    leftTopChar: DoesCellContainChars(CorrectLocation(x, y, z - 1, w - 1), str),
    RightBottomChar: DoesCellContainChars(CorrectLocation(x, y, z + 1, w + 1), str),
    LeftBottomChar: DoesCellContainChars(CorrectLocation(x, y, z - 1, w + 1), str),
  }
}

function checkNearbyCellsForChar(coord, str) {
  const nearbyCells = getNearbyCells(coord, str);
  for (const key in nearbyCells) {
    if (nearbyCells[key][0]) {
      return true;
    }
  }
  return false;
}

const doesNearbyCellsContainChars = (coord, char) => {
  const matchingCells = findCellsNearbyMatchingChar(coord, char);
  return Object.keys(matchingCells).length > 0;
};

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

const DoesCellContainChars = (coord, specificChars = "") => {
  const [x, y, z, w] = CorrectLocation(coord);

  const char = getChar(Math.round(x), Math.round(y), Math.round(z), Math.round(w));
  if (!specificChars) {
    return [char !== " ", char];
  }

  return [specificChars.includes(char), char];
}

const findCharsInViewport = (pattern, caseInsensitive, ignoreCombining) => {
  const re = new RegExp(pattern);
  const visible = getVisibleTiles();
  const chars = [];

  for (const coord of visible) {
    const tile = tiles[`${coord[1]},${coord[0]}`];

    if (!tile) {
      continue;
    }

    const content = advancedSplit(tile.content, false, ignoreCombining);

    for (let p = 0; p < content.length; p++) {
      if ((caseInsensitive && re.test(content[p])) || (!caseInsensitive && re.test(content[p]))) {
        continue;
      }

      const cx = p % tileC;
      const cy = Math.floor(p / tileC);
      chars.push([coord[0], coord[1], cx, cy]);
    }
  }

  return chars;
};

function getJSONFromCell(x, y, z, w) {
  const [a, b, c, d] = CorrectLocation(x, y, z, w);
  const link = getLink(a, b, c, d) ?.url;
  if (!link) {
    return false;
  }
  return JSON.parse("{" + link.replace(/.*\/\//g, "") + "}");
}

async function getDeltaTime() {
  return await new Promise(resolve => {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      const deltaTime = now - window.lastTime;
      window.lastTime = now;
      resolve(deltaTime);
    });
  });
}
const countObjectsByClass = (list, className) => {
  let count = 0;
  for (const key of Object.keys(list)) {
    const o = list[key];
    if (o.constructor.name === className) {
      count++;
    }
  }
  return count;
}

function GoToCoord(x, y) {
  var maxX = Number.MAX_SAFE_INTEGER / 160 / 4;
  var maxY = Number.MAX_SAFE_INTEGER / 144 / 4;
  if (x > maxX || x < -maxX || y > maxY || y < -maxY) {
    return;
  }
  positionX = Math.floor(-x * tileW * coordSizeX);
  positionY = Math.floor(y * tileH * coordSizeY);
  w.render();
}

const deleteObjectsByClass = (list, className) => {
  let count = 0;
  for (const key of Object.keys(list)) {
    const o = list[key];
    if (o.constructor.name === className && o.lives <= 0) {
      delete list[key];
      count++;
    }
  }
  return count;
}
const createCellReps = (data) => {
  const result = {};

  const processKey = (key, value) => {
    if (Array.isArray(value)) {
      result[key] = {
        left: [value[0]],
        right: [value[1]]
      };
    } else if (typeof value === "object") {
      result[key] = {
        left: value.left,
        right: value.right
      };
    } else {
      result[key] = {
        left: [value],
        right: [value]
      };
    }
  };

  for (const [key, value] of Object.entries(data)) {
    processKey(key, value);
  }

  return result;
};


const findImageCharKey = (imageSrcObject, charCode, str = "") => {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
  if (index >= 0) {
    return [Object.keys(imageSrcObject)[index], index];
  }
};

const isCharOfType = (charCode, str = "") => {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
  return index >= 0;
};

const replaceCharWithImage = (masterString, shortSubstring = "", wideSubstring = "") => {
  w.registerHook("renderchar", (charCode, ctx, tileX, tileY, charX, charY, offsetX, offsetY, width, height) => {
    const char = String.fromCharCode(charCode);
    const str = masterString; // this is the main string used for image replacement.
    const wide = wideSubstring; // this is a substring for cases where you want the image to be 2x wide.
    const short = shortSubstring; // this is a substring for cases where you want the image to be 1/2 height.
    const index = str.indexOf(char);
    const charKey = Object.keys(SMImageSrc)[index];
    
    if (charKey !== undefined) {
      const imageSrc = CycleImage(SMImageSrc[charKey], globalTickIterator);
      charImages[index].src = imageSrc;
      ctx.fillStyle = "transparent";
      ctx.fillRect(offsetX, offsetY, width, height);
      if (wide.includes(char)) {
        offsetX -= width / 2;
        width *= 2;
      }
      if (short.includes(char)) {
        offsetY += height / 4;
        height /= 2;
        width /= 1.3;
        offsetX += width / 6;
      }
      ctx.drawImage(charImages[index], offsetX, offsetY, width, height);
    } 
    return false;
  });
};
w.redraw();
