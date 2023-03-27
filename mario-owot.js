//--------------------------------------------INIT Variables---------------------------------------------------------------------------------
const characterList = {};
var blockList = {};
const blockers = "";
var globalTickItorator = 0;
w.input.disabled = true
cursorEnabled = false;
const mirroredCanvas = document.createElement('canvas');
const marioSpecChars = "ቶዱዳጰጀደዤፃይያጶጆዸዥ";
const superMarioChars = "⛹█▓▆▅▄□▤▦▩☵▫[]≣║│╔╕╚╛◠╭╮▣ቶዱዳጰጀደዤፃይያጶጆዸዥ⡀⠂⠁";
bufferLargeChars = false;
var charImages = [];
for (block in superMarioChars) {
  charImages.push(new Image)
}

const smSmall = "▫";
const sm_halfY = "▫▣";
const sm_halfX = "▫";
const sm_backGround = "◠╭╮▫⡀⠂⠁";
const sm_destructable = "";
const passthrough_erase = "▫⡀⠂⠁";
const sm_hurts = "⡀⠂⠁☵";
const sm_hurts_fire = "⡀⠂⠁☵";
const sm_enemy = "ቶዱዳጰጀደፃይያጶጆዸ"
const sm_jumpThrough = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*(){}[]:;<>,.?/\\|'\"~`"
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
  if (specificChars === undefined || specificChars === null || specificChars === "") {
    return [char !== " ", char];
  }

  return [specificChars.includes(char), char];
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




function canPlayerMove(frame, velocity) {

  let v = Math.abs(velocity);
  if (v > 6) {
    return !((frame % Math.round(10 / (10 - v))) < ((10 - v) / 10))
  } else {

    return ((frame % Math.round(10 / v)) < (v / 10));

  }
}

