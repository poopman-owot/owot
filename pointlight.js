var mouseCoords = [0,0];
var grad = document.createElement("div");
grad.style.position = "fixed";
grad.style.top = 0;
grad.style.left = 0;
grad.style.width = "100%";
grad.style.height = "100%";
grad.style.pointerEvents = "none";
grad.id = "grad";

elm.owot.addEventListener("mousemove",function(e){
mouseCoords = [e.x,e.y];
if(e.x !== undefined){
 setGrad([e.x,e.y]);
}
})


function setGrad(pos) {

  grad.innerHTML = `<style>
    #grad{
z-index:2000;
    background: radial-gradient( circle at ${pos[0]}px ${pos[1]}px, #fff0 0%, #000 50% );
    }
    </style>`
}

setGrad(0, 0)
function handleFetch(coordA, coordB, regWidth, regHeight) {
  var tileX = coordA[0];
  var tileY = coordA[1];
  var charX = coordA[2];
  var charY = coordA[3];
  var reg = [];
  var colors = [];
  var bgcolors = [];
  var links = [];
  var protections = [];
  var decorations = [];
  for (var y = 0; y < regHeight; y++) {
    // rows
    var r_reg = [];
    var r_colors = [];
    var r_bgcolors = [];
    var r_links = [];
    var r_protections = [];
    var r_decorations = [];
    // contains non-default (not null) value in row?
    var c_color = false;
    var c_bgcolor = false;
    var c_link = false;
    var c_protection = false;
    var c_decoration = false;
    for (var x = 0; x < regWidth; x++) {
      var charInfo = getCharInfo(tileX, tileY, charX, charY);
      var char = charInfo.char;
      char = char.replace(/\r|\n|\x1b/g, " ");
      r_reg.push(char);
      r_colors.push(charInfo.color);
      r_bgcolors.push(charInfo.bgColor);
      if (charInfo.color) c_color = true;
      if (charInfo.bgColor != -1) c_bgcolor = true;
      var tile = Tile.get(tileX, tileY);
      var containsLink = false;
      if (tile && tile.properties && tile.properties.cell_props) {
        if (tile.properties.cell_props[charY] && tile.properties.cell_props[charY][charX]) {
          var link = tile.properties.cell_props[charY][charX];
          if (link.link) {
            link = link.link;
            containsLink = true;
            c_link = true;
            if (link.type == "url") {
              r_links.push("$u" + "\"" + escapeQuote(link.url) + "\"");
            } else if (link.type == "coord") {
              r_links.push("$c" + "[" + link.link_tileX + "," + link.link_tileY + "]");
            }
          }
        }
      }
      r_protections.push(charInfo.protection);
      if (charInfo.protection !== null) c_protection = true;
      if (!containsLink) {
        r_links.push(null);
      }
      r_decorations.push(charInfo.decoration);
      if (charInfo.decoration !== null) c_decoration = true;
      charX++;
      if (charX >= tileC) {
        charX = 0;
        tileX++;
      }
    }
    if (!c_color) r_colors = null;
    if (!c_link) r_links = null;
    if (!c_protection) r_protections = null;
    if (!c_decoration) r_decorations = null;
    if (!c_bgcolor) r_bgcolors = null;
    reg.push(r_reg);
    colors.push(r_colors);
    bgcolors.push(r_bgcolors);
    links.push(r_links);
    protections.push(r_protections);
    decorations.push(r_decorations);
    tileX = coordA[0];
    charX = coordA[2];
    charY++;
    if (charY >= tileR) {
      charY = 0;
      tileY++;
    }
  }
  convertData(reg, colors, bgcolors, links, protections, decorations, [coordA, coordB]);

}

