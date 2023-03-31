
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

const isValidImageSymbol = (charCode) => isCharOfType(charCode, superMarioChars);

const fillImageChar = (charCode, textRender, x, y, clampW, clampH) => {
  let tmpCellW = clampW / tileC;
  let tmpCellH = clampH / tileR;
  let sx = Math.floor(x * tmpCellW);
  let sy = Math.floor(y * tmpCellH);
  let ex = Math.floor((x + 1) * tmpCellW);
  let ey = Math.floor((y + 1) * tmpCellH);

  tmpCellW = ex - sx;
  tmpCellH = ey - sy;

  const [charKey, charIndex] = findImageCharKey(SMImageSrc, charCode, superMarioChars);
  if (charKey !== undefined) {
    const imageSrc = CycleImage(SMImageSrc[charKey], globalTickIterator);
    charImages[charIndex].src = imageSrc;
  } else {
    return false;
  }

  if (isCharOfType(charCode, sm_halfY)) {
    sy -= tmpCellH - (tmpCellH * 1.5);
  }

  if (isCharOfType(charCode, sm_halfX)) {
    sx -= tmpCellW - (tmpCellW * 1.5);
  }
  if (isCharOfType(charCode, sm_wide)) {
    sx -= (tmpCellW);
  }
  textRender.drawImage(charImages[charIndex], sx, sy, ex - sx, ey - sy);
  return true;
};

