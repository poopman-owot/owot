var cursorList = [];

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

owot.addEventListener("mousemove", showCursor);
alert("Settings are now found in the menu")
w.setFlushInterval(1)
var doshowCursor = false;
var doshowCursorColor = false;



class Cursor {
  constructor(x, y, z, w) {
    this.location = [x, y, z, w];
    this.lifespan = 10;
    this.tick = this.tick.bind(this);
    this.color = ~~(Math.random() * 16777215);
    this.onCreated();
  }


  onCreated() {
    if (cursorList.length > 0) {
      if (cursorList[cursorList.length - 1].location !== this.location) {

        cursorList.push(this);
      }
    } else {

      cursorList.push(this);
    }

  }
  tick() {

    this.lifespan--;
    if (this.lifespan > 0) {
      let [x, y, z, w] = this.location;
      this.location = CorrectLocation(x, y, z, w + 1);
      let [a, b, c, d] = CorrectLocation(x, y, z, w - 1);
      if (this.lifespan > 1) {
        writeCharTo("🮰", this.color, x, y, z, w);
      }

      writeCharTo(" ", 0, a, b, c, d);
    }

  }

}

function showCursor(e) {
  event_mouseup(e);
  if (cursorCoords !== null) {
    let [x, y, z, w] = cursorCoords;
    let c = new Cursor(x, y, z, w)

  }

}
setInterval(function() {
  for (c in cursorList) {
    cursorList[c].tick();

  }
}, 100)
