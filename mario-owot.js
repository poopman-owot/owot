//--------------------------------------------INIT Variables---------------------------------------------------------------------------------
const marioScriptVersion = "v1.28";
let characterList = {};
var blockList = {};
const blockers = ""
useHighlight = false;
var globalTickIterator = 0;
w.input.disabled = true;
defaultURLLinkColor = "transparent";
cursorEnabled = false;
cursorRenderingEnabled = false;
w.setFlushInterval(1)
const mirroredCanvas = document.createElement('canvas');
const marioSpecChars = "ቶዱዳጰጀደዤፃይያጶጆዸዥጵዹጺጴቆኖፂፏዶጳቇጿየዩጱዼጁድዓጸፆዾጄጷ";
superMarioChars = "⛹█▓▆▅▄□▤▦▩☵▫╞╡≣║│╔╕╚╛◠╭╮▣ቶዱዳጰጀደዤፃይያጶጆዸዥ⡀⠂⠁࿙࿚‚ጵዹጺጴቆኖፂፏዶጳቇጿᘯᙉየዩጱዼጁድዓጸፆዾጄጷ⚃⚅⩨⩩⠛⣿⚌⚊◩◨";
bufferLargeChars = false;
var charImages = [];

for (block in superMarioChars) {
  charImages.push(new Image)
}


const sm_flipblock = "⚌";
const smSmall = "▫";
const sm_halfY = "▫";
const sm_random = "▣";
const sm_halfX = "▫";
const sm_coin = "▫";
const sm_backGround = "◠╭╮▫⡀⠂⠁💩࿙࿚‚ᘯ⠛⚊"
const sm_destructable = "";
const sm_feather = "࿙࿚‚";
const sm_tube_UD = "╔╕╚╛";
const sm_tube_LR = "╞╡";
const sm_mushroom = "ᘯ";
const sm_kills = "ᙉ";
const sm_breakable_Brick = "⩨"
const sm_breakable_Brick_Stacked = "⩩"
const passthrough_erase = "▫⡀⠂⠁💩࿙࿚‚ᘯ⠛";
const sm_hurts = "⡀⠂⠁☵";
const sm_hurts_fire = "⡀⠂⠁☵";
const sm_wide = "ጵዹጺጴቆኖፂፏዶጳቇጿ"
const sm_enemy = "ቶዱዳጰጀደፃይያጶጆዸጵዹጺጴቆኖፂፏዶጳቇጿ"
const sm_jumpThrough = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*(){}[]:;<>,.?/\\|'\"~`"
//--------------------------------------------START OF HELPER FUNCTIONS----------------------------------------------------------------------