function convertData(str, colors, bgcolors, links, protections, decorations, coords) {
  var s_str = str;
  var s_colors = colors;
  var s_bgcolors = bgcolors;
  var s_links = links;
  var s_prots = protections;
  var s_decos = decorations;
  var text = str;
  var currentCol = -1;
  var currentBgCol = -1;
  var resText = [];
  for (var y = 0; y < text.length; y++) {
    var textRow = text[y].slice(0);
    filterAdvancedChars(textRow, false, false);
    var colRow = s_colors[y] && s_colors[y].slice(0);
    var bgColRow = s_bgcolors[y] && s_bgcolors[y].slice(0);
    var linkRow = s_links[y] && s_links[y].slice(0);
    var protRow = s_prots[y] && s_prots[y].slice(0);
    var decoRow = s_decos[y] && s_decos[y].slice(0);
    for (var x = 0; x < textRow.length; x++) {
      var chr = textRow[x];
      var deco = decoRow ? decoRow[x] : false;;

      if (deco) {
        chr = setCharTextDecorations(chr, deco.bold, deco.italic, deco.under, deco.strike);
        textRow[x] = chr;
      }
    }

    if (true) {
      for (var x = 0; x < textRow.length; x++) {
        var col = 0;
        var bgCol = -1;
        if (colRow) col = colRow[x];
        if (bgColRow) bgCol = bgColRow[x];

        if (col == currentCol && bgCol == currentBgCol) continue;

        var chr = "";
        if (bgCol != currentBgCol) { // cell color
          chr += "\x1b";
          if (bgCol == -1) {
            chr += "x";
            currentCol = -1; // this also resets text color, so re-add it right after bgcolor definition
          } else {
            chr += "b" + bgCol.toString(16).padStart(6, 0);
          }
        }
        if (col != currentCol) { // text color
          chr += "\x1b";
          if (col == 0) {
            chr += "x";
            if (bgCol != -1) { // re-add cell color if applicable
              chr += "\x1b" + "b" + bgCol.toString(16).padStart(6, 0);
            }
          } else {
            chr += "F" + col.toString(16).padStart(6, 0);
          }
        }
        currentCol = col;
        currentBgCol = bgCol;
        textRow[x] = chr + textRow[x];
      }
    }
    textRow = textRow.join("");
    resText.push(textRow);

  }
  resText = resText.join("\n");
  w.clipboard.copy(resText);
}
//4 = regular after = fp

var previewText = "";
var showPastePreview = true;
var demoCanv = document.createElement("canvas");
var demoCtx = demoCanv.getContext("2d");
var ppc_css = document.createElement("style");
var ppc_style =
  `#ppc{
    display: block;
    position: fixed;
    z-index: 1000;
    outline: 1px dashed black;
    pointer-events: none;
    top:0px;
    left:0px;
    }
`

demoCanv.id = "ppc"
ppc_css.innerHTML = ppc_style;
document.head.appendChild(ppc_css);
elm.main_view.appendChild(demoCanv);
elm.main_view.appendChild(grad)
// This function is used to convert a cells coordinate to the screen pixel location but only works at 100% zoom
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

// Whenever the cursor moves, move the preview location
function doRender() {

  const coordA = getTileCoordsFromMouseCoords(0, 0);
  const coordB = getTileCoordsFromMouseCoords(owotWidth, owotHeight);
  handleFetch(coordA, coordB, owotWidth / cellW, owotHeight / cellH);
  PasteClipboardPreview();
  requestAnimationFrame(doRender);
}





// Try to copy the clipboard data and then run renderString on that data.
function PasteClipboardPreview() {
  navigator.permissions.query({
    name: 'clipboard-read'
  }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.readText()
        .then(text => {
          renderString(text.replace(/\r\n/g, "\n"));

        })
        .catch(err => {
          console.error('Failed to read clipboard contents:', err);
        });
    } else {
      console.error('Permission to read clipboard denied.');
    }
  });
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function renderPreviewChar(textRender, posX, posY, char, color, link, writability) {
  var textYOffset = cellH - (5 * zoom);

  var fontX = posX * cellW;
  var fontY = posY * cellH;

  var deco = getCharTextDecorations(char);
  char = clearCharTextDecorations(char);
  char = resolveCharEmojiCombinations(char);

  var cCode = char.codePointAt(0);

  // initialize link color to default text color in case there's no link to color
  var linkColor = styles.text;
  if (textColorOverride) {
    if (writability == 0 && textColorOverride & 4) linkColor = styles.public_text;
    if (writability == 1 && textColorOverride & 2) linkColor = styles.member_text;
    if (writability == 2 && textColorOverride & 1) linkColor = styles.owner_text;
  }

  var isLink = false;
  if (link) {
    isLink = true;
    if (link.linkType == "url") {
      linkColor = defaultURLLinkColor;
    } else if (link.linkType == "coord") {
      linkColor = defaultCoordLinkColor;
    }
  }

  // if text has no color, use default text color. otherwise, colorize it
  if (color == 0 || !colorsEnabled || (isLink && !colorizeLinks)) {
    textRender.fillStyle = linkColor;
  } else {
    textRender.fillStyle = `rgb(${color >> 16 & 255},${color >> 8 & 255},${color & 255})`;
  }

  // x padding of text if the char width is > 10
  var XPadding = cellWidthPad * zoom;

  // underline link
  if (isLink) {
    textRender.fillRect(fontX, fontY + textYOffset + zoom, cellW, zoom);
  }

  if (deco) {
    if (deco.under) {
      textRender.fillRect(fontX, fontY + textYOffset + zoom, cellW, zoom);
    }
    if (deco.strike) {
      textRender.fillRect(fontX, fontY + Math.floor((16 * zoom) / 2), cellW, zoom);
    }
  }

  // don't render whitespaces
  if (char == "\u0020" || char == "\u00A0") return;

  var isBold = deco && deco.bold;
  var isItalic = deco && deco.italic;
  var checkIdx = 1;
  if (char.codePointAt(0) > 65535) checkIdx = 2;
  var isSpecial = char.codePointAt(checkIdx) != void 0;
  isSpecial = isSpecial || (cCode >= 0x2500 && cCode <= 0x257F);

  if (isValidSpecialSymbol(cCode)) {
    drawBlockChar(cCode, textRender, posX, posY, tileW, tileH);
    return;
  }

  var tempFont = null;
  var prevFont = null;
  if (isSpecial || deco) {
    prevFont = textRender.font;
    tempFont = textRender.font;
    if (isSpecial) tempFont = specialCharFont;
    if (isBold) tempFont = "bold " + tempFont;
    if (isItalic) tempFont = "italic " + tempFont;
    textRender.font = tempFont;
  }
const [mX,mY] = mouseCoords;
const charX = Math.round(fontX + XPadding);
const charY = Math.round(fontY + textYOffset);
var [p1, p2] = [mX - charX, mY - charY];
  p1 = Math.round(Math.max(Math.min(p1, 100), -100)) * -1;
  p2 = Math.round(Math.max(Math.min(p2, 100), -100)) * -1;
for(i=1;i<10;i++){
if(i<9){
var shadowX = (i*(p1*0.01));
var shadowY = (i*(p2*0.01));

textRender.fillStyle = `rgb(0,0,0,${(1- (1*(i/11) ) )})`;
textRender.fillText(char, Math.round(fontX + XPadding)+shadowX, Math.round(fontY + textYOffset)+shadowY);
}
else{
  textRender.fillStyle = `rgb(${color >> 16 & 255},${color >> 8 & 255},${color & 255})`;
textRender.fillText(char, Math.round(fontX + XPadding), Math.round(fontY + textYOffset));

}
  
}

  if (prevFont) {
    textRender.font = prevFont;
  }

}

