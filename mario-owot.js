//--------------------------------------------INIT Variables---------------------------------------------------------------------------------
const characterList = {};
const blockList = {};
w.input.disabled = true
cursorEnabled = false;

//--------------------------------------------START OF HELPER FUNCTIONS----------------------------------------------------------------------

function CellToPixelCoords(cellCoords = [0, 0, 0, 0])
// arguments can either be [x, y, z, w] or x, y, z, w
{

  let x, y, z, w;
  // If input is an array
  if (Array.isArray(cellCoords) && cellCoords.length < 5) {
    [x = 0, y = 0, z = 0, w = 0] = cellCoords;
  }
  // If input is four separate arguments
  else if (arguments.length < 5) {
    [x = 0, y = 0, z = 0, w = 0] = arguments;
  }
  // Invalid input
  else {
    console.error('CellToPixelCoords: Invalid cellCoords. Arguments can either be [x, y, z, w] or x, y, z, w. Your cellCoords was: ' + cellCoords);
    return;
  }
  let X = ((Math.round(x) * tileW) + (z) * cellW) + Math.round(positionX) + Math.round(owotWidth / 2);
  let Y = ((Math.round(y) * tileH) + (w) * cellH) + Math.round(positionY) + Math.round(owotHeight / 2);
  return [X, Y];
}


function PixelToCellCoords(pixelCoords = [0, 0]) {
  // arguments can either be [x, y] or x, y

  let x, y;

  // If input is an array
  if (Array.isArray(pixelCoords) && pixelCoords.length < 3) {
    [x = 0, y = 0] = pixelCoords;
  }
  // If input is two separate arguments
  else if (arguments.length < 3) {
    [x = 0, y = 0] = arguments;
  }
  // Invalid input
  else {
    console.error('PixelToCellCoords: Invalid pixelCoords. Arguments can either be [x, y] or x, y. Your pixelCoords was: ' + pixelCoords);
    return;
  }

  return getTileCoordsFromMouseCoords(x, y);
}

function Lerp(start = 0, end = 0, amt = 0.5, roundResult = false) {
  let value = (1 - amt) * start + amt * end;
  if (roundResult) {
    value = Math.round(value);
  }
  return value;
}

function LerpArray(startArray, endArray = startArray * 0, amt = 0.5, roundResult = false) {
  let resultArray = [];

  for (let i = 0; i < startArray.length; i++) {
    let value = Lerp(startArray[i], endArray[i], amt, roundResult);
    resultArray.push(value);
  }

  return resultArray;
}

function ScrollWorld(offset = [0, 0]) {
  let x, y;

  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (arguments.length < 3) {
    [x = 0, y = 0] = arguments;
  }
  // Invalid input
  else {
    console.error('ScrollWorld: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ' + offset);
    return;
  }
  var deltaX = Math.trunc(x);
  var deltaY = Math.trunc(y);

  positionY -= deltaY;
  positionX -= deltaX;

  w.emit("scroll", {
    deltaX: -deltaX,
    deltaY: -deltaY
  });
  w.render();
  return [deltaY, deltaX];
}

function SubtractArrays(arr1, arr2, roundResult = false) {
  let resultArray = [];

  for (let i = 0; i < arr1.length; i++) {
    let value = arr1[i] - arr2[i];
    if (roundResult) {
      value = Math.round(value);
    }
    resultArray.push(value);
  }

  return resultArray;
}