function CycleImage(imageArray, index) {
  return imageArray[globalTickItorator % imageArray.length];
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

function getJSONFromCell(x, y, z, w) {
  return JSON.parse("{" + getLink(x, y, z, w).url.replace(/.*\/\//g, "") + "}");
}

function addIfNewLocation(List, NewObject) {
  const {
    location
  } = NewObject;
  let locationFound = false;

  for (const key in List) {
    const obj = List[key];
    if (obj.location && obj.location.every((val, i) => val === location[i])) {
      locationFound = true;
      break;
    }
  }

  if (!locationFound) {
    List[Object.keys(List).length] = NewObject;
  }

  return locationFound;
}




function tickAllObjects(List) {
  w.render();
  for (const key in List) {
    const o = List[key];

    o.tick();

  }

  //player.tick();

  requestAnimationFrame(() => tickAllObjects(List));
}
//--------------------------------------------END OF HELPER FUNCTIONS----------------------------------------------------------------------




//--------------------------------------------START CREATE CLASSES ------------------------------------------------------------------------

class Character {
  constructor(x, y, z, w, id) {
    this.frame = 0;
    this.frameSlowdown = 0;
    this.name = "character";
    this.location = [x, y, z, w];
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
    this.isMain = false;
    this.isProjectile = false;
    this.imagURL = "";
    this.cellRep = ["🯅"];
    this.blockers = blockers;
    this.sprites = {};
    this.tickEveryN = 1;
    this.eraseChar = " ";
    this.canTick = true;
    this.canTakeDamage = true;
    characterList[id] = this;
		
    // request animation frame and bind this to the tick function
    this.tick = this.tick.bind(this);
    //requestAnimationFrame(this.tick);
  }
  
  onCreated() {
    console.log(`${this.id} created`);
  }

  onDie() {
    console.log(`${this.id} died`);
    let [x, y, z, w] = CorrectLocation(this.location);
    writeCharTo(" ", "#000", x, y, z, w);
    if (this.isProjectile) {

      if (this.isFacingLeft) {
        let [a, b, c, d] = CorrectLocation([x, y, z - 1, w]);

        //sm_jumpThrough sm_backGround
        if (!DoesCellContainChars([a, b, c, d], sm_backGround)[0]) {
        let [isenemy, CharE] = DoesCellContainChars([x, y, z + 1, w], sm_enemy);
if(isenemy){
writeCharTo("⡀", "#000", a, b, c, d);
}
else{
writeCharTo(" ", "#000", a, b, c, d);
}
          writeCharTo(" ", "#000", a, b, c, d);
          writeCharTo(" ", "#000", x, y, z, w);
        }
      } else {
        let [a, b, c, d] = CorrectLocation([x, y, z + 1, w]);
        if (!DoesCellContainChars([a, b, c, d], sm_backGround)[0]) {
let [isenemy, CharE] = DoesCellContainChars([x, y, z + 1, w], sm_enemy);
if(isenemy){
writeCharTo("⡀", "#000", a, b, c, d);
}
else{
writeCharTo(" ", "#000", a, b, c, d);
}
          writeCharTo(" ", "#000", x, y, z, w);
        }
      }
    }
else{
confirm("you died")
location.reload()
}
    delete characterList[this.id];
  }

  onDamaged() {
    this.lives--;
    console.log(`${this.id} damaged, lives left: ${this.lives}`);
    if (this.lives <= 0) {
      this.die();
    }
  }
  onFire() {
if(this.canTakeDamage){
this.onDamaged();

    //ዤዥ
    if (this.isFacingLeft) {
      this.cellRep = ["ዥ"]
    } else {
      this.cellRep = ["ዤ"]
    }
    this.canTick = false;
    this.canTakeDamage = false;
    const _this = this;
    setTimeout(function() {

      _this.canTick = true;
      _this.canTakeDamage = false;

        setTimeout(function() {
        _this.canTakeDamage = true;

      }, 2000)
    }, 2000)
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
      vY = -10;


      //if there is a blocking char. you should be stopped. making you velocity y 0 but only if its positive because gravity should then take over.
    }
    //try moving left
    if (this.moveLeft && !this.squat) {
      this.cellRep = ["ይ", "ያ"]
      this.isFacingLeft = true;
      //check the cell to the left for any blocking chars to see if you can move left. 
      //let blocked = DoesCellContainChars([x, y, z - 1, w], this.blockers);
      //add nagative velocity to the x.
      //if (!blocked) {
      if (vX >= 0) {
        vX = -1
      }
      vX -= 0.5
      // }
      //if there is a blocking char. you should be stopped. making you velocity x 0
    }
    //try moving right
    if (this.moveRight && !this.squat) {
      this.cellRep = ["ዱ", "ዳ"];
      //check the cell to the right for any blocking chars  to see if you can move right.
      this.isFacingLeft = false;
      //let blocked = DoesCellContainChars([x, y, z + 1, w], this.blockers);
      //add velocity to the x.
      // if (!blocked) {
      if (vX == 0) {
        vX += 1
      }
      vX += 0.5
      // }
      //if there is a blocking char. you should be stopped. making you velocity x 0
    }
    if (this.squat) {
      if (this.isFacingLeft) {
        this.cellRep = ["ዸ"]
      } else {
        this.cellRep = ["ደ"]
      }
    }
    let [isBG, BGchar] = DoesCellContainChars([x, y, z, w + 1], sm_backGround);
    let blocked = DoesCellContainChars([x, y, z, w + 1], this.blockers)[0];

    if (!blocked || isBG) {
      if (vY > 0) {
        if (this.isFacingLeft) {
          this.cellRep = ["ጆ"];
        } else {
          this.cellRep = ["ጀ"];
        }

      } else {
        if (this.moveRight || this.moveLeft) {
          if (Math.abs(vX) > 5) {
            //running

          } else {
            //walking
          }
        } else {
          //standing
        }
      }

    } else {
      if (!this.squat) {
        if (this.moveRight || this.moveLeft) {
          //walking
        } else {
          //standing

          if (this.isFacingLeft) {
            this.cellRep = ["ፃ"];
          } else {
            this.cellRep = ["ቶ"];
          }

        }
      }
    }

    //set the min max of the velocity to 100
    this.velocity[0] = Math.max(Math.min(vX, 10), -10);
    this.velocity[1] = Math.max(Math.min(vY, 10), -10);
    if (this.isProjectile) {
      this.cellRep = ["⡀", "⠂", "⠁", "⠂"];
      if (this.isFacingLeft) {
        this.velocity[0] = -1

      } else {
        this.velocity[0] = 1
      }


    }
  }


  //do the actual movement based on velocity
  move() {
    let [x, y, z, w] = this.location;
if( DoesCellContainChars([x, y, z+1 , w], sm_hurts_fire)[0]){
if(!this.isProjectile && this.canTakeDamage){

this.onFire();
}
}
if( DoesCellContainChars([x, y, z-1 , w], sm_hurts_fire)[0]){
if(!this.isProjectile && this.canTakeDamage){

this.onFire();
}
}

    //move right or left up or down
    let a = 0,
      b = 0;

    //check if the player can move left or right
    if (canPlayerMove(this.frame, this.velocity[0])) {
      a = Math.max(Math.min(this.velocity[0], 1), -1);
    } else {
      a = 0;
    }

    //check if should stop velocity x
    //moving right
    let [isBG, BGchar] = DoesCellContainChars([x, y, z + a, w + b], sm_backGround);
    if (DoesCellContainChars([x, y, z + a, w], this.blockers)[0] && !isBG) {
      a = 0;


    }
    this.velocity[0] = a;
    //moving left



    //check if the player can move up or down
    if (canPlayerMove(this.frame, this.velocity[1])) {


      b = Math.max(Math.min(this.velocity[1], 1), -1);
      if (b < 0) {
        this.velocity[1] = Math.max(this.velocity[1], -2.5);
        //jumping
        if (this.isFacingLeft) {
          this.cellRep = ["ጶ"];
        } else {
          this.cellRep = ["ጰ"];
        }
      }
    } else {
      b = 0;
    }

    let [shouldthrough, bchar] = DoesCellContainChars([x, y, z + a, w + b], sm_jumpThrough);
    [isBG, BGchar] = DoesCellContainChars([x, y, z + a, w + b], sm_backGround);
    //later check bchar against coin boxes and flipblocks
    if (DoesCellContainChars([x, y, z + a, w + b], this.blockers)[0] && !isBG || b < 0 && DoesCellContainChars([x, y, z + a, w + b], this.blockers)[0] && !isBG) {
      a = 0;


      if (shouldthrough && b < 0 || isBG) {} else if (DoesCellContainChars([x, y, z + a, w + 1], sm_backGround)[0]) {} else {
        if (!this.isProjectile && DoesCellContainChars([x, y, z + a, w + 1], sm_hurts_fire)[0] && this.canTakeDamage) {

          this.onFire();
        }
        b = 0;
      }



    }


    let [x1, y1, z1, w1] = CorrectLocation(x, y, z, w);





    this.location = [x, y, z + a, w + b];


    if (this.alive) {
      writeCharTo(this.eraseChar, "#000", x1, y1, z1, w1);
    }
    [x, y, z, w] = CorrectLocation(this.location);
    if (DoesCellContainChars([x, y, z, w], passthrough_erase)[0]) {
      this.eraseChar = " ";
    } else {
      this.eraseChar = getChar(x, y, z, w);


    }
    if (this.isProjectile) {
      console.log(this.velocity[0])
      if (this.isFacingLeft) {
        let [isbg, Char] = DoesCellContainChars([x, y, z - 1, w], sm_backGround);
        if (!isbg && Char != " ") {
          this.onDamaged();
        }
      } else {
        let [isbg, Char] = DoesCellContainChars([x, y, z + 1, w], sm_backGround);

        if (!isbg && Char != " ") {
          this.onDamaged();
        }


      }


      this.cellRep = ["⡀", "⠂", "⠁", "⠂"];
    }


    if (this.alive) {
    if (!this.isProjectile && DoesCellContainChars([x, y, z, w], sm_hurts_fire)[0]){
this.onFire();
}
else if (!this.isProjectile && DoesCellContainChars([x, y, z, w], sm_hurts)[0]){
this.onDamaged();
}


      writeCharTo(CycleImage(this.cellRep), "#000", x, y, z, w);
    }
  }
  slowDown() {

    let [x, y, z, w] = this.location;
    let [vX, vY] = this.velocity;

    vX = Lerp(vX, 0, 0.1);
    if (!this.isProjectile) {
      this.velocity[0] = vX;
    }
    if (vY < -2) {
      vY = Lerp(vY, 1, 0.01);
    } else {
      vY = Lerp(vY, 1, 0.5);
    }

    if (DoesCellContainChars([x, y, z, w + 1], this.blockers)[0] && !DoesCellContainChars([x, y, z, w + 1], sm_backGround)[0]) {
      this.velocity[1] = 0;
      this.jumped = false;
    } else {
      this.velocity[1] = vY;
    }

  }
  draw() {
    if (this.alive) {

      let [a, b, c, d] = CorrectLocation(this.location);
      writeBuffer.push([b, a, d, c, getDate(), CycleImage(this.cellRep, globalTickItorator), globalTickItorator])
      network.write(writeBuffer.splice(0, 512))
    }
  }
  tick() {
    if (this.alive && this.canTick) {
      // Slow down the animation by dividing the time delta by 2

      // Save the current timestamp for the next frame
      this.frameSlowdown++;
      if (this.frameSlowdown == this.tickEveryN) {
        this.update();
        this.setVelocity();
        this.move();
        this.slowDown();
        this.draw();
        this.frameSlowdown = 0

      }
      // requestAnimationFrame(this.tick); // request next animation frame
    }
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
  }
}

class Fireball extends Character {
  constructor(x, y, z, w) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = "fireball";
    this.lives = 2;
    this.id = this.name + "_" + (Object.keys(characterList).length - 1);
    this.isMain = false;
    this.onCreated();
    this.isProjectile = true;
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
    let moveLeft = GetPlayer().isFacingLeft;
    let [a, b, c, d] = GetPlayer().location;
    if (moveLeft) {
      c -= 1;

    } else {
      c += 1
    }
    let fireBall = new Fireball(a, b, c, d)
    fireBall.isFacingLeft = moveLeft;
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
var player = "";

function makePlayer() {

  FindCharsInViewport("[^⛹]", true, true).forEach(function(player_starts) {
    if (player == "") {
      var [e, r, t, y] = player_starts;

      if (getCharInfo(e, r, t, y).protection == 2) {
        var StartLocation = getJSONFromCell(e, r, t, y)["start"];
        localWriteChar(e, r, t, y, " ", "#fff")
        if (StartLocation == "undefined") {
          StartLocation = [0, 0, 1, 1];
        }
        [e, r, t, y] = StartLocation;

        player = new Player(e, r, t, y, "luigi")
      }
    }
  })
}
player = new Player(0, 0, 0, 0, "luigi")

tickAllObjects(characterList);

setInterval(function() {
  globalTickItorator++;
  renderTiles(true);
}, 100)




//----------------------------------------------------------CellVisual Library

const SMImageSrc = {
  nullPlayer: ["data:image/png;base64,"],
  grass: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAIAAACU62+bAAAChUlEQVQ4je2Uv46VVRTFf2ud7w6aIWooUWZaGG0ojcO8gQmJWon2xsCbGBNBX0AKQ3iKYRJbCrhjzTCJJaFiuN/ey+K7xCew8zTnZGftdf6ttQDAbIcRkpb1dt7Wh5Yix4YG0FBXBhQsWDGiUtSJhLK0BnCMEkNhASIglSKEDRC7Nbh8yKdnEXSQkGLTzeNDPdv36V4OXqAg/Piw1/sT90+co6jzzckgFXj0hUgenBA3TY5EK+4HJ4Du3bly/+HrMHP3CKEmvx3T3P3uI0DxLw9fCVB+/PYDI/3w/YdT1PjX31+ZNLl35wp0ZEl0lTOYZpUzlNKTn7784+mfg00Y0Iojvr55C4eOw6OnT5QJ11c3P3evdPzz7WQGHAGtANKUlMlspm7xXrHBcs9TUgu6DDBarSzFit1pRnKx99km4eV6Z3IAtfLJjbfA+Xpn2Qolk5g7Y6jVQW4YLlcLRygojlqUSyHVkemWLJYrtUcPiSJEREUkRo8gGPsHbwG6ztaXX/61izLFI6khzteXgKF0wKOZTTYUrIQnzZu5hqdJmRXBVltEBphlp3O+3g0zkipjjEpcAuhFcKgFUIKOyZSW5IUqAXvagmICRJQmIxOigKJ3n2MoV96ZJEqyd3Bx7eB1QqNW4oUYhql2hv/Fegwxq8KIaqG8ev3NJIOUltRqSzItqSmF0bak2CFRT+pspAHEAqwWOPK1G2/CODu9dPZ8Z/to2rhjrZJqK2mIWyWcqEl7I9oB3Ij47+e7RZt8fP0iQZosqWgp56fvpy0mABoMInO0nEST3D07MaDO1BmMpFtxlp4EKTR68Wy1qMZLCrUStM0biMeSVvOIqcFKEpbp//3wn/jhH6ItFkhCJ+yEAAAAAElFTkSuQmCC"],
  dirt: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAIAAACU62+bAAABnUlEQVQ4je2TTVKUYQyEn+68QFl4AhXcAuVVPJuX8ggyuBamyrUrYL6kXcxY3sEyy1QnlfSPvn753AFiGBRBlrUpIQJGQDRQTsYdThUlub57ubr7lTBolJgkAGV6nPJfrKvEpg4VNSD53c3zkkHKSBqNJZmRNLRCjS0pdkg0S5ODVEAswBqBI1/dPod6fLh4vD8HoaCDJ9ZZ0mMlA/GohRMNGR/EOIAHEf+8v2zG5P3NS4K0LKkZKfuHNxmLBcCAQWSLjpdoyTObEwOarElRyYziHGcSpDDox7ezJhKWjmQnCObEsAswbBXTxZkkLDMracBRG6BGoxybHXsyVPJy/emQ8LQ7Xw6gUT7cvgL73bkjACVLbJMqjSbIA+V2j3COPMbRiHYrpCcyM5JFmDjjmpJoQkR0/KymgqA+3r0CTD/u3j59v0RZcSVdYr+7AEqZgGvYTA40nAkvbYety2spm6KTtEBkgE12JvvdZdiQ1KmqTtzij4cFGgG0YGKyMpJ8XJWAvU6gmAARrWVkQhRQNMrRvND/8/A/D/9wHn4D8bYkkq8gB4UAAAAASUVORK5CYII="],
  grass_edge: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABHElEQVRIic2UMQ6DMAxFfxADM2OvwMSM4AYdGTlCrtKFIzByC1DnTlyBkZktHUggIQRwpEq1lIHYef6OHRgAAZox86MjAgoTFBCzA51cUnmANj8/cOFnAAS4DCp7+2Dd49APLOXwKhZSjgDPtyX3Vr/a77AtQDAZsCRrphXOq9hIVjeTqt1QwLrXU7Sft1VbmWZLJZrPghRAqAfr9khmjEOEMs0MCNrcuItbbTxKoCzcZwWAcYjOiWtre7eCIwiv4qWtNbEEYCuDV/EG2gPGITqVv7sLBoCR30KZZgaI/ph25gVQ3XIC9ICfKPAC6Kr0TgVHQZeT6KPABbUG6Y5ddoGi5s8G6ZHMpCHyVuAFcA2S8UujDBBZwa1B8rEvkoxvH/sVm00AAAAASUVORK5CYII="],
  grass_edge_flipped: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAA+ElEQVRIidVUuRGDMBBcPASOCWmBiJjBXSikBKpRCYR0YY1LcAsOHZPhAITE6SRLDA68kUanvd17IIOLmbnzInOI9xS6STCnEjUuwejYhtlji5xV10SpAKxnodh47lWVCn1XQEpNtNysd31XIGMd3JagDTm8t7Mdcx0Qsqib9fRwnoq6IQnGFoDaPQCAspog0ICDdwpGOYzcKH9HWU0AgNfzShIAu85S2ASKZQrwNS7OgVnnANnnZCshtmkU4W8hJYGu72cOfALnlWB3OKWcaAdagCZnE4Q2z+sg1jZNzvYgBX+0SFokagqHHBxdJPevHAA3qfMW6Sg+Ri9O1En56lkAAAAASUVORK5CYII="],
  grass_edge_both: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAC8UlEQVRIiYWVP29cVRDFf2feMyAZQRKJJgGlNUnlVICd+AtAA7EUBPsBkFj4JmnWBQ00UBFa6ChgYwgVDbFo+SsKOoRi43fnUNy3b/94nUyze+/dM3fmzLlnxdnw8jKQEnu+RkIuGKQzwG8Xwf2xBfKwYwQk2oN2AC8B+3RugJyhoDS4LWCjqHst58WXr8LJU/N16eDOIRRQzMqNPvfq7fdu1s+D6cCIxrs4BW9PiSJSQrdyTYIZeDJlPLrQt9My+exv+HAP3MHtQyDgVhJLNz96GhrBR98xHl3qeQtE8sHoBfj4e8Itc1JihYOvXoFPfmB853kA3rqxB2FI88WPh+jfginw+Wv1Iu6vVJAJ/xwPS0mQxirIyfvvXMQH94mDB/W3alYSLMT+9g52AaBx8Ob2LigZv3uB90YXYfIAXPoE927OyVuIMARGBATc3t4BgqBjPHoOQHMOJlMAxqNLw1aJQptBUSJX4vZv7HLl5UdAMvn0657EyXQJuL+9U0vPZhDM1WvH/HK0AVn47ehZFKU/qTPRKhjA0VDCSOaUChBBq47sOmBByovAYQruUARO88fRJqarL7GYpmmGCs6NIiBNYFonkohe2jZ8c/cNB9Qvl68fn0kQiMBgYUAWOXvWqqQ+tgIbkgpygGeu0gSUJNwLaclWFhOoJ07B5a1jWlXO1beT6h+TXPjz4TMDcNaOHITBFtmK9ClSJc+hRRLP66S3Mp0SaUIb2IUMYeecA60kmFcTJAIHfz3cpJAE5srWCTZIbUV2LqybAiSD1tzhnqyQaBVkdjMStcTBLOrMa6lGqJ/Krz9tUDDSE4TkmKuta0xQaNioGggRLFjauhZmflAcRIqkofMJL10/4cWtY5KoCcLrhTDzg2hBTgjV+RuIZKA/zxFSiYIMLokVkIkUiOqT9QKqEtcJqfqBgIar1/6rh70f/P7z5sDPwh/nWRIf5weS0PTu68ZiHQ3CZER1ZgLTEQRKQyNsiHJO//BkPwD4H7d9ZisvdnzXAAAAAElFTkSuQmCC"],
  block_dud: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAjklEQVRIie2TLRKAIBBGvyUZjRzBI3kMI5Fo9BgcjWikaXLdwRWVZOAFhr/vsQMD4WTDN4gbAFtcE/o4AAAWn4pJFyJLSIafgprEAPgclpiqVC6oPZ0Fk+94QlzQBW3tUsE8WnWjCxHzaHVBTi65C98KDonWfy14y08EpafTkPv5M1UWQCQGVd+50Wg0DnZgcTNbYZg2kAAAAABJRU5ErkJggg=="],
  block_dud_stacked: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAoUlEQVRIie2UPQ6AIAyFX50cHT2CR/IYjo6Ojh7DozE6sulkbaAg4qIJbyDl5300kJZwacczEQ8AdrNZNKYDACyTjTrH1TCEpPnOqEEqAI/NUlWWywXk3s6AYap5QTyQJ23Py2DuW/XguBrMfasDXLmQkDkIOCFanAxI1UcAsa/TJM9zMWUmQCQmWeX8+g1KPyj9IAg4IVqcDEjVRwD/7gcHDvZlthSRdyoAAAAASUVORK5CYII="],
  block_stone: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAtklEQVRIie2TLRKDMBBGXxgOU1lZmSPkKEgkEslR9hhIJEeorKyjpmmT5Wc2Pk9kJjN8376EiePPRhnutwDb8/U2pdZlBsB7D+BMBTGk8d7T6PC6zKeBFBEBoLFoX9Gmm3SyxWJXkHK7Pw6LonrEfAQRQUQIIewNrLpHZAap3tnf0EfI7kDrHQU0WYGI0A8jAOPQ7z6OA9LS1jLlCgdsXdcVB6dpAr6XGDel4WgA5U9Z5yuVSoUPhLlJ1dGKVEQAAAAASUVORK5CYII="],
  block_stone_stacked: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAw0lEQVRIie2ULRKDMBCFvzAcprKyMkfgKEgkEslR9hhIJEeorKyjpqGb8DMbZIdPZGZn8t6+JJN1/JjJwy0LMD9fb5NqGgcAvPcAzmQQRCnee4pUPI3DrkAjIgAUlthHlLrQnS0pVgaa2/2xaRSiB8xHEBFEhKqq1gmscbeIEuh4e6+RHiG6gzTeliAlMhARmrYDoGub1ebQQJuWli5HOGCu6zpb2Pc98L3EUOSKQwLI/8qL3qnimgcnuebBNQ/gL+bBBwKNk6mmiP8FAAAAAElFTkSuQmCC"],
  lava: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAwklEQVRIie1RuxXDMAg8aRKVHodRMopHUZlSY6h0mTIlHSlkbPyRbKcW7/HgwXGcEPDAmCBP8M0hJsihlwFRvyJb8jiDMyCfLwsnCKdCErHdwqnkTAXDBIEOKFg9YiVaIq0K1Z3d8I6r3AFAoJJPpm5rgQBn36vN/dCm95rjWII/G27aWFwX+EB1qVpvKXO1L9tbjWQhaG2pkU2xoSDPcbio+33jDGRvMRhMtk+obQx0PO7pDf41fw3pBJ2gE3SCe/YDDAGDDOYPd1MAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAA4ElEQVRIie2RIRKDMBBFXxhEJUdAcgxkZY7CUXoUJDJHqIxEVlbGpQJ2SDeBUs+fyQC7/7/ZDYZEHqK8d2D4oWA3Px7i6x1icMTgiCkMYFTfIiPh1uXNuQcP2MQn040QLZh6bdA+coAON+9A87zhe6JA6uAW6tTngLuDkIw+NbesboIlzuNiaG1pS6Vhfa4T1xLO9lf1DD4sEKNvu7Unwom+Vjgy70GzCY4koRT2F6CkStNh+f9+J+BVv5LwPG6Qbj0aDHC3W8+zs4LQO90oqC4VzwRF1W/LBbgAF+ACnNMH7GhYdtG9VBQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAx0lEQVRIie2RKxLDMAxEXzIFPYZhjhFY6KMGFvoYhoGFhWYqSOTKbjNJU2rNeKzP7sqSYbXkEc5Y8oglb/kAESRS5vrrRAeQwvcXqEgEcQFcWPxPYED05NiQU0Aez5QxWUQTEwuhuKuaPVrvji7vPpXxLcA8Qmfncb4EzRUJlh3k+gj9L2Ql2bsYwZJUsBayeefNCM6/wTV5SwyqHZyxi+2w1SUaf1jjQV+QPFLPrl82sG+HR6iFdWd/76DfhzSBJtAEmsAxewGFII4+/iEN/wAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAzUlEQVRIie2RIRLEIAxFH50VK/cIlRxj5coepUfpUZCVPQaysnIlLis6dAMDnc7U8hUk+S8JwE2Zq4UeRN9t9LosoRVzHiQsyPYNEpb9nAA1JAeWzBryCAPCCAGEaTcF9hjA/IZ+gtf4TMebwAMmDGnH1UE/pLWzg08lZvQuuXF1tdf51x4TxGIN0bHSZAcgT5bueedYY/L/rY1aW8l4ED3i2d4lddpU2zPKF87Gg3jAZglLqthIQywX3kCbSyteApypu2NugAZogAbQ+gHwQnXdpLwHngAAAABJRU5ErkJggg=="],
  coin: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAnElEQVQ4jd2SIRbDIBBEP30VyMhIJEfIcXq0HCdHQCKRyHVbEeBBSSoqO2r3McMuzBhm6Edv7hoFSFkG9rrYgVsFWolL8tPIeKz41wFgnv3Bkjy4SJYithaim3dOWVSCU5FSCyrBKdDqsG8K6OPi0V/xv4KLr/x5QkXzQQTljMnkAcDgdF1FQu3PWPSYwhf2bSCUDDXuEN1eeHMpbztzUuZsgTtQAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAgUlEQVQ4je2SKw7DQAxEp1VB4cJCwz1CjpOj5Tg9gmGg4cJhE5AEtOttpeI+yWzGH3mAHB3VccnE0QgAeJR7p7lm4hIVJSp8mc5pQ8OOrXt9QdEouikaBUB0ky/Tyz35hA/8Db8guomESHQ/AIBbaltt2DEN35Eh1Pk50vSm91VONq+cOHWZG8EpAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAaklEQVQ4jWNgwA7+QzEGYMSm+MWHHwwMDAwMEgIcGGpYsJki8EIDh8U4bPgBsYCBgwNTDRMuxQwPFBhuLLBgYEDzC7oGhg9wHdgBhgZCYERqIDnisCYNhgcKMAaGFFYND05I4NSAC+BM3gCpkx06JvT58QAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAd0lEQVQ4jeWSKw7AIBAFp1UrkZXI3v80lUgkch010A+79AKdhGDey7wEwKe2Y1i8cC4KwBbEZFYvHEQA0CN227QAQNG7NPIsXFOCCEUVYjIWY+jhq/RheM2ZzfqlYaTmolW13Uc0f+rT4OF+vva6yJ5mGVsap3RObUhdS8NqJhgAAAAASUVORK5CYII="],

  pipe_opening_left_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAzUlEQVRoge2ZvRHCMAxGZS6FR8gIlJSMl7EyQsqMkZLSHZRIgBoglu7yvso/hd59jhWdXMTqLn1VTp0DvgmAIvrcF7Uz/zHK5G+FOwDAYGaXDhEnOw53AACTB7Zb2yXIWOtzooayJHAAgMHbMOf2q9bPy9u5xTsAQCjAWOvBHUgBYPKAufvO3f1KXn25JnAAALce2O1fcFXjlsABAMgDAAAAQCzAHA0gAET3CekPZACI7ROSBzIA2G9A14G8FwDQQ7wXZAAoL3Pejo8H8ADVLSIL/UaSXwAAAABJRU5ErkJggg=="],
  pipe_opening_right_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAA60lEQVRoge2ZsQ3DIBBFPxaFy5SM4NJlRvBYHisjuMwYHoGOFJHDRYQoQpiLxP/VFxK6pzs4EBg8FdBW5jBD48CJCGDwrf5rxUiL8Ndo1TNAAIsV77WWfkE9zZ+H1TNAAIMNQe5L+Gh375MJNeQu48urZ4AAdp88HGJNcI/WzWM6o1C59aSeAQIMbqxX5yIA1egEAGDlvgcA3M4JlOsp6hkggIFHkEcBNuEz97gSybOA94G/AmAfIAABCDCcte9/B1AWASwW5N+IGkg9AwSwSR/gO2FvADYZYR/oD6BxzVMAZRHg+MPl33G/AA9v+SEnPS7n5QAAAABJRU5ErkJggg=="],
  pipe_body_h: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAa0lEQVRoge3ZsQ2AMBBD0X/oBmcsRqDMGJSU6WAMF/e9QJ6syEUCZnoK+JKAI3m4AIDmzALiDQgobndgOKCed3sHZgOK7Q4MBzQrC4g3IMAdEOAOCBAgoLmygHgDAnwfEOAOCBAgwD8jAcb8VZ0RTd6heDoAAAAASUVORK5CYII="],
  pipe_body_left_v: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAQElEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjBqwKgBowaMGjBqwGAzAADJ9AU3O5nsOAAAAABJRU5ErkJggg=="],
  pipe_body_right_v: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAANUlEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowasCoAaMGjBowasBgMwAAQpcEQPSGm0IAAAAASUVORK5CYII="],
  pipe_opening_left_up: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAeElEQVRIiWNkQID/DGQAJnI0IQNGuM0noCIGEOrFjx9YNUhwcKDIU+wCFjhrB5qMBqqNcHABKm7AQR0XjBowasDgMACRFxpQJWBpHZb24QAtz1CxPCATUMUFMABxCSwsPCDUCw1IyQMvF2BhYkAlF4waMGrA4DAAAOkbE4XueDaxAAAAAElFTkSuQmCC"],
  pipe_opening_right_up: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAaElEQVRIiWNkYGD4z0AeYGRgYGBgIlMzkik/cLjgApQ2QOPDgAWEotgFLBgmw8AOAnwGKrlg1IBRAwaHASy40jhDAwE+tVzAyEB+iUQdF7AwnEATgYWJBxofBhBhQZ0ycdSAUQMGhwEAaD4NOyzt9EoAAAAASUVORK5CYII="],
  pipe_opening_left_down: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAe0lEQVRIiWNkQID/DAwMDAwNUJ4HhHqh8YOBgYGBQYKDAyJwASpvAKGYGCgEowaMGjA4DGBkgOWBgXIBC4YILDdWQOkLaPI7oLQH1V2AXg78gJYDBhzYdY6WB6MGDC8DEOXBCagINI3D8gI6gNWRMHmquAAGyCqZKHYBAOlPFe3p4mG2AAAAAElFTkSuQmCC"],
  pipe_opening_right_down: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAZElEQVRIiWNkOMHwnwEZ7IDSHmh8GGiAsxgZGBgYmBgoBKMGjBowOAxgZGBAywv0dgELUu5CBQ04aOq7wIOAClzyDVRywagBowYMDgMYGX7gKA8uQGkDND4MWFDNBeSXSNSpnQGv4w1P8Cv0EgAAAABJRU5ErkJggg=="],
  bush_top: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAkUlEQVRIie2RwQ2DMAxFHygrMQbihNRFMgVD9FqJEyv0ykAc3UNDGsAJkXr1k74U82THKGAYhpFHQqp8cxLgQzXVeRflLvqkZULCkKx3Ue6iA9bTygXvouzQufGtKtP6zrMhat4I/vp9eY6/2iMNW+HJ1uNty2uM5+ExA1AekKA1l39ByWH9kOoNcrT/NNuALx/C+mNTTrW8aAAAAABJRU5ErkJggg=="],
  bush_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAj0lEQVRIie2RwQ2AIAxFv8YLMziHYzAOU7iVuzBDj/VAECigwMkDP2lCKK/9LcDU1NTUX7QMMBzzPQUcaKKbE9iaYQ/qNNFSwMEePFo7+jBgXGBQOUo74GRO/d61PoKwbImwK5U9kw7CvFFXS/ScZZG1bu4blgU4y0ZQCQbCCOk/N36VdNANewfFxY05GNANeikr/DzWeKcAAAAASUVORK5CYII="],
  bush_right: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAsElEQVRIie2SsQ2EMAxFf1BWyhiI6qRbhCmyyElXITa49gaiDAU4crCdQJ8npSDmf778ATqdTscmnecW7iIE5vMpirmKz2ISjmwakVomPotJGAD8W9/lBiQO90WcQRU/MtuQ1PNDwpwbMVvx1kCkMBY6VNNxk6Mlkchha/w01MgqEgGAqyfgjPp1OwFPQVCaaOxg+bzKiwCzWmFAYmFiUBhw0fT+lm9el6ktkURCXGEHvPM3p05u5YMAAAAASUVORK5CYII="],
  lucky_block: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2klEQVQ4jZ2TLRLDIBCFv2QikEgkMseorKzsUXqEHiUysrKyR0BGIiPXpaID3aTQv28GRJb3eDthG54s/EaTN2CJs+TKPO7eKsfLxGmIAE2jxTb2mH6qCiV4pptbmXSpmMQ6yRZjDRLIJgBtLn4QA8RZXhJ2UO7ZWbMS1ugA7OGKhB6jRN/S6gQSPBJ8vjUtnSrVVwk+kdrZiqsGEvyqnZLwrcH2j5hC9ERb/PoD2UA/DgkeZ01e+nZ9Dh6zsJyPjsO+3ueW8fJ4TKchPofpfHR1RQE9TIm/xvkOSc5h/eU3f7EAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwElEQVQ4jZ2TIRKEIBSGPxyD0Wg0eoyNG40exSN4jI1Go3HjHoFoJBppbnBABpGV/WYgPPh/3gOe4GAjDWEnYFOrtivr9Igqp3mhHxWAEK64VE1QUDTLKTZ0Ff2oyEwgJlarPg1DFlR54hgZnGsOpQxQlYUdhhygbN8QKEHLmsLZfDsD30TLGiD9Du4QNDAn+rHQHdzOwH/OZIMrrMHyqaIbr0rIYf/b7bP+aSJf+/o0H//ENtPQxcU+bjMZ/mrnL6cxXfdRdugSAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxklEQVQ4jZ2TIRLDIBBFP0wFEomM7BEqe4TKHCVHyDEqIyMjK3sEJBKJxKWiw2aHFEL6ZsIw2f1/WJYV2FhxDkELgNWHSJEw36vKeXEYJg8AQnCx0QrRdlWxujoAwNgbDJOH5EEfIiWUxD5E8NPKPKlkksQ5EjiuuYYEAP14NSUbregrnoAHc6LtdpdMd5Ccj7qQQwbc/ZcJ/8f3ZFBrXw7P3bXxLBL4Pk37vDWLeAkXHnBv02QwL1sJNExj3yZO8GFK/DXOH/LaTf2eFY5BAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAz0lEQVQ4jZ2TLRLDIBCFH5kIJBKJ7BEqIyMje4QeoUfoMSorkZGVOUIlEomMS0UKgYQtSd9MMpOw7wP2h2HRhGNi4QVgsm4MK043P526N7g9LQAwFpul4CFofKus2QwygVTxonVjePjJZAHqbJPvKhv1hVGQDcDpBlLw5AprUbAKAET3Ku5EqfYniKsAzAmlErkBrI0AXQUSUDJS/wPAX4HvPLoXWcbDgMdV7Uqc70SvGpjbsmsVulbBDOVddb/0RBim+0XmownFw+T11zh/AJRgTcUm7oXjAAAAAElFTkSuQmCC"],
  mario_Standing: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC"],
  mario_walking: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB/UlEQVRIie2UIZfaQBSFv3DWF4lLcHFlXR3wCxZcZOrqMrjKrKvLrKuMxBFcZXB1RMYBDpk63KsYMiQQ6NZU9Z0zybxJ7s29b14G/ofz6OEM5Hotu8J0EtTA1USZhe/AFzOd57pF8tQFroHrY8XHrzs8nuFHwnr0+bGFGrw+ViYv0/v+rtXPQGSiJPNDwVh4z7iAMz/8W7AA9O7pExUhJzGjMe+0ICoSKXLLLCoy4yQmPz87563oiYpEH7NbCeG8W1mRSxK4luhiIV1dtOk3Myk3iIogXSFFDuXmhtCpLTTBUuRmPpqQBC5qMGuB9DFjsTw4zULImehWxeNwagvONUiK3Cq5B7aXuvcz6JTclN6MxfLgODOQ0A87Aem5lceBa9dUukeHnr3bn+ll0G+Bh5ULo4Rd/wBHk+9+KguuwxLowWUbh8UUTYUOxkzpo5YbNBXTbykv14WYgYwD17Lq0ANgszwAMCq3ABT+s80/xDNbA5LAFTnJzUgCV+Jya/O43NrcGyUdnfjOGH7SRL6mbufeYnlwatm2HqHHr9hs2eu+4HVfAJAGOZGvUbH9T8R2YtLYqrUfAzAJRnatBtexONfoqQl+K81Z6PnmpXxZ/NHSzaEKsM+qh6D664BjCVQ8h1i3lOyLRfvg9F1pgA1D00KT+YEA6Xqnfcr+y/gNVd0x+2BIzPQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg=="],
  mario_walking2: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB10lEQVRIie1VLZejMBS99KwYWbmOjMMt49YN+w8Yh2TcOIKbfxHq1i0SV+pWpr9gI3FTXGXr6t6KkBRI6On4eefknJePe3Nv8gLAVwS3JlOA5mPtDOMlMMBtwvXAbwBvOn2R1YTkmw9sgLvjCT/eP8DwBPwV2MWvty0Y8O540v2uXvY3V58CRAmnNsoJ2sI97Qpuo/yzYAKA1ZI+4gXoQrqNcq8F4gWRkpaZeKHbhXR/mBv6k1gRL6g6tq6E/MWvTEkSWWiJrhbq7VVbtdFJtwfxAqi3ICWBbu8QBsbCGExK6jxOILIQ/Hs6AVXHFmXTB+ODoIHIVXE7AmMhmINISatkCTxWYHE+yUvyAfctBPump8foDACoh1J+zkK7YAx2wpQzJZxMdYosJLqQbeMrdMBtlFsCSrgD9pE4pWxe4r1hCVQsrGdD8qh+ocrZBFDlbHIONmGxIACIVYk8ygH4D5HXBwQPgf8WWLqGgkCtSjsWd/9wHnLZKGx+VhNFzieNpWuc0j9IsviG82tM7pTFgli6tn1DUmcSLF3j0J5wUOUE4ygYh2zU5xQYFUuL57t7FRRRNR9C2fQQWYhSgeabOoVUNr1DQB1H2fSgjgOzv5XvYSxa8OH+A3giJfxDtu6SAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB/UlEQVRIie2UIZfaQBSFv3DWF4lLcHFlXR3wCxZcZOrqMrjKrKvLrKuMxBFcZXB1RMYBDpk63KsYMiQQ6NZU9Z0zybxJ7s29b14G/ofz6OEM5Hotu8J0EtTA1USZhe/AFzOd57pF8tQFroHrY8XHrzs8nuFHwnr0+bGFGrw+ViYv0/v+rtXPQGSiJPNDwVh4z7iAMz/8W7AA9O7pExUhJzGjMe+0ICoSKXLLLCoy4yQmPz87563oiYpEH7NbCeG8W1mRSxK4luhiIV1dtOk3Myk3iIogXSFFDuXmhtCpLTTBUuRmPpqQBC5qMGuB9DFjsTw4zULImehWxeNwagvONUiK3Cq5B7aXuvcz6JTclN6MxfLgODOQ0A87Aem5lceBa9dUukeHnr3bn+ll0G+Bh5ULo4Rd/wBHk+9+KguuwxLowWUbh8UUTYUOxkzpo5YbNBXTbykv14WYgYwD17Lq0ANgszwAMCq3ABT+s80/xDNbA5LAFTnJzUgCV+Jya/O43NrcGyUdnfjOGH7SRL6mbufeYnlwatm2HqHHr9hs2eu+4HVfAJAGOZGvUbH9T8R2YtLYqrUfAzAJRnatBtexONfoqQl+K81Z6PnmpXxZ/NHSzaEKsM+qh6D664BjCVQ8h1i3lOyLRfvg9F1pgA1D00KT+YEA6Xqnfcr+y/gNVd0x+2BIzPQAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie1UIXecQBD+SCoiT8ZBHS7U1YX8gnIOV+rqWFxdiatb4iJP4g5cq0pkVVZE4MKpIiKIQ+S9qVh2DxbuXuI77+1jZna/b79Zdhb4b9axyQAgM1cYmEUCBdz6TCZuAXyV7rrKJiTvlsAKWLYdLr49wsEH4CdH6X05XoICl20n43pzuD5TfQAQ+YwKNyLIEl4z9uDCjd4KJgA4OaSPWAzqSY6Rv1gCsZhIVJqZWCxHTzIe5oZ4YifEYsraYi4hWi8rExXx0NZE+xI227227EY69R2IxcBmCxIVUN/NCC1VwhhMopK+54OHNth5MAFlbYEk31njg6CBaK7iuFmqBMsEkai0kkPgsQKNW5K8JH3Cokw1UeRGAIDNcJUvQxsAZuAJwbiJsvP9H3kvrgAA7OwCnkiW29kEs00j/ciR4HaNsu2QhZf4VKdzNaoXeGgT9TQbPLR1o6X1vc4BC+/BIbu+/YwqF/jteFrZxAKAAvkX5rv3RGl9r3d3PK4vnlYgPA4nWKEEgNEOz2mB60bo+OrH9JHRBI1ILICTE6xQuin80HtVabqZxrIAoMqF/irfMAKAUxV892v8efqIru7R1T1W7hmahxZN0cncS6fjx3yH1dNf/Hp4TnUz8eG23dRstlUjEsvxOMVupnNJvgMw6kZFYCwY3zrioa2B5hlY5gRJJZNzMdcAsGbdONNvqDBz/wDwC2D5fQwJIAAAAABJRU5ErkJggg=="],
  mario_jumping: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACM0lEQVRIia2VoXLjMBCGP3UCyq7wWFwW1vQJ4rBjdZmhy45ZYQfzBlbYQUOzOKzsnCeoj5k1YYWFYXtAkWInTqbtnGZ2LK33//XveiUrPjGyeChuPiu26jNYsngoshNvbbIvgd1zcAkYgQCsiy3rwipe7rob9xI44DLU1vEb+Gmnj9eqQ3JCEIE44OrtnbtfrwTcw3PGavwEgEkCoKeQEYiEWspRIuUoEaySXnMqe8GXgEd2AH9k1z6Cq74iAohOkZ1Ya81bm3aCRerKM4tOre3ErvfvZCcioRYJta/BlehUzFt5KiF57JdmIsz3pV8eUsgPTmUWdtKsEZ1CvkTqCpq1jylBAQyUWSjRqbi8lVnYYECNQwCyeIjO+wW5RvDVEZ12VZwfqp3CydGUuvJKLmxsJ+2uSkYJDz++9aLMW8ltPSVqck8wcL3vKvvKH1bPUwDyxiY+iYcALBqN4W9XSgQyiYfofGN32R+U23qKvr6zpDdbAKbhHZvynU09O6SQxUNx4I7cJOC2nmLiCQC6sJ/QxJMOycULJW9ywth+lXz+tPdOTgP7rqx58yLz5sX7jte+iOAuhsA7V6M54SVpreGLEYwzAQiiGwDCeNwLqIqayqeDOnucq6LurPO4Yj6656GZI412bnEEXv6mfD9Lku37QY2M9w0AsS8Miz2zIwmiG/L4bDsDRzdS2mJ2RJt6ptqNMyu2nRh1UNAJOPffO/6dKfYEIo2WnoBzJCdxHwX///EPnoJ1rBWC8uAAAAAASUVORK5CYII="],
  mario_falling: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACDUlEQVRIicWVobLbMBBFjzIPlDWwzH4srOkfJF8Qhxkalln5gqaszA4rq6FZXFbofEFdZpiwwMCwLZCtWLZj8mbandFovdp7tXelKPC/TY0FA5B+rHiSOwgGINEiYvNhbgLfgc+wLdNRktkU+Bz9Ngu/kmkdLbhYRCIrLY2EqfEmsEPiSGh0ErjkkzZrdXcBRSeh63fIVDcoxSJ6Wrro2Jmf6u8TdACOP5AAkNWZU6ro2Mx3Qe4C0fbh9wkKUEcdI1XprkRbI/adcuYBgehY0msxujhmUpWShN7IMWZH66r0YJz6ZORkR1NhfRoQvqj0oJomITpGpQcrRy1XACShh87GK2qF2ZLaBtoqnpuC5iLJSpOEHkno0fZDqnLY2MaS0Ht8BCBJ6IncxY4k9ER0LFKVzkhCz+baRvbBXZIApN2gC+zmvEyJrJbmHTheLwCkkY/Ozk7ObJdfVBr5TjCNfF6rNen9D34wZ736yM/rjddqzfpbZnN2+UXZ69W9HKf8YsmWtXmVqsUnAG77H2zqPbv8ouxRAPjLRPxgboGrcAnAF9/MX88VAO/3AXq/RS1SAOU8KOfiNtUSytyQNGAA28Thz6yxdmeATb0frM8wxzSooswruyNAFo5fKishfpTFubg5clrwrtPc1lS/gkOtB0nnatd9DBy5tgK937LLL/3kwTfuv5P1xx/Mf2F/AcE7WqCCH7iFAAAAAElFTkSuQmCC"],
  mario_squatting: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABSUlEQVRIie2TLXaEMBSFPzgVld3BZFwk3QFLYBwyO4DsgB1AXd0gcbCE7KBIJOMqkXWpADL8TVXlfOdE5MG9777DA548efLkn/AePYjAbmvNwfu7wiysw3RnejHFzuhlK94KL6YYzT6hFhbv1YOxybp5BNaGqZ0SuGPD1DZSrWrL4y0NpnjYn/v4U8eH+AAiyA/FHN1b404en0aDWfwXNk2wrdnVPRHkVlUhAJl8JwLqRdfLNEKdJith8d2gq5vnvoKpWiJASeVEM3Wa4BUfh8H8WbxESYWSyu3C2QjsJsE8gb+8DdmVsivv8U3BkF0R0RtnIxBBTtZ9IYIcpj1YGSxNyq5kyK4AhHEwJqtCytjQt/p4E2faICeRBXQZAFreyOMTWmrXecbvW+31zeAKfTOM4gW2S9HVDdulsPnJnNu8TH2rj0JtcbpfhwCSTCqBdZsAAAAASUVORK5CYII="],
  mario_burnt: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABfklEQVRIid2UIZaDMBiEv/BWcAQkshJZ2SMgkSsrkRwhElm5EskRVlYikUiOgMuKkvRPIBS9815fE/LP/DMhAf4/SjDyP0RypljOwzUV6yjRjTXVpQWgDzhJSAoL9M/1JbIs8rGrV7Guq9gRFEBiybJz/5nsXGwcnCDuOwixLIv76Spz410HusoMQNPNjhxDmqb+W7DkSPHu2BM4Ilon7XfuxrrKjGzqRbAxdJVtxiGablZOALGRknwCykbYHOlY508wgM1ownnwHMC4zuJEHnZfozne5jKVwDPIb+frxnlxVewkDoUG4H5p3YaWRK4zQFff6eq7RwZ4jDVlNBAk1ypzRCtUDM1usb1oeaGd66+Y8rSK5Ksb62IQ5EOBEDLWNDTvt/DsZtr5/RWo2gdDoSlFd0m2sDGUHdjcvbDbC5GdeK+7UIIJ7NkObp7vrDuBvNBmvE1cfnMAxttE2j5cgVwfbxOAt654nXHPYnhcj2p2PyhnsAoaReQohw5iQn87pMdTVuCWCAAAAABJRU5ErkJggg=="],
  mario_Standing_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAByUlEQVRIie1UIZakMBD97JsDtBzXjEOyN2BOsLRDRq4jnCQZt7IlDtqNpE8wkcjGIZG4WpFJOiRhpg8w9V4eRSX/51eqEuDHEj9QAuTH+si6KEEJUFdw/fMPwF/tnga5S/TLD1zmBXgXAIAb+8BlXtAVHF3Bo+pcxmDSppAxAMCf5wNOg4wqoUdGnzGiglNMyUMEhqTPmCUxZ2Al0Up68HrjP2y0EgEgUoP+rkTEayJeWxWkBvN/r4KojgYUGjsFITn3IF5TUEaMV5AagHOnpY9XnaN8u685d9a1uYvqSPy5DHZp2kkTAkjyYnMeiXxLDMFuDxjzgNYNqhAA1WAV+GAAeHLWJrE03Hzl3G/APgGadkpQ9TadazsBANhnK1/H6Uu1upQr2SGqo+06KvhuG0fBLokBU8E3bQxErvNXdpmXIGYJmnZKJEs3k5KleFGvG/B5PEPlwq7ZHAitRC6Jf4gu+KaaJCBIc0FpeUBR5Tamst93PxdIywNu/WIJNmWMWT5+AACGViGNzAc1NSpu/QLWFhZszN39WwUucM+iXZXmYvdyubvvKaA6k2jaCaI6BpONJ8pvJKKR6zdg5CH4s6yu+Sl8+y74mP8wRDB+Q8ST+QAAAABJRU5ErkJggg=="],
  mario_walking_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAByUlEQVRIie1UIZakMBD97JsDtBzXjEOyN2BOsLRDRq4jnCQZt7IlDtqNpE8wkcjGIZG4WpFJOiRhpg8w9V4eRSX/51eqEuDHEj9QAuTH+si6KEEJUFdw/fMPwF/tnga5S/TLD1zmBXgXAIAb+8BlXtAVHF3Bo+pcxmDSppAxAMCf5wNOg4wqoUdGnzGiglNMyUMEhqTPmCUxZ2Al0Up68HrjP2y0EgEgUoP+rkTEayJeWxWkBvN/r4KojgYUGjsFITn3IF5TUEaMV5AagHOnpY9XnaN8u685d9a1uYvqSPy5DHZp2kkTAkjyYnMeiXxLDMFuDxjzgNYNqhAA1WAV+GAAeHLWJrE03Hzl3G/APgGadkpQ9TadazsBANhnK1/H6Uu1upQr2SGqo+06KvhuG0fBLokBU8E3bQxErvNXdpmXIGYJmnZKJEs3k5KleFGvG/B5PEPlwq7ZHAitRC6Jf4gu+KaaJCBIc0FpeUBR5Tamst93PxdIywNu/WIJNmWMWT5+AACGViGNzAc1NSpu/QLWFhZszN39WwUucM+iXZXmYvdyubvvKaA6k2jaCaI6BpONJ8pvJKKR6zdg5CH4s6yu+Sl8+y74mP8wRDB+Q8ST+QAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAB+klEQVRIie2VIZbbMBCGP+9b3sAwp8zQN6hvsAkzW8OyKCeoewI7bGFgWBxWVucE8TKzJiwwZWFToEqWbWWbA3Te07M0mvnnH83MM/yXYKiYgwx1lcfOCzAH2SVKH96Ar3q7qMu7QE9Dxf5yhR8FAKfsyP5yZZcodonysnMRR5c2hSgD4GU6YVGXXibyyKqiTCRR4mPyEIABqaLMgpg3sJTkJnqpZW//sMhNBBBpav29iYhaiqilZSFNbc5dFYo0NE5jyRYjVXmpELWUURlpD0hTw2anqbcHnWO57mw2O7u1uRdpKGo6H0VZbc8aEAjipPceQbkODMDdHjAycLTbURVGjk1tGQydAZ4d28CbipNveal6tncjF2koAIftGYDsbytv2g3QHyrvODdxQXl7B+BX/NPeqYsupzsPvSoA7KMctT3wMp1QTjV9tTnpFLKZF0Q30U0kb492YIxuuIo09M4CZTbj2yymTL/w/e3V9zQfyywuLIu8Pdpow+hz6I1z4ALM5hOSNO4Bf8q7ku6jHIBTdeXUrEZ94JXfua59vW1GztC9waiV621jnczXZWv2z4AUaYjKz3xOoaaLBOMzwDIqWTUIEAQmepGG1mDdKk7NKnAjuc4AK92lHYCRIg3tpaMWN4AL8DQwNBeuiLTK6zyMgsPmX/8Le/8H+NpUAblrNdoAAAAASUVORK5CYII="],
  mario_walking2_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACFElEQVRIie2UrZLbMBSFP+/sAwQuc8ICU7ZsvU+wCTM0LIvyBllWZoUtNDSLw8rqPEFcZpaYGaYs7BYo0vovbWZKe2Y0lmTd43PuvRb8h9fdmIN097KBc4MEc5BtoMziA/hqpotc3yR66G7s6jN8jwE4RQd29ZltoNgGalBdk7H30lmYRgC8PY1Y5HpQidwzsmkkEigZUnIXgSXJppEjsTlwkuQiZqhla3435CICiBS5eV5ERC1F1NKpkCK3688qxKFvg/qIFr0tXWeIWkqvjJR7pMgh2Rrp5d541JvPM8nWTZ33OPRFPc17X1mllSEEvFnQyoenN54luNkDFp1AN+1VoRdY5E5BNxjg0cpvBrWsNPzqOgPg+lYy8Lw49EUlJ3Q0xj4t9mkFQHRt5S6SMjEKAJokk2fNcVShApicfRRwHFWt4F19xllo4vVbgr78ZFeDDl8YAyrds6vhOPvhzk3q189E2Bz8WmcU0y8AzMoDgFu/hL5TCqCjsbMIwHgWi1xE1uVB1uXBtPB1HYe+WzdHHPrSqIJm8gxRGgwm7BYeuDaRWi9YTjVJaGr+fip4PxVYa83qWAurtPI8SxBfPQJsStVSkqeG6K1cu72V8e/1qtANamJTmgt3OdXEoc8qreQRUwlZpVVLxSk7/81+C+6y6LY1mAqNZ7HEoW8qUip7ToZu5Zs/Fp18rdLqD0fvU/zv+A2SB0rRRqwEzQAAAABJRU5ErkJggg=="],
  mario_jumping_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACJ0lEQVRIiaWVrZLiQBSFv1AjkMhxZF3cZp9g8gYDLjLr1tG8QeQ6GjduInEEt47wBGRcHOCQsw53V3QSOiGh2N1T1dU/1ef0ubf/HEoswrFU7fnq5PA3WIRjkYvUxRZ7mPyvIk/tgenw6n4CApBCb0i1gEqOTIcO60CZgTfgRyma6V6hJ5Mwt7a7OX/ymr/Dcc4x2vPx80stOs20dLoprfaW1Isk9SKRQEkVVht3BWyhPpGHBGw3lcigDOGqdBFT1KzRvosJiATKlIsIIJJnpr6IiJqJqFntQvKs6hsHAPp5DXrSvUI0vRnS5xRRMxlAa3+LHZJnkKyN9WIHgKOXV3ayrps1cRGORT1fHehzynx1MnnJMzPZDxr5cPTSsQ/F3bNfERtOwBnYnU5intUOWnBuSKkXycHfYodiY/PrN0mRXOeDc3Mbl4UCNAC7MgeRFwFw8Le8+GMA1HnKNNPSEFDDr7iTESoz27YsJ3P54OBvzZzkCICO3Gbcrr8QdzJCrcy26fDFEFY7Dv62JtrQkXv7oFQxBqHJehJ/r23fRfWUxcVe4mIv7X7fk3fjoA8bL4Yybri+3FUOBCCI3wlCv1MgW+UAHNNPU+dzB8xlEgApFK9FTOx9IwmzTnIX6pPoeGbvF2EzYTa5Wt123ZuDyoU7GbWJzDwN3pj56iT2XahvH5gYj/nc6SRbaCSxY7wNsUO0F6xEHvnORApVnYPH/9C2yP+QG/gDXedzU12dIL4AAAAASUVORK5CYII="],
  mario_falling_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAACG0lEQVRIicWVrZabUBSFv5s1ojJyXBiHa/oEkzzBJA5JXV0ublwZNw7iKqnDhbhK5glKXSQ4ZMbFnQoIXP7StVrRsxaLC5y97z4/9wD/29TUhw1I/10y4n83BT6sNHwDvlTvjuUZTpH0SWaT2n4EAOTuTwCe7ue4tjuqzDSZujYgstKS2K5MkUyCb5FMhwBseusE2KZhx8ckUH1Q0lub327lQ0TvxLyPhfLHXJjgPpFJMGgMuUjFenoD+7F6+ayrGMN943cNZzSJ6oPq3HG33U2ylIPekYBqCAJnIZKlN5vEtLBMEL2ToYLTG5KlEB0QvatC6cknOrRqTQX6vi1UWCZ4cdFIBlDLVUV6BYd7ZSbxdo/XwI6SXg7GgVnaKAjLhMBZEDgLZKXZgNw18qMcsADQz9+7LNGBsEyofOoQXauNXS4ichG5rgNnIYGzkE3dNKaPeQXOQjoDRUc5oWuhy6ru+2UV1iPdA2TazIsLdZWzfo14yNYcyzPr1UeszZzw8ouHbN1KNkLw4kJ1yni0feb+ZwCWp2oSZfanBvRoJNqLCwXtTBTtb8H3ea+BX60lAC/1cxpnHGvnPDkDXhUCdf2VHTaOt6wCtzaYyk8nn3cSXvLbRPXGavQ0Rk7arNM4a1SZu9eNNzxM1/43SfLk3AHv7LasiuEZaCpjLYPB+TDBXlwwo/un6UyoPPMGz15coP3ugPkbu87Hf7ff8I04b+vM2fIAAAAASUVORK5CYII="],
  mario_squatting_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABVElEQVRIie2SIZKDQBBF36QiIiPXZeIiOQJHGBxuWbcuww24AdkTBIkLewNuECSSuJXIuF5BwmaARK2kq7pqpun+8/vzYY455pjjn0JNFQ3IsFY86XWK98GTb0eNQXmYBHq8CIBcBZoYPruhIVhQHkYgMpXFLhLxrVMzIOJbeVxRMbGvg379+6xWCnM731ks0nCDVGWfz4bv9+J21l4qAIvRi1WJ2P0rUj0IwDLOLwrexb4Zp8kAwUpxemARrDrtkvoMQBZ2LCZFFLsXcxPunsUuEgPiJ0dJ6rNoL5UlE0KK3bMtNR6dJ75/2tEaZV7xqIHSXkpSn9FeyrbUaLOmTY69gQCyOqNNjg6QYwjtpRLlPllYEuV+/8o6+QAYDTdFO+lvScMNcX4hDTd98au2aLMeAQx/o0htifMLUrsW3u8ONEXrDDdVrIYMXrrytmYHUMUK4BdXBKkGLeZ/KAAAAABJRU5ErkJggg=="],
  mario_burnt_left: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAABfklEQVRIid2UIZaDMBiEv/BWcAQkshJZ2SMgkSsrkRwhElm5EskRVlYikUiOgMuKkvRPIBS9815fE/LP/DMhAf4/SjDyP0RypljOwzUV6yjRjTXVpQWgDzhJSAoL9M/1JbIs8rGrV7Guq9gRFEBiybJz/5nsXGwcnCDuOwixLIv76Spz410HusoMQNPNjhxDmqb+W7DkSPHu2BM4Ilon7XfuxrrKjGzqRbAxdJVtxiGablZOALGRknwCykbYHOlY508wgM1ownnwHMC4zuJEHnZfozne5jKVwDPIb+frxnlxVewkDoUG4H5p3YaWRK4zQFff6eq7RwZ4jDVlNBAk1ypzRCtUDM1usb1oeaGd66+Y8rSK5Ksb62IQ5EOBEDLWNDTvt/DsZtr5/RWo2gdDoSlFd0m2sDGUHdjcvbDbC5GdeK+7UIIJ7NkObp7vrDuBvNBmvE1cfnMAxttE2j5cgVwfbxOAt654nXHPYnhcj2p2PyhnsAoaReQohw5iQn87pMdTVuCWCAAAAABJRU5ErkJggg=="],

  fireball1: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFFSURBVEhL7dHLSsNAGAXgk0xCjL0YWpAQUBTElSJekIKLIm58gHbhU3TtE4gLFz6BG3f2FVwqFUHcuChUsGqjRAzYW6YxM2PRIRXyCvkW88Nw5sDPIJVKpVKpfxQ5Y6IK4nvaNpvW68zQHM4Z+IC6RRgV8zJojB8IGf2lyhkLnuCIMDoxZ3K2vb4Cp1wCsQu2HwanQdksyVgsUWDmrMVi3lrIFi0VtgXsbsDe21Izc7ObikHqMhZLFIDSc4zC0ZfrdR6vbyO021CWl2CtraohjxyZiiULOH8HZbWM1z/Iul0PLQ9ovQF9iogxGZpIFggcj899TSi9/AjPg/sm8PqJ8KHJNS7cv9BEooATVKHyMyjE1zRSUz/6jeHV3Qvzuzc69IqMxZLfuDM1T8X4nvAj6OrhsEd5IZM3gu9uaDroKBf4twfwA3zZdBAfdXNkAAAAAElFTkSuQmCC"],
  fireball2: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVEhL7dG/SsNAAMfxX+6SS3L2D0pprX+igqjVQW0XoW+gj+Dq4IP4EA66CI6OLoJjEaRx1UGoKJQKKtKYpkm81FKOc8gr5LMcHF9+wx0ymcyEJk9l1IDhcXoQceNUMFpJkgS2FwVMo4f4jVzewqtMJ4g8FU/DfhiIi2meq1hCQ3l3C8Nq0fREdGJBP5eZkhoYUpzl5wp5UluBXrAgXnooN2qkaE/VYt2oy0xJDZg5o2TWt4ENB3xnDV7/G6jOgm2uajSMZ2SmpAZ0SgE2vl5fHI/MY1Dm+Ly6AZ46gBjJ6l9qgCT46rbuRsF9G1hysNDcQ2nZGT+3hoDhQ2ZKasAIxIP5Ez+G7nOCWxfo9OC/dRH6vscIPZKZkvrGQdNyoMeNoa1fkjy3CSEQff+dB8kx86JrzUUs00wmowB/PQBemw4IvJ0AAAAASUVORK5CYII="],
  fireball3: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVEhL7dE9SgNBGMbxZyab7GzMh8UmaggookEWothoQC8gWNl4AQuxF7yBhb0nsBbxABZiIUgIJqTUCEIKUTFRs9mPmTHIsIHMFfbXTPPnnXkZggnutrlIBb8ccF7N0RQlySTEcABhmefcc8+se7yo9B9VZ4RLfvCdEFWWTVOy6QCMgtp59F33kBrGlcoi2gCPyJOwNE3N3Q3ILQdfOQPEmYecy9LfPFtVWUR/gZ0mdmUZXv0J7xfX+JgabVkpwV5z4CWJtrI2QEqg/9BCyD0Ua1Us7e8A6ytA2kQQBqoa0wYYw0BkmIXMbBEol4HCDHizjdfGI+jAV9WYNsDq+S3/sy/8ThfovAG3bfzcNJDq9kRBslOVRfRvrGFBGoljwthRmJAgZHRHEEprKJo+IXvWnfes0lgsFovFJgB/62BnG00q2BwAAAAASUVORK5CYII="],

}


function findImageCharKey(imageSrcObject, charCode, str = "") {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
  if (index >= 0) {
    return [Object.keys(imageSrcObject)[index], index];
  }
}

function isCharOfType(charCode, str = "") {
  const char = String.fromCharCode(charCode);
  const index = str.indexOf(char);
  return index >= 0;
}

function isValidImageSymbol(charCode) {
  return isCharOfType(charCode, superMarioChars)

}

function fillImageChar(charCode, textRender, x, y, clampW, clampH) {
  var tmpCellW = clampW / tileC;
  var tmpCellH = clampH / tileR;
  var sx = Math.floor(x * tmpCellW);
  var sy = Math.floor(y * tmpCellH);
  var ex = Math.floor((x + 1) * tmpCellW);
  var ey = Math.floor((y + 1) * tmpCellH);

  tmpCellW = ex - sx;
  tmpCellH = ey - sy;

  // Super Mario Blocks
  const [charKey, charIndex] = findImageCharKey(SMImageSrc, charCode, superMarioChars);
  if (charKey !== undefined) {
    const imageSrc = CycleImage(SMImageSrc[charKey], globalTickItorator);
    charImages[charIndex].src = imageSrc;
  } else {
    return false
  }
  if (isCharOfType(charCode, sm_halfY)) {

    sy -= tmpCellH - (tmpCellH * 1.5);



  }
  if (isCharOfType(charCode, sm_halfX)) {


    sx -= tmpCellW - (tmpCellW * 1.5);


  }


  textRender.drawImage(charImages[charIndex], sx, sy, ex - sx, ey - sy);



  return true
}

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

//just to show grid
renderTiles(true)
