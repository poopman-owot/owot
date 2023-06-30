var grad = document.createElement("div");
grad.style.position = "fixed";
    grad.style.top = 0;
    grad.style.left = 0;
    grad.style.width = "100%";
    grad.style.height = "100%";
grad.style.pointerEvents= "none";
grad.id="grad";
    

function setGrad(pos){
    grad.innerHTML = `<style>
    #grad{
    background: radial-gradient( circle at ${pos[0]}px ${pos[1]}px, #fff0 0%, #000 50% );
    }
    </style>`
}
elm.main_view.appendChild(grad)
setGrad(0,0)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function CellToPixelCoords(tileX, tileY, charX, charY) {
  if (Array.isArray(tileX)) {
    // If the first argument is an array, destructure the values
    [tileX, tileY, charX, charY] = tileX;
  }
  tileX /= 2;
  tileY /= 2;
  // calculate in-tile cell position
  var charXInTile = tileX * tileC + charX;
  var charYInTile = tileY * tileR + charY;

  // calculate global cell position
  var charXGlobal = Math.floor(tileX * tileC * cellW + charXInTile * cellW + positionX + Math.trunc(owotWidth / 2));
  var charYGlobal = Math.floor(tileY * tileR * cellH + charYInTile * cellH + positionY + Math.trunc(owotHeight / 2));

  return [charXGlobal, charYGlobal];
}


w.registerHook("renderchar", function($, r, o, a, e, d, s, f, h, l) {

  var t = String.fromCharCode($);
	var c = getCharInfo(o, a, e, d);
  var pos1 = CellToPixelCoords(cursorCoords);
  var pos2 = CellToPixelCoords([o, a, e, d]);
  var [p1,p2] = [pos1[0] - pos2[0],pos1[1] - pos2[1]];
    var dis = (map_range(Math.abs(p1),0,1000,200,-100) + map_range(Math.abs(p2),0,1000,200,-100)) /2;
    dis = Math.round(Math.max(Math.min(dis, 200), -100))
    _ = int_to_rgb(c.color);
   p1 = Math.round(Math.max(Math.min(p1, 1000), -1000))*-1;
   p2 = Math.round(Math.max(Math.min(p2, 1000), -1000))*-1;

    var shadow = ``;
        
    if(dis<=200 && $ !== 32 && $ !== 9608 ){
  for(i=0;i<3;i++){
      
    shadow+=  `drop-shadow(${(i+1)*(p1*0.01)}px ${(i+1)*(p2*0.01)}px ${((Math.abs(p1)+Math.abs(p2))/2)*0.008}px rgba(0,0,0,${1-(i/6)})) `
  }
    }

  r.filter = shadow + `brightness(${dis}%)`;



}), w.redraw();
w.on("cursorMove",function(){

setGrad(CellToPixelCoords(cursorCoords));
    
   w.redraw(); 
})
