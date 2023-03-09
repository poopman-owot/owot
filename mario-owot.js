//--------------------------------------------INIT Variables---------------------------------------------------------------------------------
const characterList = {};
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
//--------------------------------------------END OF HELPER FUNCTIONS----------------------------------------------------------------------

//--------------------------------------------START CREATE CLASSES ------------------------------------------------------------------------

class Character {
  constructor(x, y, z, w, id) {
    this.frame = 0;

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
      //  this.imgSrc = this.sprites.big.standing;
      }

    }
else{
if(!this.squat){
this.imgSrc = this.sprites.big.standing;
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
    this.img.src = this.imgSrc;
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
    this.update();
    this.setVelocity();
    this.move();
    this.slowDown();
    this.draw();
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
        standing: "https://i.imgur.com/3AbgTGV.png",
        walking: "https://i.imgur.com/FAlNx6v.gif",
        running: "https://i.imgur.com/FAlNx6v.gif",
        jumping: "https://i.imgur.com/Ds1wIuU.png",
        burnt: "https://i.imgur.com/OHNBHp4.png",
        falling: "https://i.imgur.com/6iwR8Wp.png",
        squatting: "https://i.imgur.com/KJik4SF.png",
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