function renderString(str) {
  var parser = textcode_parser(str, {
    tileX: 0,
    tileY: 0,
    charX: 0,
    charY: 0
  }, YourWorld.Color, YourWorld.BgColor);

  var renderChars = [];
  var lastProt = null;
  var lastLink = null;

  var maxX = 0;
  var maxY = 0;

  while (true) {
    var data = parser.nextItem();
    if (data == -1) break;

    if (data.type == "char") {
      if (!data.writable) continue;
      var char = data.char;
      var color = data.color;
      var bgColor = data.bgColor;

      if (char == "\n" || char == "\r") continue;

      var posX = data.tileX * 16 + data.charX;
      var posY = data.tileY * 8 + data.charY;
      if (posX > maxX) maxX = posX;
      if (posY > maxY) maxY = posY;

      renderChars.push([posX, posY, char, color, bgColor, lastProt, lastLink]);
      lastProt = null;
      lastLink = null;
    } else if (data.type == "protect") {
      lastProt = data.protType;
    } else if (data.type == "link") {
      lastLink = data;
    }
  }

  var newWidth = Math.ceil((maxX + 1) * cellW);
  var newHeight = Math.ceil((maxY + 1) * cellH);

  if (newWidth > 2000) newWidth = 2000;
  if (newHeight > 2000) newHeight = 2000;

  demoCanv.width = newWidth;
  demoCanv.height = newHeight;
  demoCtx.font = font;

  // pass 1: background colors
  for (var i = 0; i < renderChars.length; i++) {
    var cell = renderChars[i];

    var posX = cell[0];
    var posY = cell[1];
    var bgColor = cell[4];
    var prot = cell[5];

    if (prot == null) prot = state.worldModel.writability;

    if (bgColor > -1) {
      demoCtx.fillStyle = `rgb(${bgColor >> 16 & 255},${bgColor >> 8 & 255},${bgColor & 255})`;
    } else {
      if (prot == 0) demoCtx.fillStyle = styles.public;
      if (prot == 1) demoCtx.fillStyle = styles.member;
      if (prot == 2) demoCtx.fillStyle = styles.owner;
    }
    demoCtx.fillRect(posX * cellW, posY * cellH, cellW, cellH);

  }

  // pass 2: text data
  for (var i = 0; i < renderChars.length; i++) {
    var cell = renderChars[i];

    var posX = cell[0];
    var posY = cell[1];
    var char = cell[2];
    var color = cell[3];
    var bgColor = cell[4];
    var prot = cell[5];
    var link = cell[6];

    if (prot == null) prot = state.worldModel.writability;

    renderPreviewChar(demoCtx, posX, posY, char, color, link, prot);
  }

}
doRender();