function fillBlockChar(charCode, textRender, x, y, clampW, clampH, flags) {
  var isBold = flags ? flags & 1 : 0;
  var isOverflow = flags ? flags & 2 : 0;
  //Check if the symbol should be an specific image.
  if (isValidImageSymbol(charCode)) {
    return fillImageChar(charCode, textRender, x, y, clampW, clampH);
  } else if (!isValidSpecialSymbol(charCode)) {
    return false;
  }
  if (isOverflow) return true; // ignore
  var transform = [0, 1]; // (left, right, up, down = 0, 1, 2, 3), percentage

  var tmpCellW = clampW / tileC;
  var tmpCellH = clampH / tileR;
  var sx = Math.floor(x * tmpCellW);
  var sy = Math.floor(y * tmpCellH);
  var ex = Math.floor((x + 1) * tmpCellW);
  var ey = Math.floor((y + 1) * tmpCellH);
  tmpCellW = ex - sx;
  tmpCellH = ey - sy;

  switch (charCode) { // 1/8 blocks
    case 0x2580:
      transform = [2, 4 / 8];
      break;
    case 0x2581:
      transform = [3, 1 / 8];
      break;
    case 0x2582:
      transform = [3, 2 / 8];
      break;
    case 0x2583:
      transform = [3, 3 / 8];
      break;
    case 0x2584:
      transform = [3, 4 / 8];
      break;
    case 0x2585:
      transform = [3, 5 / 8];
      break;
    case 0x2586:
      transform = [3, 6 / 8];
      break;
    case 0x2587:
      transform = [3, 7 / 8];
      break;
    case 0x2588:
      transform = [0, 8 / 8];
      break; // full block
    case 0x2589:
      transform = [0, 7 / 8];
      break;
    case 0x258A:
      transform = [0, 6 / 8];
      break;
    case 0x258B:
      transform = [0, 5 / 8];
      break;
    case 0x258C:
      transform = [0, 4 / 8];
      break;
    case 0x258D:
      transform = [0, 3 / 8];
      break;
    case 0x258E:
      transform = [0, 2 / 8];
      break;
    case 0x258F:
      transform = [0, 1 / 8];
      break;
    case 0x2590:
      transform = [1, 4 / 8];
      break;
    case 0x2594:
      transform = [2, 1 / 8];
      break;
    case 0x2595:
      transform = [1, 1 / 8];
      break;
    case 0x1FB82:
      transform = [2, 2 / 8];
      break;
    case 0x1FB83:
      transform = [2, 3 / 8];
      break;
    case 0x1FB84:
      transform = [2, 5 / 8];
      break;
    case 0x1FB85:
      transform = [2, 6 / 8];
      break;
    case 0x1FB86:
      transform = [2, 7 / 8];
      break;
    case 0x1FB87:
      transform = [1, 2 / 8];
      break;
    case 0x1FB88:
      transform = [1, 3 / 8];
      break;
    case 0x1FB89:
      transform = [1, 5 / 8];
      break;
    case 0x1FB8A:
      transform = [1, 6 / 8];
      break;
    case 0x1FB8B:
      transform = [1, 7 / 8];
      break;
    default:
      var is2by2 = charCode >= 0x2596 && charCode <= 0x259F;
      var is2by3 = charCode >= 0x1FB00 && charCode <= 0x1FB3B;
      var is2by4 = charCode >= 0x1CD00 && charCode <= 0x1FBE7;
      var is90degTri = charCode >= 0x25E2 && charCode <= 0x25E5;
      var isIsoTri = charCode == 0x25B2 || charCode == 0x25BA || charCode == 0x25BC || charCode == 0x25C4;
      var isTriangleShard = (charCode >= 0x1FB3C && charCode <= 0x1FB6F) ||
        (charCode >= 0x1FB9A && charCode <= 0x1FB9B) ||
        isBold && (is90degTri || isIsoTri);
      if (is2by2) { // 2x2 blocks
        var pattern = [2, 1, 8, 11, 9, 14, 13, 4, 6, 7][charCode - 0x2596];
        textRender.beginPath();
        if (pattern & 8) textRender.rect(sx, sy, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 4) textRender.rect(sx + tmpCellW / 2, sy, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 2) textRender.rect(sx, sy + tmpCellH / 2, tmpCellW / 2, tmpCellH / 2);
        if (pattern & 1) textRender.rect(sx + tmpCellW / 2, sy + tmpCellH / 2, tmpCellW / 2, tmpCellH / 2);
        textRender.fill();
        return true;
      } else if (is2by3) { // 2x3 blocks
        var code = 0;
        if (charCode >= 0x1FB00 && charCode <= 0x1FB13) code = charCode - 0x1FB00 + 1;
        if (charCode >= 0x1FB14 && charCode <= 0x1FB27) code = charCode - 0x1FB00 + 2;
        if (charCode >= 0x1FB28 && charCode <= 0x1FB3B) code = charCode - 0x1FB00 + 3;
        textRender.beginPath();
        for (var i = 0; i < 6; i++) {
          if (!(code >> i & 1)) continue;
          textRender.rect(sx + (tmpCellW / 2) * (i & 1), sy + (tmpCellH / 3) * (i >> 1), tmpCellW / 2, tmpCellH / 3);
        }
        textRender.fill();
        return true;
      } else if (isTriangleShard) { // LCS shard characters
        var vecIndex = charCode - 0x1FB3C;
        if (charCode >= 0x1FB9A && charCode <= 0x1FB9B) {
          vecIndex -= 42;
        } else if (is90degTri) {
          vecIndex = (charCode - 0x25E2) + 54;
        } else if (isIsoTri) {
          switch (charCode) {
            case 0x25B2:
              vecIndex = 58;
              break;
            case 0x25BA:
              vecIndex = 59;
              break;
            case 0x25BC:
              vecIndex = 60;
              break;
            case 0x25C4:
              vecIndex = 61;
              break;
          }
        }
        var vecs = lcsShardCharVectors[vecIndex];
        var gpX = [0, tmpCellW / 2, tmpCellW];
        var gpY = [0, tmpCellH / 3, tmpCellH / 2, (tmpCellH / 3) * 2, tmpCellH];
        textRender.beginPath();
        for (var i = 0; i < vecs.length; i++) {
          var vec = vecs[i];
          var gx = gpX[vec[0]];
          var gy = gpY[vec[1]];
          if (i == 0) {
            textRender.moveTo(sx + gx, sy + gy);
            continue;
          }
          textRender.lineTo(sx + gx, sy + gy);
        }
        textRender.closePath();
        textRender.fill();
        return true;
      } else if (is2by4) { // 2x4 LCS octant characters
        var code = 0;
        if (charCode >= 0x1CD00 && charCode <= 0x1CDE5) {
          code = lcsOctantCharPoints[charCode - 0x1CD00];
        } else {
          switch (charCode) {
            case 0x1CEA8:
              code = 1;
              break;
            case 0x1CEAB:
              code = 2;
              break;
            case 0x1CEA3:
              code = 64;
              break;
            case 0x1CEA0:
              code = 128;
              break;
            case 0x1FBE6:
              code = 20;
              break;
            case 0x1FBE7:
              code = 40;
              break;
          }
        }
        if (!code) return false;
        textRender.beginPath();
        for (var py = 0; py < 4; py++) {
          for (var px = 0; px < 2; px++) {
            var idx = py * 2 + px;
            if (code >> idx & 1) {
              textRender.rect(sx + px * (tmpCellW / 2), sy + py * (tmpCellH / 4), tmpCellW / 2, tmpCellH / 4);
            }
          }
        }
        textRender.fill();
        return true;
      } else {
        return false;
      }
  }
  var dir = transform[0];
  var frac = transform[1];

  switch (dir) {
    case 0:
      ex -= tmpCellW - (tmpCellW * frac);
      break;
    case 1:
      sx += tmpCellW - (tmpCellW * frac);
      break;
    case 2:
      ey -= tmpCellH - (tmpCellH * frac);
      break;
    case 3:
      sy += tmpCellH - (tmpCellH * frac);
      break;
  }

  textRender.fillRect(sx, sy, ex - sx, ey - sy);
  return true;
}
