// global variables
let score, lives, level, time, player, enemies, platforms;
var movement_amount = 0.1;

function init() {
  // initialize variables
  // prevent unwanted user input
  document.oncontextmenu = function(e) {
    e.preventDefault()
  }
  //(cursorCoords[0] * tileW) + (cursorCoords[2] * cellW) + positionX + Math.trunc(owotWidth / 2);
  doZoom(100);
  w.input.disabled = true
  cursorEnabled = false;
  //scrollingEnabled = false;
  //draggingEnabled = false;

  // set up game loop
  // initialize game elements

  // add event listeners for keyboard input
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  // start the game loop
  requestAnimationFrame(gameLoop);
}

class Player {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.location = [x, y, z, w];
    this.destination = [x, y, z, w];
    this.velY = 0;
    this.velX = 0;
    this.isJumping = false;
    this.jumped = false;
    this.isCrouching = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isFacingLeft = false;
    this.isSpecialMove = false;
    this.falling = false;
    this.char = " "
    this.blockedBy = "█▓░▒qwertyuiopasdfghjklzxcvbnm!@#$%^&*()1234567890_+:;<>,.?/-=~\"`";
    this.jumpFrames = 30
    this.img = "";
  }




  updateMovement() {

    this.velX = lerp(this.velX, 0, 0.05);
    this.velY = lerp(this.velY, 0, 0.01);

    console.log(this.velY)
    if (!this.isMovingLeft && !this.isMovingRight && !this.isCrouching && !this.isJumping && !this.isSpecialMove && !this.falling) {
      //  this.img = "https://i.imgur.com/3AbgTGV.png";

    }

    drawPlayer(player, " ")
    if (this.isMovingLeft) {
      this.isFacingLeft = true;
      this.img = "https://i.imgur.com/FAlNx6v.gif"

      this.destination = correctLocation(this.destination);

      if (!isBlocked(this.destination, this.blockedBy)) {
        this.velX -= (movement_amount / 10);

        if (this.velX < -0.5) {
          this.velX = -0.5;
        }
        this.location = this.destination;
      } else {
        this.velX = lerp(this.velX, 0, 0.1);

        this.location[0] = X;
        this.location[1] = Y;
        this.location[2] = z;
        this.location[3] = w;
      }

    }

    if (this.isMovingRight) {
      this.img = "https://i.imgur.com/FAlNx6v.gif"

      this.destination = correctLocation(this.destination);

      if (!isBlocked(this.destination, this.blockedBy)) {
        this.velX += (movement_amount / 10);
        if (this.velX > 0.5) {
          this.velX = 0.5;
        }
        this.location = this.destination;
      } else {
        this.velX = lerp(this.velX, 0, 0.1);
        this.location[0] = X;
        this.location[1] = Y;
        this.location[2] = z;
        this.location[3] = w;
      }

    }

    if (this.isCrouching) {
      this.img = "https://i.imgur.com/KJik4SF.png"
      // this.location[3] += movement_amount;
    }

    if (this.isJumping) {
      this.img = "https://i.imgur.com/Ds1wIuU.png"

      this.velY = -movement_amount;

      this.destination = correctLocation(this.destination);

      if (!isBlocked(this.destination, this.blockedBy)) {

        this.location = this.destination;
      } else {
        this.velY = 0;
        this.isJumping = false;
        this.jumpFrames = 0;
        this.location[0] = X;
        this.location[1] = Y;
        this.location[2] = z;
        this.location[3] = w;
      }

    }
    if (!this.isJumping) {
      this.velY += (movement_amount / 10);
      if (this.velY > 1) {
        this.velY = 1;
      }

      this.destination = correctLocation(this.destination);

      if (!isBlocked(this.destination, this.blockedBy)) {
        this.img = "https://i.imgur.com/6iwR8Wp.png"
        this.location = this.destination;
        this.falling = true;
      } else {
        this.falling = false;
        player.jumped = false;
        this.location[0] = X;
        this.location[1] = Y;
        this.location[2] = z;
        this.location[3] = w;
      }

    }
    const [X, Y, z, w] = this.location;
    this.destination[0] = X;
    this.destination[1] = Y;
    this.destination[2] = z;
    this.destination[3] += this.velY
    //this.destination[2] += this.velX;
    this.destination = correctLocation(this.destination);

    if (!isBlocked(this.destination, this.blockedBy)) {
      if (this.velY > 0) {
        scroller(0, 1);
      } else if (this.velY < 0) {
        scroller(0, -1);
      }

      this.location = this.destination;
    } else {
      this.destination[3] = w
      this.velY = 0;
      this.isJumping = false;
      this.jumpFrames = 0;
      player.jumped = false;

    }

    this.destination[0] = X;
    this.destination[2] += this.velX;
    this.destination = correctLocation(this.destination);

    if (!isBlocked(this.destination, "█▓░▒qwertyuiopasdfghjklzxcvbnm!@#$%^&*()1234567890_+:;<>,.?/-=~\"`")) {
 if (this.velX > 0.1) {
        scroller(1, 0);
      } else if (this.velX < -0.1) {
        scroller(-1, 0);
      }
      this.location = this.destination;
    } else {
      this.velX = 0;
      this.destination[2] = z

    }
  }
}