function AddArrays(arr1, arr2, roundResult = false) {
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

function centerPlayer(coords, offset = [0, 0], lerpSpeed = 0.01) {
  let x, y;
  // If input is an array
  if (Array.isArray(offset) && offset.length < 3) {
    [x = 0, y = 0] = offset;
  }
  // If input is two separate arguments
  else if (arguments.length < 4) {
    [x = 0, y = 0] = arguments;
  }
  // Invalid input
  else {
    console.error('centerPlayer: Invalid offset. Arguments can either be [x, y] or x, y. Your offset was: ' + offset);
    return;
  }
  return ScrollWorld(LerpArray([0, 0], SubtractArrays(CellToPixelCoords(coords), [(owotWidth / 2) + x, (owotHeight / 2) + y]), lerpSpeed))
}

function CorrectLocation(...args) {
  let location;
  if (Array.isArray(args[0])) {
    location = args[0];
  } else {
    location = args;
  }
  location[0] = Math.round(location[0]);
  location[1] = Math.round(location[1]);
  location[2] = Math.round(location[2]);
  location[3] = Math.round(location[3]);

  const outlocation = location.slice();

  if (Math.round(location[2]) > 15) {
    outlocation[2] = (((location[2] % 16 + (location[2] < 0 ? 17 : 0)) + 16) % 16)
    outlocation[0] += Math.abs((Math.ceil(-(location[2]) / 16)))
  }
  if (Math.round(location[2]) < 0) {
    outlocation[2] = (((location[2] % 16 + (location[2] < 0 ? 17 : 0)) - 1 + 16) % 16)
    outlocation[0] -= Math.ceil(-(location[2]) / 16)
  }
  if (Math.round(location[3]) > 7) {
    outlocation[3] = (((location[3] % 8 + (location[3] < 0 ? 9 : 0)) + 8) % 8)
    outlocation[1] += Math.abs((Math.ceil(-(location[3]) / 8)))
  }
  if (Math.round(location[3]) < 0) {
    outlocation[3] = (((location[3] % 8 + (location[3] < 0 ? 9 : 0)) - 1 + 8) % 8)
    outlocation[1] -= Math.ceil(-(location[3]) / 8);
  }
  return outlocation;
}

function DoesCellContainChars(coord, specificChars) {
  const [x, y, z, w] = CorrectLocation(coord);

  const char = getChar(Math.round(x), Math.round(y), Math.round(z), Math.round(w));
  if (specificChars === undefined || specificChars === null) {
    return char !== " ";
  }
  return specificChars.includes(char);
}

function GetPlayer(id) {
  // if name is null it will return the first player
  for (const key in characterList) {
    if (characterList[key] instanceof Player && (id === undefined || characterList[key].id === id)) {
      return characterList[key];
    }
  }
  return null;
}

function GetBlock(id) {
  // if name is null it will return the first player
  for (const key in blockList) {
    if (blockList[key] instanceof Block && (id === undefined || blockList[key].id === id)) {
      return blockList[key];
    }
  }
  return null;
}


function drawAnimatedGif(img, src, width, height, x, y) {
  // Get the total number of frames in the GIF
  var totalFrames = img.naturalWidth / width;

  // Create a variable to keep track of the current frame
  var currentFrame = 0;

  // Define the function to draw each frame
  function drawFrame() {
    // Clear the canvas
    owotCtx.clearRect(0, 0, owot.width, owot.height);

    // Draw the current frame of the GIF onto the canvas
    owotCtx.drawImage(img, currentFrame * width, 0, width, height, x, y, width, height);

    // Increment the current frame, looping back to the start if necessary
    currentFrame = (currentFrame + 1) % totalFrames;
  }

  // Set an interval to redraw the canvas every 100 milliseconds (adjust as needed)
  setInterval(drawFrame, 100);

  // Start loading the GIF image
  img.src = src;
}

function canPlayerMove(frame, velocity) {

  let v = Math.abs(velocity);
  if (v > 6) {
    return !((frame % Math.round(10 / (10 - v))) < ((10 - v) / 10))
  } else {

    return ((frame % Math.round(10 / v)) < (v / 10));

  }
}

function CycleImage(imageArray, index) {
  return imageArray[index % imageArray.length];
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
function FindCharsInViewport(pattern, caseInsensitive, ignoreCombining) {
        var re = new RegExp(pattern);
        var visible = getVisibleTiles();
        var chars = [];
        for (var i = 0; i < visible.length; i++) {
            var coord = visible[i];
            var tile = tiles[coord[1] + "," + coord[0]];
            if (!tile) continue;
            var con = advancedSplit(tile.content, false, ignoreCombining);
            for (var p = 0; p < con.length; p++) {

                if ((caseInsensitive && re.test(con[p])) || (!caseInsensitive && re.test(con[p]))) continue;
                var cx = p % tileC;
                var cy = Math.floor(p / tileC);
                chars.push([coord[0], coord[1], cx, cy]);

            }
        }
        return chars;
    }
//--------------------------------------------END OF HELPER FUNCTIONS----------------------------------------------------------------------




//--------------------------------------------START CREATE CLASSES ------------------------------------------------------------------------

class Character {
  constructor(x, y, z, w, id) {
    this.frame = 0;
		this.frameSlowdown = 0;
    this.name = "character";
    this.location = [x, y, z, w];
    this.imgOffset = [0, 0];
    this.imageCoords = CellToPixelCoords(this.location);
    this.imageCoords_Old = this.imageCoords;
    this.velocity = [0, 0];
    this.lives = 1;
    this.alive = true;
    this.canFly = false;
    this.isFacingLeft = false;
    this.id = id;
    this.moveUp = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.squat = false;
    this.jumped = false;
    this.jumpFrames = 3;
    this.onPlatform = false;
    this.isMain = false
    this.img = new Image();
    this.imagURL = "";
    this.cellRep = " ";
    this.blockers = null;
    this.sprites = {};
    this.tickEveryN = 1;
    characterList[id] = this;

    // request animation frame and bind this to the tick function
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  onCreated() {
    console.log(`Character ${this.id} created`);
  }

  onDie() {
    console.log(`Character ${this.id} died`);
    delete characterList[this.id];
  }

  onDamaged() {
    this.lives--;
    console.log(`Character ${this.id} damaged, lives left: ${this.lives}`);
    if (this.lives <= 0) {
      this.die();
    }
  }

  die() {
    this.alive = false;
    this.onDie();
  }
  update() {
    this.frame++
    if (this.frame > 10) {
      this.frame = 1;
    }
  }
  setVelocity() {
    // first break out the location and velocity of the character.
    var [x, y, z, w] = this.location;
    var [vX, vY] = this.velocity;
    //try moving up
    if (this.moveUp) {
      this.moveUp = false;
      //check the cell above for any blocking chars to see if you can move up.
      let blocked = DoesCellContainChars([x, y, z, w - 1], this.blockers);
      if (!blocked) {
        //check if either you can jump, or if you can fly.

        vY = -20;


      }

      //if there is a blocking char. you should be stopped. making you velocity y 0 but only if its positive because gravity should then take over.
    }
    //try moving left
    if (this.moveLeft && !this.squat) {
      this.isFacingLeft = true;
      //check the cell to the left for any blocking chars to see if you can move left. 
      let blocked = DoesCellContainChars([x, y, z - 1, w], this.blockers);
      //add nagative velocity to the x.
      if (!blocked) {
        if (vX >= 0) {
          vX = -1
        }
        vX -= 0.5
      }
      //if there is a blocking char. you should be stopped. making you velocity x 0
    }
    //try moving right
    if (this.moveRight && !this.squat) {
      //check the cell to the right for any blocking chars  to see if you can move right.
      this.isFacingLeft = false;
      let blocked = DoesCellContainChars([x, y, z + 1, w], this.blockers);
      //add velocity to the x.
      if (!blocked) {
        if (vX == 0) {
          vX += 1
        }
        vX += 0.5
      }
      //if there is a blocking char. you should be stopped. making you velocity x 0
    }
    if (this.squat) {
      this.imgSrc = this.sprites.big.squatting;
    }

    let blocked = DoesCellContainChars([x, y, z, w + 1], this.blockers);
    if (!blocked) {
      if (vY > 5) {
        this.imgSrc = this.sprites.big.falling;

      } else {
      if(this.moveRight || this.moveLeft){
if(Math.abs(vX)>5){
 this.imgSrc = this.sprites.big.running;
}
else{
          this.imgSrc = this.sprites.big.walking;
}
}
else{
 this.imgSrc = this.sprites.big.standing;
}
      }

    } else {
      if (!this.squat) {
if(this.moveRight || this.moveLeft){
          this.imgSrc = this.sprites.big.walking;
}
else{
        this.imgSrc = this.sprites.big.standing;
}
      }
    }

    //set the min max of the velocity to 100
    this.velocity[0] = Math.max(Math.min(vX, 10), -10);
    this.velocity[1] = Math.max(Math.min(vY, 10), -10);

  }


  //do the actual movement based on velocity
  move() {
    let [x, y, z, w] = this.location;
    //move right or left up or down
    let a, b;
    //check if the player can move left or right
    if (canPlayerMove(this.frame, this.velocity[0])) {
      a = Math.max(Math.min(this.velocity[0], 1), -1);
    } else {
      a = 0;
    }

    //check if should stop velocity x
    //moving right

    if (DoesCellContainChars([x, y, z + a, w], this.blockers)) {
      a = 0;
      this.velocity[0] = a;

    }

    //moving left



    //check if the player can move up or down
    if (canPlayerMove(this.frame, this.velocity[1])) {


      b = Math.max(Math.min(this.velocity[1], 1), -1);
      if (b < 0) {
        this.velocity[1] = Math.max(this.velocity[1], -3);
        this.imgSrc = this.sprites.big.jumping;
      }
    } else {
      b = 0;
    }

    if (DoesCellContainChars([x, y, z + a, w + b], this.blockers)) {
      a = 0;
      b = 0;
    }
    let [x1, y1, z1, w1] = CorrectLocation(x, y, z, w);
    writeCharTo(" ", "#000", x1, y1, z1, w1);



    this.location = [x, y, z + a, w + b];

  }
  slowDown() {
    let [x, y, z, w] = this.location;
    let [vX, vY] = this.velocity;

    vX = Lerp(vX, 0, 0.1);
    this.velocity[0] = vX;
    if (vY < -2) {
      vY = Lerp(vY, 10, 0.01);
    } else {
      vY = Lerp(vY, 10, 0.5);
    }

    if (DoesCellContainChars([x, y, z, w + 1], this.blockers)) {
      this.velocity[1] = 0;
      this.jumped = false;
    } else {
      this.velocity[1] = vY;
    }

  }
  draw() {

    let [a, b, c, d] = CorrectLocation(this.location);

    writeCharTo(this.cellRep, "#000", a, b, c, d)
  }
  renderPlayer() {
    // Create a new canvas for mirroring the image
    const mirroredCanvas = document.createElement('canvas');
    this.img.src = CycleImage(this.imgSrc,this.frame);

    mirroredCanvas.width = this.img.width;
    mirroredCanvas.height = this.img.height;

    // Get the canvas context and mirror the image horizontally
    const ctx = mirroredCanvas.getContext('2d');
    ctx.translate(this.img.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    // Draw the mirrored or original image on the main canvas depending on the player's direction
    //const imgX = ((this.location[0] * tileW) + (this.location[2] * cellW) + positionX + Math.trunc(owotWidth / 2));
    //const imgY = ((this.location[1] * tileH) + (this.location[3] * cellH) + positionY + Math.trunc(owotHeight / 2)) - 0;


    this.imageCoords = LerpArray(CellToPixelCoords(this.location), this.imageCoords_old, 0.5);

    owotCtx.drawImage(this.isFacingLeft ? mirroredCanvas : this.img, this.imageCoords[0], this.imageCoords[1], (tileW / 16), (tileH / 8));
    this.imageCoords_old = this.imageCoords;

    // move the screen to center the player location
    if (this.isMain) {
      this.imgOffset = centerPlayer(this.location);
    }
  }
  tick() {
    // Slow down the animation by dividing the time delta by 2

    // Save the current timestamp for the next frame
this.frameSlowdown ++;
if(this.frameSlowdown == this.tickEveryN){


    this.update();

    this.setVelocity();
    this.move();
    this.slowDown();
    this.draw();

this.frameSlowdown = 0
}
    this.renderPlayer()
    requestAnimationFrame(this.tick); // request next animation frame
  }

}

class Player extends Character {
  constructor(x, y, z, w, name) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = name;
    this.lives = 3;
    this.id = name + "_" + (Object.keys(characterList).length - 1);
    this.big = false;
    this.isMain = true;
    this.onCreated();
    this.sprites = {
      big: {
        standing: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC"],
        walking: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg==","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB/UlEQVRIie2UIZfaQBSFv3DWF4lLcHFlXR3wCxZcZOrqMrjKrKvLrKuMxBFcZXB1RMYBDpk63KsYMiQQ6NZU9Z0zybxJ7s29b14G/ofz6OEM5Hotu8J0EtTA1USZhe/AFzOd57pF8tQFroHrY8XHrzs8nuFHwnr0+bGFGrw+ViYv0/v+rtXPQGSiJPNDwVh4z7iAMz/8W7AA9O7pExUhJzGjMe+0ICoSKXLLLCoy4yQmPz87563oiYpEH7NbCeG8W1mRSxK4luhiIV1dtOk3Myk3iIogXSFFDuXmhtCpLTTBUuRmPpqQBC5qMGuB9DFjsTw4zULImehWxeNwagvONUiK3Cq5B7aXuvcz6JTclN6MxfLgODOQ0A87Aem5lceBa9dUukeHnr3bn+ll0G+Bh5ULo4Rd/wBHk+9+KguuwxLowWUbh8UUTYUOxkzpo5YbNBXTbykv14WYgYwD17Lq0ANgszwAMCq3ABT+s80/xDNbA5LAFTnJzUgCV+Jya/O43NrcGyUdnfjOGH7SRL6mbufeYnlwatm2HqHHr9hs2eu+4HVfAJAGOZGvUbH9T8R2YtLYqrUfAzAJRnatBtexONfoqQl+K81Z6PnmpXxZ/NHSzaEKsM+qh6D664BjCVQ8h1i3lOyLRfvg9F1pgA1D00KT+YEA6Xqnfcr+y/gNVd0x+2BIzPQAAAAASUVORK5CYII=","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg=="],
        //running: "https://i.imgur.com/FAlNx6v.gif",
        jumping: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACM0lEQVRIia2VoXLjMBCGP3UCyq7wWFwW1vQJ4rBjdZmhy45ZYQfzBlbYQUOzOKzsnCeoj5k1YYWFYXtAkWInTqbtnGZ2LK33//XveiUrPjGyeChuPiu26jNYsngoshNvbbIvgd1zcAkYgQCsiy3rwipe7rob9xI44DLU1vEb+Gmnj9eqQ3JCEIE44OrtnbtfrwTcw3PGavwEgEkCoKeQEYiEWspRIuUoEaySXnMqe8GXgEd2AH9k1z6Cq74iAohOkZ1Ya81bm3aCRerKM4tOre3ErvfvZCcioRYJta/BlehUzFt5KiF57JdmIsz3pV8eUsgPTmUWdtKsEZ1CvkTqCpq1jylBAQyUWSjRqbi8lVnYYECNQwCyeIjO+wW5RvDVEZ12VZwfqp3CydGUuvJKLmxsJ+2uSkYJDz++9aLMW8ltPSVqck8wcL3vKvvKH1bPUwDyxiY+iYcALBqN4W9XSgQyiYfofGN32R+U23qKvr6zpDdbAKbhHZvynU09O6SQxUNx4I7cJOC2nmLiCQC6sJ/QxJMOycULJW9ywth+lXz+tPdOTgP7rqx58yLz5sX7jte+iOAuhsA7V6M54SVpreGLEYwzAQiiGwDCeNwLqIqayqeDOnucq6LurPO4Yj6656GZI412bnEEXv6mfD9Lku37QY2M9w0AsS8Miz2zIwmiG/L4bDsDRzdS2mJ2RJt6ptqNMyu2nRh1UNAJOPffO/6dKfYEIo2WnoBzJCdxHwX///EPnoJ1rBWC8uAAAAAASUVORK5CYII="],
        burnt: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABfklEQVRIid2UIZaDMBiEv/BWcAQkshJZ2SMgkSsrkRwhElm5EskRVlYikUiOgMuKkvRPIBS9815fE/LP/DMhAf4/SjDyP0RypljOwzUV6yjRjTXVpQWgDzhJSAoL9M/1JbIs8rGrV7Guq9gRFEBiybJz/5nsXGwcnCDuOwixLIv76Spz410HusoMQNPNjhxDmqb+W7DkSPHu2BM4Ilon7XfuxrrKjGzqRbAxdJVtxiGablZOALGRknwCykbYHOlY508wgM1ownnwHMC4zuJEHnZfozne5jKVwDPIb+frxnlxVewkDoUG4H5p3YaWRK4zQFff6eq7RwZ4jDVlNBAk1ypzRCtUDM1usb1oeaGd66+Y8rSK5Ksb62IQ5EOBEDLWNDTvt/DsZtr5/RWo2gdDoSlFd0m2sDGUHdjcvbDbC5GdeK+7UIIJ7NkObp7vrDuBvNBmvE1cfnMAxttE2j5cgVwfbxOAt654nXHPYnhcj2p2PyhnsAoaReQohw5iQn87pMdTVuCWCAAAAABJRU5ErkJggg=="],
        falling: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACDUlEQVRIicWVobLbMBBFjzIPlDWwzH4srOkfJF8Qhxkalln5gqaszA4rq6FZXFbofEFdZpiwwMCwLZCtWLZj8mbandFovdp7tXelKPC/TY0FA5B+rHiSOwgGINEiYvNhbgLfgc+wLdNRktkU+Bz9Ngu/kmkdLbhYRCIrLY2EqfEmsEPiSGh0ErjkkzZrdXcBRSeh63fIVDcoxSJ6Wrro2Jmf6u8TdACOP5AAkNWZU6ro2Mx3Qe4C0fbh9wkKUEcdI1XprkRbI/adcuYBgehY0msxujhmUpWShN7IMWZH66r0YJz6ZORkR1NhfRoQvqj0oJomITpGpQcrRy1XACShh87GK2qF2ZLaBtoqnpuC5iLJSpOEHkno0fZDqnLY2MaS0Ht8BCBJ6IncxY4k9ER0LFKVzkhCz+baRvbBXZIApN2gC+zmvEyJrJbmHTheLwCkkY/Ozk7ObJdfVBr5TjCNfF6rNen9D34wZ736yM/rjddqzfpbZnN2+UXZ69W9HKf8YsmWtXmVqsUnAG77H2zqPbv8ouxRAPjLRPxgboGrcAnAF9/MX88VAO/3AXq/RS1SAOU8KOfiNtUSytyQNGAA28Thz6yxdmeATb0frM8wxzSooswruyNAFo5fKishfpTFubg5clrwrtPc1lS/gkOtB0nnatd9DBy5tgK937LLL/3kwTfuv5P1xx/Mf2F/AcE7WqCCH7iFAAAAAElFTkSuQmCC"],
        squatting: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABSUlEQVRIie2TLXaEMBSFPzgVld3BZFwk3QFLYBwyO4DsgB1AXd0gcbCE7KBIJOMqkXWpADL8TVXlfOdE5MG9777DA548efLkn/AePYjAbmvNwfu7wiysw3RnejHFzuhlK94KL6YYzT6hFhbv1YOxybp5BNaGqZ0SuGPD1DZSrWrL4y0NpnjYn/v4U8eH+AAiyA/FHN1b404en0aDWfwXNk2wrdnVPRHkVlUhAJl8JwLqRdfLNEKdJith8d2gq5vnvoKpWiJASeVEM3Wa4BUfh8H8WbxESYWSyu3C2QjsJsE8gb+8DdmVsivv8U3BkF0R0RtnIxBBTtZ9IYIcpj1YGSxNyq5kyK4AhHEwJqtCytjQt/p4E2faICeRBXQZAFreyOMTWmrXecbvW+31zeAKfTOM4gW2S9HVDdulsPnJnNu8TH2rj0JtcbpfhwCSTCqBdZsAAAAASUVORK5CYII="],
        sliding: "https://i.imgur.com/XtiJZyA.png",
      },
      small: {
        standing: "https://i.imgur.com/qZdpy4m.png",
        walking: "https://i.imgur.com/A4TA5jg.gif",
        running: "https://i.imgur.com/hhj15NQ.gif",
        jumping: "https://i.imgur.com/54RtQTs.png",
        dying: "https://i.imgur.com/1BvCcQI.png",
        falling: "https://i.imgur.com/EkTsZC3.png",
        squatting: "https://i.imgur.com/fytAWqC.png",
        sliding: "https://i.imgur.com/SezxHNy.png"
      }
    }
  }
}


class Block {
  constructor(x, y, z, w, name) {
	this.location = [x, y, z, w];
  this.pixelLocation = CellToPixelCoords(this.location);
  this.isAnimated = false;
	this.sprites = {};
  this.canDestroy = false;
	this.id = name + "_" + Object.keys(blockList).length
  this.name = "block";
  this.img = new Image();
	this.imgSrc = ["https://i.imgur.com/qZdpy4m.png"];
  this.imagURL = "https://i.imgur.com/qZdpy4m.png";
	this.frame = 0;
  blockList[this.id] = this;
  
      // request animation frame and bind this to the tick function
    this.tick = this.tick.bind(this);
    
	this.onCreated();
}
  onCreated() {
    console.log(`Block ${this.id} created`);

  }
  
    renderBlock() {
    this.pixelLocation = CellToPixelCoords(this.location);
    // Create a new canvas for mirroring the image
    const mirroredCanvas = document.createElement('canvas');
    this.img.src = CycleImage(this.imgSrc,this.frame);

    mirroredCanvas.width = this.img.width;
    mirroredCanvas.height = this.img.height;

    // Get the canvas context and mirror the image horizontally
    const ctx = mirroredCanvas.getContext('2d');
    ctx.translate(this.img.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    owotCtx.drawImage(this.isFacingLeft ? mirroredCanvas : this.img, this.pixelLocation[0], this.pixelLocation[1], (tileW / 16), (tileH / 8));

    // move the screen to center the player location
    if (this.isMain) {
      this.imgOffset = centerPlayer(this.location);
    }
  }
    update() {
    this.frame++
    if (this.frame > 10) {
      this.frame = 1;
    }
  }

  tick(){
  this.update();
	this.renderBlock();
 // request next animation frame
}
}



//--------------------------------------------END OF CREATE CLASSES ----------------------------------------------------------------------

//--------------------------------------------START OF CREATE LISTENERS ----------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
  if (event.key === "w") {

    if (GetPlayer().jumped == false) {

      GetPlayer().moveUp = true;
      GetPlayer().jumped = true;
    }

    // Handle the "W" key press
  } else if (event.key === "a") {
    GetPlayer().moveLeft = true;
    // Handle the "A" key press
  }
  if (event.key === "s") {
    GetPlayer().squat = true;
    // Handle the "S" key press
  }
  if (event.key === "d") {
    GetPlayer().moveRight = true;
    // Handle the "D" key press
  }
  if (event.key === " ") {
    // Handle the spacebar press
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w") {
    GetPlayer().moveUp = false;
    // Handle the "W" key release
  }
  if (event.key === "a") {
    GetPlayer().moveLeft = false;
    // Handle the "A" key release
  }
  if (event.key === "s") {
    // Handle the "S" key release
    GetPlayer().squat = false;
  }
  if (event.key === "d") {
    GetPlayer().moveRight = false;
    // Handle the "D" key release
  }
  if (event.key === " ") {
    // Handle the spacebar release
  }
});


//--------------------------------------------END OF CREATE LISTENERS ----------------------------------------------------------------------
var player = new Player(0, 0, 0, 0, "luigi")
player.imgSrc = "https://i.imgur.com/FAlNx6v.gif";



        var chr = FindCharsInViewport("[^x]", true, true);
        for (var i = 0; i < chr.length; i++) {
            if (getCharColor(chr[i][0], chr[i][1], chr[i][2], chr[i][3]) !== 1) {
                var block = new Block(chr[i][0], chr[i][1], chr[i][2], chr[i][3],"block");
                localWriteChar(chr[i][0], chr[i][1], chr[i][2], chr[i][3], ".", 1)
                

            }

        }
        w.redraw();
    
function gameTick(){

  // if name is null it will return the first player
  for (const block in blockList) {
    if (blockList[block] instanceof Block) {
      blockList[block].tick();
    }
  }
requestAnimationFrame(gameTick);


}
requestAnimationFrame(gameTick);
