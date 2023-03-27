function ET (){

var globalKey = prompt("Enter Key");

function Poopman_KeyConversion(key){
var a  = key;
var b = [];
for (i = 0; i<a.length;i++)
{b=b +(a[i].charCodeAt()); b = b-"";
}
return b
}

function Poopman_Encode(msg, key){
key = Poopman_KeyConversion(key)
var a  = msg;
var b = "";
for (i = 0; i<a.length;i++)
{b+= String.fromCharCode(a[i].charCodeAt()+key);}
return b
}

function Poopman_Decode(msg, key){
var a  = msg;
var b = "";
var key = Poopman_KeyConversion(key);
for (i = 0; i<4;i++){b+= String.fromCharCode((a.charCodeAt(i)-key))}
return b
}

var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNIOPQRSTUVWXYZ";
var encodeLetters = Poopman_Encode(letters,globalKey);


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

function findCharsInViewport(pattern, caseInsensitive, ignoreCombining) {
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
function renderText() {
        var chr = findCharsInViewport("^["+encodeLetters+"]", true, true);
        for (var i = 0; i < chr.length; i++) {
                localWriteChar(chr[i][0], chr[i][1], chr[i][2], chr[i][3], " ", 1)
            }

        w.redraw();
    }

function decodeText() {
for (var j = 0; j < letters.length; j++) {
       var chr = findCharsInViewport("[^"+encodeLetters[j]+"]", true, true);
        for (var i = 0; i < chr.length; i++) {
                localWriteChar(chr[i][0], chr[i][1], chr[i][2], chr[i][3], letters[j], 1)
            }
}

        w.redraw();
    }

var ta = $("#textInput");
    var _b = letters;
    var _a = encodeLetters;

    function J(value) {
        var v = value;
        if (v) {
            var r = '';
            for (var i = 0; i < v.length; i++) {
                var c = v.charAt(i);
                var j = _b.indexOf(c);
                r += j >= 0 ? (_a.charAt(j)) : c;
            }
            ta.value = r;
        }
    }

$("#textInput").oninput = function(e){J(e.data)}

renderText();
setInterval(function(){decodeText()},500)
}
ET();
