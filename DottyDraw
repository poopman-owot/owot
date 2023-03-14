	const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
owotCtx.willReadFrequently = true;
context.willReadFrequently = true;
function getPixelColors(char) {

  canvas.width = 4;
  canvas.height = 8;
  context.imageSmoothingEnabled = false;
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black';
  context.font = '8px monospace';
  context.fillText(char, -1, 6);
  const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixelColors = [];
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    // Threshold the RGB values to determine if the pixel should be black or white
    const threshold = 220;
    const isBlack = (r + g + b) / 3 <= threshold;
    const color = isBlack ? [0, 0, 0] : [255, 255, 255];
    pixelColors.push(color);
  }
  return pixelColors;
}

function renderPixelColors(pixelColors) {

  canvas.width = 2;
  canvas.height = 8;
  context.imageSmoothingEnabled = false;

  for (let i = 0; i < pixelColors.length; i += 2) {
    const color1 = pixelColors[i];
    const color2 = pixelColors[i + 1];
    const x = Math.floor(i / 2) % canvas.width;
    const y = Math.floor(Math.floor(i / 2) / canvas.width);
    const avgColor = [
      Math.round((color1[0] + color2[0]) / 2),
      Math.round((color1[1] + color2[1]) / 2),
      Math.round((color1[2] + color2[2]) / 2)
    ];
    context.fillStyle = `rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`;
    context.fillRect(x, y, 1, 1);

  }

  const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  pixelColors = [];
  var j = 0;
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    // Threshold the RGB values to determine if the pixel should be black or white
    const threshold = 220;
    const isBlack = (r + g + b) / 3 <= threshold;
    const color = isBlack ? [0, 0, 0] : [255, 255, 255];
    if (j == 0 || j == 1 || j == 4 || j == 5 || j == 8 || j == 9 || j == 12 || j == 13) {

      pixelColors.push(color);
    }
    j++;
  }

  return pixelColors;
}

function compareArrays(arr1, arr2) {
  // Loop through each index of the arrays
  for (let i = 0; i < arr1.length; i++) {
    // If both values are arrays, recursively call compareArrays
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!compareArrays(arr1[i], arr2[i])) {
        return false;
      }
    } else if (arr1[i] !== arr2[i]) {
      // If the values are not the same and not arrays, return false
      return false;
    }
  }

  // If all values are the same, return true
  return true;
}
function addArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {

  }
  
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {

    }
    const nestedResult = [];
    for (let j = 0; j < arr1[i].length; j++) {
        nestedResult.push(Math.min(Math.max(0, (arr1[i][j] + arr2[i][j])), 255));
    }
    result.push(nestedResult);
  }
  return result;
}
function PixelBrailleCharacter(PixelArray) {
  const brailleStart = 0x2800; // Unicode value of first Braille character
  const brailleEnd = 0x28FF; // Unicode value of last Braille character

  for (let i = brailleStart; i <= brailleEnd; i++) {
    // console.log(String.fromCharCode(i));
    var braillCode = renderPixelColors(getPixelColors(String.fromCharCode(i)));
    if (compareArrays(braillCode, PixelArray)) {
      return(String.fromCharCode(i))
    }

    //console.log(String.fromCharCode(i),renderPixelColors(getPixelColors(String.fromCharCode(i))), PixelArray, PixelArray === braillCode)


  }


}


styles.cursor = "pointer"

function getCharDataFromPixels(x, y) {
  var tileX = 0;
  var tileY = 0;
  var charX = 0;
  var charY = 0;
      let black = [-255, -255, -255];
  let white = [0, 0, 0];
  var cellInnerCoords = [white, white,
      white, white,
      white, white,
      white, white
    ]
  var edge = false;
  var mpX = x - positionX - Math.trunc(owotWidth / 2);
  var mpY = y - positionY - Math.trunc(owotHeight / 2);
  var
    // add global cell position


    charX = Math.floor(mpX / cellW);
  charY = Math.floor(mpY / cellH);
  if (mpY / cellH < charY + 0.25 || mpY / cellH > charY + 0.75 && mpX / cellW < charX + 0.25 || mpX / cellW < charX + 0.75) {
    edge = true;
  }


  let locY = (mpY / cellH) - charY;
  let locX = (mpX / cellW) - charX;

  if (locX <= 0.5 && locY <= 0.25) {
    cellInnerCoords = [black, white,
      white, white,
      white, white,
      white, white
    ]
  }
  if (locX <= 0.5 && locY > 0.25 && locY <= 0.5) {
    cellInnerCoords = [white, white,
      black, white,
      white, white,
      white, white
    ]
  }
  if (locX <= 0.5 && locY > 0.5 && locY <= 0.75) {
    cellInnerCoords = [white, white,
      white, white,
      black, white,
      white, white
    ]
  }
  if (locX <= 0.5 && locY > 0.6) {

    cellInnerCoords = [white, white,
      white, white,
      white, white,
      black, white
    ]
  }
  if (locX > 0.5 && locY <= 0.25) {
    cellInnerCoords = [white, black,
      white, white,
      white, white,
      white, white
    ]
  }
  if (locX > 0.5 && locY > 0.25 && locY <= 0.5) {
    cellInnerCoords = [white, white,
      white, black,
      white, white,
      white, white
    ]
  }
  if (locX > 0.5 && locY > 0.5 && locY <= 0.75) {
    cellInnerCoords = [white, white,
      white, white,
      white, black,
      white, white
    ]
  }
  if (locX > 0.5 && locY > 0.75) {
    cellInnerCoords = [white, white,
      white, white,
      white, white,
      white, black
    ]
  }

  // add tile position
  tileX = Math.floor(charX / tileC);
  tileY = Math.floor(charY / tileR);
  // add in-tile cell position
  charX = charX - (Math.floor(charX / tileC) * tileC);
  charY = charY - (Math.floor(charY / tileR) * tileR);
  return [
    [tileX, tileY, charX, charY],
    cellInnerCoords,
    getChar(tileX, tileY, charX, charY),
    edge
  ];
}

function determineDrawnPixel(arr) {
  const [location, innerCoords, char, edge] = arr;


}

document.addEventListener('mousemove', function(e) {
  if (event.ctrlKey) {
    let [location, innerCoords, char, edge] = getCharDataFromPixels(e.x, e.y);
    let [x, y, z, w] = location;
    //console.log(PixelBrailleCharacter(addArrays(innerCoords,renderPixelColors(getPixelColors(char)))))
      //console.log(PixelBrailleCharacter(renderPixelColors(getPixelColors(getChar(location)))))
//PixelBrailleCharacter(renderPixelColors(getPixelColors("⣫")))
//console.log(renderPixelColors(getPixelColors(char)))
      //console.log((renderPixelColors(getPixelColors(char))))
      let charNew = (PixelBrailleCharacter(addArrays(innerCoords,(renderPixelColors(getPixelColors(char))))))
    if (edge && char !== "undefined") {
       writeCharTo(charNew,YourWorld.Color,x,y,z,w)
    }
  }
});

alert("ctrl + mousedrag")