const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onload = function() {
    callback();
  };

  document.head.appendChild(script);
}
// Load helper functions
loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@${marioScriptVersion}/mario-image-src.js`, function() {
  // Load images
  loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@${marioScriptVersion}/helper-functions.js`, function() {
        loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot/mario-ui.js`, function() {
    // load sounds
    //loadScript('path/to/third/library.js', function() {
      // run init function to start game
      init();
   // });
     });
  });
});

function init(){



const GetPlayer = (id = null) => {
  const player = Object.values(characterList).find((char) => char instanceof Player && (id === null || char.id === id));
  return player || null;
}

const canPlayerMove = (frame, velocity) => {
  const v = Math.abs(velocity);
  if (v > 6) {
    return !((frame % Math.round(10 / (10 - v))) < ((10 - v) / 10))
  } else {
    return ((frame % Math.round(10 / v)) < (v / 10));
  }
}




async function tickAllObjects(list) {
  w.render();
  if (countObjectsByClass(characterList, "Fireball") == 0) {
    player.canFire = true;
  }
  if (!player.canFire) {
    deleteObjectsByClass(characterList, "Fireball")
  }

  for (const key of Object.keys(list)) {
    const o = list[key];
    await o.tick();
  }

  requestAnimationFrame(() => tickAllObjects(list));
}
async function killAllObjects(list) {
  for (const key of Object.keys(list)) {
    const o = list[key];
    if (o.constructor.name !== "Player")
      await o.die();
  }

  requestAnimationFrame(() => tickAllObjects(list));
}

//--------------------------------------------END OF HELPER FUNCTIONS----------------------------------------------------------------------




//--------------------------------------------START CREATE CLASSES ------------------------------------------------------------------------

const marioSmallCellReps = createCellReps({
  stand: ["ዓ", "የ"],
  squat: ["ጷ", "ድ"],
  run: {
    left: ["ጸ", "ፆ"],
    right: ["ዩ", "ጱ"]
  },
  jump: ["ዾ", "ዼ"],
  fall: ["ጄ", "ጁ"],
  burned: ["ዥ", "ዤ"],
  dead: " ",
}, );


const marioCellReps = createCellReps({
  stand: ["ፃ", "ቶ"],
  squat: ["ዸ", "ደ"],
  run: {
    left: ["ይ", "ያ"],
    right: ["ዱ", "ዳ"]
  },
  jump: ["ጶ", "ጰ"],
  fall: ["ጆ", "ጀ"],
  burned: ["ዥ", "ዤ"],
  dead: " ",
}, );
const marioFlyCellReps = createCellReps({
  stand: ["ፂ", "ጵ"],
  squat: ["ጿ", "ኖ"],
  run: {
    left: ["ፏ", "ዶ"],
    right: ["ዹ", "ጺ"]
  },
  jump: ["ጳ", "ጴ"],
  fall: ["ቇ", "ቆ"],
  burned: ["ዥ", "ዤ"],
  dead: " ",
}, );
const fireballCellReps = createCellReps({
  stand: {
    left: ["⡀", "⠂", "⠁", "⠂"],
    right: ["⡀", "⠂", "⠁", "⠂"]
  },
  squat: ["⡀", "⠂", "⠁", "⠂"],
  run: ["⡀", "⠂", "⠁", "⠂"],
  jump: ["⡀", "⠂", "⠁", "⠂"],
  fall: ["⠂","⠂"],
  burned: ["⡀", "⠂", "⠁", "⠂"],
  dead: " ",
}, );
const featherCellReps = createCellReps({
  stand: "‚",
  squat: {
    left: ["࿙", "࿚"],
    right: ["࿙", "࿚"]
  },
  run: {
    left: ["࿙", "࿚"],
    right: ["࿙", "࿚"]
  },
  jump: {
    left: ["࿙", "࿚"],
    right: ["࿙", "࿚"]
  },
  fall: {
    left: ["࿙", "࿚"],
    right: ["࿙", "࿚"]
  },
  burned: {
    left: ["࿙", "࿚"],
    right: ["࿙", "࿚"]
  },
  dead: " ",
}, );

const MushroomCellReps = createCellReps({
  stand: "ᘯ",
  squat: "ᘯ",
  run: "ᘯ",
  jump: "ᘯ",
  fall: "ᘯ",
  burned: "ᘯ",
  dead: " ",
}, );
const DeathShroomCellReps = createCellReps({
  stand: "ᙉ",
  squat: "ᙉ",
  run: "ᙉ",
  jump: "ᙉ",
  fall: "ᙉ",
  burned: "ᙉ",
  dead: " ",
}, );
class Character {
  constructor(x, y, z, w, id) {
    this.frame = 0;
    this.frameSlowdown = 0;
    this.lastFrameTimestamp = performance.now();
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
    this.canFire = true;
    this.squat = false;
    this.jumped = false;
    this.jumpFrames = 3;
    this.onPlatform = false;
    this.isMain = false;
    this.isProjectile = false;
    this.isFeather = false;
    this.isMushroom = false;
    this.imagURL = "";
    this.cellReps = {};
    this.cellRep = [" "];
    this.blockers = blockers;
    this.sprites = {};
    this.tickEveryN = 3;
    this.eraseChar = " ";
    this.canTick = true;
    this.isCollectable = false;
    this.canTakeDamage = true;
    this.alwaysTakesDamage = false;
    this.points = 0;
    this.coins = 0;
    this.isBig = false;

    characterList[id] = this;

    // request animation frame and bind this to the tick function
    this.tick = this.tick.bind(this);
    //requestAnimationFrame(this.tick);
  }

  onCreated() {
    console.log(`${this.id} created`);
  }
  givePoints(points) {
    this.points += points;

    
  }
  onDie() {
    console.log(`${this.id} died`);
    const [x, y, z, w] = CorrectLocation(this.location);
    writeCharTo(" ", "#000", x, y, z, w);
    if (this.isProjectile) {
      const [a, b, c, d] = CorrectLocation([x, y, z + (this.isFacingLeft ? -1 : 1), w]);
      if (!DoesCellContainChars([a, b, c, d], sm_backGround)[0]) {
        const [isEnemy, charE] = DoesCellContainChars([x, y, z + (this.isFacingLeft ? 1 : -1), w], sm_enemy);
        writeCharTo(isEnemy ? "⡀" : " ", "#000", a, b, c, d);
        writeCharTo(" ", "#000", x, y, z, w);
      }
    } else if (this.isFeather) {

    } else if (this.isMain) {
      confirm("you died");
      location.reload();
    }
    delete characterList[this.id];
  }

  onDamaged() {
    this.lives--;
    if (this.lives <= 0) {
      this.die();
    }
    if (this.isMain && this.canFly) {
      this.canFly = false;
     
    }
  }


  onFire() {
    if (this.canTakeDamage) {
      this.onDamaged();

      const newCellRep = this.cellReps.burned[this.isFacingLeft ? 'left' : 'right'];
      this.cellRep = newCellRep;
      this.canTick = false;
      this.canTakeDamage = false;
      setTimeout(() => {
        this.canTick = true;
        this.canTakeDamage = false;
        setTimeout(() => {
          this.canTakeDamage = true;
        }, 2000);
      }, 2000);
    }
  }
  die() {
    this.alive = false;
    this.lives = 0;
    if (this.isMain) {
      killAllObjects();
    }
    this.onDie();
  }

  setVelocity() {
    this.superJumped = false;
    // Destructure location and velocity variables from `this`
    const [x, y, z, w] = this.location;
    let [vX, vY] = this.velocity;

    // Handle movement directions
    if (this.moveUp) {
      this.moveUp = false;
      if (this.squat && this.isBig) {
        vY = -2.1;
        this.superJumped = true;
      } else {
        vY = -2.01;
      }

      let [tube, t_char] = DoesCellContainChars([x, y, z, w - 1], sm_tube_UD);
      if (tube) {

        const TubeData = (getJSONFromCell(x, y, z, w - 1));

        if (TubeData.location) {
          const [a, b, c, d] = CorrectLocation([x, y, z, w]);
          writeCharTo(" ", "#000", a, b, c, d);
          this.location = TubeData.location;
          if (Math.abs(this.location[0] - TubeData.location[0]) > 10 || Math.abs(this.location[0] - TubeData.location[1]) > 10) {
            GoToCoord((TubeData.location[0] / 4) * 1, (TubeData.location[1] / 4) * -1);
          }
        }

      }





    }
    if (this.moveLeft && !this.squat) {
      let [tube, t_char] = DoesCellContainChars([x, y, z - 1, w], sm_tube_LR);
      if (tube) {

        const TubeData = (getJSONFromCell(x, y, z - 1, w));

        if (TubeData.location) {
          const [a, b, c, d] = CorrectLocation([x, y, z, w]);
          writeCharTo(" ", "#000", a, b, c, d);
          this.location = TubeData.location;
          if (Math.abs(this.location[0] - TubeData.location[0]) > 10 || Math.abs(this.location[0] - TubeData.location[1]) > 10) {
            GoToCoord((TubeData.location[0] / 4) * 1, (TubeData.location[1] / 4) * -1);
          }
        }

      }
      this.cellRep = this.cellReps.run[this.isFacingLeft ? 'left' : 'right'];
      this.isFacingLeft = true;

      // Handle blocked cells to the left
      const [blocked, _] = DoesCellContainChars([x, y, z - 1, w], this.blockers);
      if (!blocked && vX >= 0) {
        vX -= 1;
      }
      vX -= 1;
    }
    if (this.moveRight && !this.squat) {
      let [tube, t_char] = DoesCellContainChars([x, y, z + 1, w], sm_tube_LR);
      if (tube) {

        const TubeData = (getJSONFromCell(x, y, z + 1, w));

        if (TubeData.location) {
          const [a, b, c, d] = CorrectLocation([x, y, z, w]);
          writeCharTo(" ", "#000", a, b, c, d);
          this.location = TubeData.location;
          if (Math.abs(this.location[0] - TubeData.location[0]) > 10 || Math.abs(this.location[0] - TubeData.location[1]) > 10) {
            GoToCoord((TubeData.location[0] / 4) * 1, (TubeData.location[1] / 4) * -1);
          }
        }

      }
      this.cellRep = this.cellReps.run[this.isFacingLeft ? 'left' : 'right'];
      this.isFacingLeft = false;

      // Handle blocked cells to the right
      const [blocked, _] = DoesCellContainChars([x, y, z + 1, w], this.blockers);
      if (!blocked && vX === 0) {
        vX += 1;
      }
      vX += 1;
    }
    if (this.squat) {

      const [tube, _] = DoesCellContainChars([x, y, z, w + 1], sm_tube_UD);
      if (tube) {

        const TubeData = (getJSONFromCell(x, y, z, w + 1));

        if (TubeData.location) {
          const [a, b, c, d] = CorrectLocation([x, y, z, w]);
          writeCharTo(" ", "#000", a, b, c, d);

          this.location = TubeData.location;
          if (Math.abs(this.location[0] - TubeData.location[0]) > 10 || Math.abs(this.location[0] - TubeData.location[1]) > 10) {
            GoToCoord((TubeData.location[0] / 4) * 1, (TubeData.location[1] / 4) * -1);
          }
        }

      }


      this.cellRep = this.cellReps.squat[this.isFacingLeft ? 'left' : 'right'];
    }

    // Handle collisions and update character representation
    const [isBG, BGchar] = DoesCellContainChars([x, y, z, w + 1], sm_backGround);
    const [blocked, _] = DoesCellContainChars([x, y, z, w + 1], this.blockers);

    if (!blocked || isBG) {
      if (vY > 0) {

        this.cellRep = this.cellReps.fall[this.isFacingLeft ? 'left' : 'right'];
        if (this.isProjectile) {
          this.onDamaged();

        }
      } else if (this.moveRight || this.moveLeft) {

      } else {
        // Handle standing
      }
    } else if (!this.squat) {
      if (this.moveRight || this.moveLeft) {
        // Handle walking
      } else {
        // Handle standing


        this.cellRep = this.cellReps.stand[this.isFacingLeft ? 'left' : 'right'];
        if (this.isFeather) {
          this.onDamaged();
        }
      }
    }

    // Set min and max velocity limits
    this.velocity = [
      Math.max(Math.min(vX, 10), -10),
      Math.max(Math.min(vY, 10), -10),
    ];

    // Handle projectile movement
    if (this.autoMoveLaterially) {
      this.velocity[0] = this.isFacingLeft ? -1 : 1;
    }
  }

  //do the actual movement based on velocity
  move() {



    if (this.isCollectable) {
      if (checkNearbyCellsForChar(this.location, marioSpecChars)) {
        this.lives = 1;
      }
    } else if (this.isMain) {
      if (checkNearbyCellsForChar(this.location, sm_mushroom)) {
        if (!this.isBig && !this.canFly) {
          this.isBig = true;
        } else {
          
        }
        this.givePoints(1000);
      }

      if (checkNearbyCellsForChar(this.location, sm_feather)) {
        if (this.isBig && !this.canFly) {
          this.canFly = true;

        } else if (!this.isBig) {
          this.isBig = true;
        } else {
          
        }
      this.givePoints(5000);
      }

      if (checkNearbyCellsForChar(this.location, sm_kills)) {
        this.lives = 0;
        this.die();
      }

    }


    if (this.alwaysTakesDamage) {
      this.onDamaged();
    }

    let [x, y, z, w] = this.location;
    if (DoesCellContainChars([x, y, z + 1, w], sm_hurts_fire)[0]) {
      if (!this.isProjectile && this.canTakeDamage) {

        this.onFire();
      }
    }
    if (DoesCellContainChars([x, y, z - 1, w], sm_hurts_fire)[0]) {
      if (!this.isProjectile && this.canTakeDamage) {

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
        this.cellRep = this.cellReps.jump[this.isFacingLeft ? 'left' : 'right'];
      }
    } else {
      b = 0;
    }

    const [isRandomBlock, rBlock] = DoesCellContainChars([x, y, z + a, w + b], sm_random);
    if (isRandomBlock && b < 0) {
      let [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b)
      const RandomBlockData = (getJSONFromCell(fx, fy, fz, fw));
      if (RandomBlockData) {
        writeCharTo(RandomBlockData.replacement, "#000", fx, fy, fz, fw);
        if (RandomBlockData.upgrade == 'feather') {

          if (this.isBig) {
            [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b - 2)
            const feather = new Feather(fx, fy, fz, fw);
          } else {
            //if you arent big, you get a mushroom
            [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b - 2)
            const mushroom = new Mushroom(fx, fy, fz, fw);
          }

        } else if (RandomBlockData.upgrade == 'mushroom') {
          [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b - 2)
          const mushroom = new Mushroom(fx, fy, fz, fw);
        } else if (RandomBlockData.upgrade == 'deathShroom') {
          [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b - 2)
          const deathShroom = new DeathShroom(fx, fy, fz, fw);
        }
      }
    }

    const [breakableBrick, rbrickBlock] = DoesCellContainChars([x, y, z + a, w + b], sm_breakable_Brick);
    if (breakableBrick && b < 0) {
      let [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b)
      if(this.isMain && this.isBig){  
setTimeout(function(){
writeCharTo("⠛", "#000", fx, fy, fz, fw);
setTimeout(function(){
writeCharTo(" ", "#000", fx, fy, fz, fw);

},100);

},100);
}
    }

    const [breakableBrickStacked, rbrickBlockStacked] = DoesCellContainChars([x, y, z + a, w + b], sm_breakable_Brick_Stacked);
    if (breakableBrick && b < 0) {
      let [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b)
      if(this.isMain && this.isBig){  
setTimeout(function(){
writeCharTo("⣿", "#000", fx, fy, fz, fw);
setTimeout(function(){
writeCharTo("⩨", "#000", fx, fy, fz, fw);

},100);

},100);
}
    }

    const [flipblock, rflipblocks] = DoesCellContainChars([x, y, z + a, w + b], sm_flipblock);
    if (flipblock && b < 0) {
      let [fx, fy, fz, fw] = CorrectLocation(x, y, z + a, w + b)
      if(this.isMain){  
setTimeout(function(){
writeCharTo("⚊", "#000", fx, fy, fz, fw);
setTimeout(function(){
writeCharTo("⚌", "#000", fx, fy, fz, fw);

},2000);

},100);
}
    }

    let [shouldthrough, bchar] = DoesCellContainChars([x, y, z + a, w + b], sm_jumpThrough);
    [isBG, BGchar] = DoesCellContainChars([x, y, z + a, w + b], sm_backGround);
    //later check bchar against coin boxes and flipblocks
    if (DoesCellContainChars([x, y, z + a, w + b], this.blockers)[0] && !isBG || b < 0 && DoesCellContainChars([x, y, z + a, w + b], this.blockers)[0] && !isBG) {

    if (DoesCellContainChars([x, y, z + a, w], this.blockers)[0] && !isBG ) {
      a = 0;
}

      if (shouldthrough && b < 0 || isBG) {} else if (DoesCellContainChars([x, y, z + a, w + 1], sm_backGround)[0]) {} else {
        if (!this.isProjectile && DoesCellContainChars([x, y, z + a, w + 1], sm_hurts_fire)[0] && this.canTakeDamage) {

          this.onFire();
        }

        if (DoesCellContainChars([x, y, z, w + b], this.blockers)[0]) {
          b = 0;
        }
      }



    }


    let [x1, y1, z1, w1] = CorrectLocation(x, y, z, w);





    this.location = [x, y, z + a, w + b];


    if (this.alive) {
      if (this.superJumped) {
        this.eraseChar = "💩";
      }
      writeCharTo(this.eraseChar, "#000", x1, y1, z1, w1);
    }
    [x, y, z, w] = CorrectLocation(this.location);

    if (DoesCellContainChars([x, y, z, w], passthrough_erase)[0]) {
      this.eraseChar = " ";
    } else {
      this.eraseChar = getChar(x, y, z, w);
    }
      if (DoesCellContainChars([x, y, z, w], sm_coin)[0] && this.isMain) {
        this.coins += 1;
      }

    if (this.isFacingLeft) {
      let [isbg, Char] = DoesCellContainChars([x, y, z - 1, w], sm_backGround);
      if (!isbg && Char != " ") {
        if (this.isProjectile) {
          this.lives = 0;
        } else if (this.isMushroom) {
          this.velocity[0] = -1;
          this.isFacingLeft = false;
        }

      }
    } else {
      let [isbg, Char] = DoesCellContainChars([x, y, z + 1, w], sm_backGround);

      if (!isbg && Char != " ") {

        if (this.isProjectile) {
          this.lives = 0;
        } else if (this.isMushroom) {
          this.velocity[0] = 1;
          this.isFacingLeft = true;
        }

      }


    }

    if (this.alive) {

      if (!this.isProjectile && DoesCellContainChars([x, y, z, w], sm_hurts_fire)[0]) {
        this.onFire();
      } else if (!this.isProjectile && DoesCellContainChars([x, y, z, w], sm_hurts)[0]) {
        this.onDamaged();
      }
      if (this.isFeather && (DoesCellContainChars([x, y, z, w], marioSpecChars)[0] || DoesCellContainChars([x, y, z + 1, w], marioSpecChars)[0] || DoesCellContainChars([x, y, z - 1, w], marioSpecChars)[0] || DoesCellContainChars([x, y, z, w + 1], marioSpecChars)[0] || DoesCellContainChars([x, y, z, w - 1], marioSpecChars)[0])) {
        this.lives = 1;
        this.onDamaged();
      }


if(CycleImage(this.cellRep) == "" || CycleImage(this.cellRep) == null || CycleImage(this.cellRep) == undefined){
writeCharTo(" ", "#000", x, y, z, w);
}
else{ writeCharTo(CycleImage(this.cellRep), "#000", x, y, z, w);}
      
    }
    if (this.isProjectile) {

      this.onDamaged();
    }
  }
setUI(){
if(this.isMain){
document.getElementById("lives").innerHTML = this.lives;
document.getElementById("points").innerHTML = this.points;
document.getElementById("coins").innerHTML = this.coins;
}
}
  setReps(){
if(this.isMain){

if(this.canFly){

this.cellReps = marioFlyCellReps;
}
else if(this.isBig){

this.cellReps = marioCellReps;
}
else{

this.cellReps = marioSmallCellReps;
}

}

}
  slowDown() {
    const [x, y, z, w] = this.location;
    let [vX, vY] = this.velocity;

    vX = Lerp(vX, 0, 1);
    if (!this.isProjectile) {
      this.velocity[0] = vX;
    }

    vY = vY < -2 ? Lerp(vY, 1, 0.01) : Lerp(vY, 1, 0.5);

    if (DoesCellContainChars([x, y, z, w + 1], this.blockers)[0] && !DoesCellContainChars([x, y, z, w + 1], sm_backGround)[0]) {
      this.velocity[1] = 0;
      this.jumped = false;
    } else {
      this.velocity[1] = vY;
    }
  }
  draw() {
    if (this.alive) {
      const [a, b, c, d] = CorrectLocation(this.location);
      // draw the character here
    }
  }

  async tick() {
    if (this.alive && this.canTick) {
      this.frameSlowdown++;
      if (this.frameSlowdown == this.tickEveryN) {
        this.setReps();
        this.setVelocity();
        this.move();
        this.slowDown();
        this.draw();
        this.setUI();
        this.frameSlowdown = 0
      }
      if (this.isMain && !this.isProjectile) {
        centerPlayer(this.location);
      }
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
    this.cellReps = marioSmallCellReps;
    this.onCreated();
  }
}

class Fireball extends Character {
  constructor(x, y, z, w) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = "fireball";
    this.lives = 30;
    this.id = this.name + "_" + (Object.keys(characterList).length - 1);
    this.isMain = false;
    this.cellReps = fireballCellReps;
    this.autoMoveLaterially = true;
    this.alwaysTakesDamage = true;
    this.isProjectile = true;
    this.tickEveryN = 4;
    this.points = 0;
    this.onCreated();
  }
}
class Feather extends Character {
  constructor(x, y, z, w) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = "feather";
    this.lives = 20;
    this.id = this.name + "_" + (Object.keys(characterList).length - 1);
    this.isMain = false;
    this.onCreated();
    this.isProjectile = false;
    this.isFeather = true;
    this.isCollectable = true;
    this.cellReps = featherCellReps;
    this.tickEveryN = 20;
    this.velocity = [0, -2];
  }
}

class Mushroom extends Character {
  constructor(x, y, z, w) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = "mushroom";
    this.lives = 50;
    this.id = this.name + "_" + (Object.keys(characterList).length - 1);
    this.isMain = false;
    this.onCreated();
    this.isProjectile = false;
    this.isFeather = false;
    this.isMushroom = true;
    this.isCollectable = true;
    this.cellReps = MushroomCellReps;
    this.alwaysTakesDamage = true;
    this.autoMoveLaterially = true;
    this.tickEveryN = 20;
    this.velocity = [1, 0];
  }
}
class DeathShroom extends Mushroom {
  constructor(x, y, z, w) {
    super(x, y, z, w, name + "_" + Object.keys(characterList).length);
    this.name = "deathShroom";
    this.cellReps = DeathShroomCellReps;
  }
}
var hitTimeout = setTimeout(AllowHits, 1000);

function tempInvincible() {
  GetPlayer().canTakeDamage = false;
  clearTimeout(hitTimeout);
  hitTimeout = setTimeout(AllowHits, 1000);
}

function AllowHits() {
  GetPlayer().canTakeDamage = true;
  clearTimeout(hitTimeout);
}

//--------------------------------------------END OF CREATE CLASSES ----------------------------------------------------------------------

//--------------------------------------------START OF CREATE LISTENERS ----------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
  const player = GetPlayer();
  const isJumpKey = event.key === "w";
  const isLeftKey = event.key === "a";
  const isDownKey = event.key === "s";
  const isRightKey = event.key === "d";
  const isSpaceKey = event.key === " ";

  if (isJumpKey) {
    if (!player.jumped) {
      player.moveUp = true;
      player.jumped = true;

    }
  } else if (isLeftKey) {
    player.moveLeft = true;
  } else if (isDownKey) {
    player.squat = true;
  } else if (isRightKey) {
    player.moveRight = true;
  }

  if (isSpaceKey) {

    const isFacingLeft = player.isFacingLeft;
    const [a, b, c, d] = player.location;

    if (player.canFire) {
      if (countObjectsByClass(characterList, "Fireball") < 3) {
        deleteObjectsByClass(characterList, "Fireball")

        const fireBall = new Fireball(a, b, isFacingLeft ? c - 1 : c + 1, d);
        fireBall.isFacingLeft = isFacingLeft;
        tempInvincible();

      } else {
        player.canFire = false;
        deleteObjectsByClass(characterList, "Fireball")
        if (countObjectsByClass(characterList, "Fireball") == 0) {
          player.canFire = true;
        }

      }

    }



  }
});

document.addEventListener("keyup", (event) => {
  const player = GetPlayer();
  const isJumpKey = event.key === "w";
  const isLeftKey = event.key === "a";
  const isDownKey = event.key === "s";
  const isRightKey = event.key === "d";

  if (isJumpKey) {
    player.moveUp = false;
    if (player.canFly) {
      player.jumped = false;
    }
  } else if (isLeftKey) {
    player.moveLeft = false;
  } else if (isDownKey) {
    player.squat = false;
  } else if (isRightKey) {
    player.moveRight = false;
  }
});


//--------------------------------------------END OF CREATE LISTENERS ----------------------------------------------------------------------
let player = null;

function makePlayer() {
  const playerStarts = FindCharsInViewport("[^⛹]", true, true);

  playerStarts.forEach((start) => {
    if (!player) {
      const [a, b, c, d] = start;
      const charInfo = getCharInfo(a, b, c, d);

      if (charInfo.protection === 2) {
        const startLocation = getJSONFromCell(a, b, c, d).start || [0, 0, 1, 1];
        localWriteChar(a, b, c, d, " ", "#fff");
        const [x, y, z, w] = startLocation;
        player = new Player(x, y, z, w, "luigi", marioCellReps);
      }
    }
  });
}

player = new Player(0, 0, 0, 0, "luigi", marioCellReps);

tickAllObjects(characterList);

setInterval(() => {
  globalTickIterator++;
}, 100);

setInterval(() => {
  renderTiles(true);

}, 1000);
//----------------------------------------------------------CellVisual Library

//just to show grid
renderTiles(true)
}