function gameLoop() {
  // update game state
  update();

  // render game elements
  render();

  // handle user input
  handleInput();

  // check for collisions
  collisions();

  // update player's score
  scoreUpdate();

  // update player's lives
  livesUpdate();

  // check if level is complete
  levelComplete();

  // check if game is over
  gameOver();

  // call the game loop again using requestAnimationFrame
  requestAnimationFrame(gameLoop);
}

function update() {
  if (player.isJumping) {
    // play jump animation
    player.jumpFrames--;
    if (player.jumpFrames === 0) {
      player.isJumping = false;
      player.velY = 0;
      // end jump animation
    }
  }
  player.updateMovement();
  // update player movement
  // update enemy behavior
  // update platform movement
}

function render() {

  drawPlayer(player, player.char);

  renderPlayer(player);
  // draw player
  // draw enemies
  // draw platforms
}

function handleInput() {
  // handle keyboard or gamepad input
}

function collisions() {
  // check for player-enemy collisions
  // check for player-platform collisions
}

function scoreUpdate() {
  // update score based on collected coins or defeated enemies
}

function livesUpdate() {
  // update lives based on taking damage or collecting power-ups
}

function levelComplete() {
  // transition to next level if necessary
}

function gameOver() {
  // display game over screen if necessary
}

function correctLocation(location) {
  var outlocation = location
  if (Math.round(location[2]) > 15) {
    location[2] = 0;
    outlocation[0] += 1;
  }
  if (Math.round(location[2]) < 0) {
    location[2] = 15;
    outlocation[0] -= 1;
  }
  if (Math.round(location[3]) > 7) {
    location[3] = 0;
    outlocation[1] += 1;
  }
  if (Math.round(location[3]) < 0) {
    location[3] = 7;
    outlocation[1] -= 1;
  }
  return outlocation
}

function keyDownHandler(event) {
  // handle key presses
  switch (event.keyCode) {
    case 87: // W for jumping
      if (!player.jumped) {
        player.isJumping = true;

        player.jumpFrames = 35;
      }
      player.jumped = true;
      break;
    case 65: // A for moving left
      player.isMovingLeft = true;
      player.isMovingRight = false;
      player.isFacingLeft = true;

      // player.moveLeft();
      break;
    case 68: // D for moving right
      player.isMovingRight = true;
      player.isMovingLeft = false;
      player.isFacingLeft = false;

      // player.moveRight();
      break;
    case 83: // S for crouching
      player.isCrouching = true;
      break;
    case 32: // spacebar for special move
      player.specialMove();
      break;
    default:
      // do nothing
  }
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

function isBlocked(destination, blocking) {
  const char = getChar(Math.round(destination[0]), Math.round(destination[1]), Math.round(destination[2]), Math.round(destination[3]));
  return !" ".includes(char);
}

function drawPlayer(player, character) {
  const char = character;
  const tileX = player.location[0];
  const tileY = player.location[1];
  const charX = player.location[2];
  const charY = player.location[3];

  const charColor = "white"; // choose a color for the player character
  const charBgColor = "transparent"; // choose a background color for the player character
  // Call the existing function writeCharTo with the player's coordinates and colors

  //writeCharTo(char, charColor, Math.round(tileX), Math.round(tileY), Math.round(charX), Math.round(charY), false, 0, charBgColor);

  renderTiles();
}
const img = new Image();
var imgX = -1;
var imgY = -1;
var CorrectedimgX = -1;
var CorrectedimgY = -1;
img.src = "https://i.imgur.com/FAlNx6v.gif";

function renderPlayer(player) {
  img.transform = "scaleX(-1)";
  if (img.src !== player.img) {
    img.src = player.img
  }




  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  // Get the canvas context
  const ctx = canvas.getContext('2d');

  // Mirror the image horizontally
  ctx.translate(img.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Draw the mirrored image on the original canvas


  imgX = ((player.location[0] * tileW) + (player.location[2] * cellW) + positionX + Math.trunc(owotWidth / 2));
  imgY = ((player.location[1] * tileH) + (player.location[3] * cellH) + positionY + Math.trunc(owotHeight / 2)) - tileH / 16;

  if (player.isFacingLeft) {
    owotCtx.drawImage(canvas, imgX, imgY, (tileW / 16), (tileH / 8));
  } else {
    owotCtx.drawImage(img, imgX, imgY, (tileW / 16), (tileH / 8));
  }

  CorrectedimgX = (Math.round(player.location[0]) * tileW) + (Math.round(player.location[2]) * cellW) + Math.round(positionX) + Math.trunc(owotWidth / 2);
  CorrectedimgY = (Math.round(player.location[1]) * tileH) + (Math.round(player.location[3]) * cellH) + Math.round(positionY) + Math.trunc(owotHeight / 2);

}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

function scroller(x, y) {
  var deltaX = Math.trunc(x);
  var deltaY = Math.trunc(y);

  positionY -= deltaY;
  positionX -= deltaX;
  w.emit("scroll", {
    deltaX: -deltaX,
    deltaY: -deltaY
  });
  w.render();
}

function keyUpHandler(event) {
  // handle key releases
  switch (event.keyCode) {
    case 65: // A for moving left
      //player.stopLeft();
      player.isMovingLeft = false;

      break;
    case 68: // D for moving right
      player.isMovingRight = false;
      //player.stopRight();
      break;
    case 83: // S for crouching

      // player.isCrouching = false;
      break;
    default:
      // do nothing
  }
}

init();
player = new Player(0, 0, 0, 0)
