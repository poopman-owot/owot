
const html = `
  <link href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap" rel="stylesheet">
  <div class="cell m-mario"></div>
  <div id="m-messagebox" class="">Thanks For Playing!</div>
  <div id="m-topbar">
    <div id="lives-section" class="outline">
      <h1>MARIO</h1>
      <div style="position: relative; float: left; color: white;">x</div>
      <h2 id="lives" style="color: white;">3</h2>
    </div>
    <div id="points-section" class="outline">
      <div id="coin-icon">&nbsp;</div>
      <div style="float: left; position: relative; margin-left: 4px;">x <div id="coins">0</div></div>
      <div id="points">0</div>
    </div>
  </div>
  <div id="death-screen-overlay" class="hide">
    <div id="centered-modal" class="outlined">
      <h1 id="game-over">Game Over</h1>
      <div id="mario-dead"></div>
    </div>
  </div>
  <div id="paused-overlay" class="hide">
    <div id="paused-center" class="outline">
      <div id="paused-title">PAUSED</div>
      <p style="font-size: 0.5em; margin-top: 2em;">Press "P" to play or pause.</p>
      <div id="m-options">
        <input type="checkbox" onclick="setMute()" id="m-mute">
        <label for="m-mute">Mute Sounds</label><br>
        <input type="checkbox" onclick="setFly()" id="m-fly">
        <label for="m-fly">Fly Around</label>
      </div>
    </div>
  </div>
`;

const css = `
.cell                 {display: block;width:  + cellWidth + px;height:  +cellHeight+px;position: fixed;margin-top:-2px}
.red                  {background: red!important;}
.mario-target         {color: transparent;}
.m-pipe-vertical-top-left  {color: transparent;background-image: url(https://i.imgur.com/qD9qHUU.png);background-size: cover;background-position-x: center;}
.m-pipe-vertical-top-right  {color: transparent;background-image: url(https://i.imgur.com/g0r1e0W.png);background-size: cover;background-position-x: center;}
.m-pipe-vertical-left      {color: transparent;background-image: url(https://i.imgur.com/mj3zKaX.png);background-size: cover;background-position-x: center;}
.m-pipe-vertical-right      {color: transparent;background-image: url(https://i.imgur.com/AlCEKLe.png);background-size: cover;background-position-x: center;}
.m-pipe-horizontal-top      {color: transparent;background-image: url(https://i.imgur.com/5arzX17.png);background-size: cover;background-position-x: center;}
.m-pipe-horizontal-body      {color: transparent;background-image: url(https://i.imgur.com/WV29hIB.png);background-size: cover;background-position-x: center;}
.m-block-spin          {color: transparent;background-image: url(https://i.imgur.com/6zSU6nq.png);background-size: cover}
.m-block-spinning          {color: transparent;background-image: url(https://i.imgur.com/7dNZMwb.gif);background-size: cover}
.m-block-dud          {color: transparent;background-image: url(https://i.imgur.com/6Dxur3k.png);background-size: cover}
.m-block-stone        {color: transparent;background-image: url(https://i.imgur.com/14EboDy.png);background-size: cover}
.m-block-dud-stacked          {color: transparent;background-image: url(https://i.imgur.com/7H4FbEO.png);background-size: cover}
.m-block-stone-stacked        {color: transparent;background-image: url(https://i.imgur.com/JrkkzHo.png);background-size: cover}
.m-block-hidden       {color:transparent}
.m-lava              {color: transparent;background-image: url(https://i.imgur.com/S10Q75m.gif);background-size: cover}
.m-bush               {color: transparent;background-image: url(https://i.imgur.com/JtJv50x.png);background-size: cover;background-position-x: center;}
.m-bush-edge-right    {color: transparent;background-image: url(https://i.imgur.com/gOBRvl6.png);background-size: cover}
.m-bush-edge-left     {color: transparent;background-image: url(https://i.imgur.com/UUa6ANH.png);background-size: cover}
.m-grass-edge-both     {color: transparent;background-image: url(https://i.imgur.com/YpzIMRs.png);background-size: cover}
.m-grass              {color: transparent;background-image: url(https://i.imgur.com/ABZ9SiT.jpg);background-size: cover}
.m-grass-edge-right   {color: transparent;background-image: url(https://i.imgur.com/t3ptWaJ.png);background-size: cover}
.m-grass-edge-left    {color: transparent;background-image: url(https://i.imgur.com/Ah7hKhO.png);background-size: cover}
.m-dirt               {color: transparent;background-image: url(https://i.imgur.com/xGOqoS3.jpg);background-size: cover;}
.m-coin               {color: transparent;background-image: url(https://i.imgur.com/Wrq208j.gif);background-size: contain;background-repeat: no-repeat;}
.m-lucky              {color: transparent;background-image: url(https://i.imgur.com/n25g2Jw.gif);background-size: contain;background-repeat: no-repeat;}
.m-mario              {color: transparent;background-image: url(https://i.imgur.com/786205S.png);background-size: cover;background-repeat: no-repeat;background-position-x: center;no-repeat;background-position-y:bottom}
.m-goomba             {position: fixed; z-index: 0;color: transparent;background-image: url(https://i.imgur.com/izaqvY0.png);background-size: contain;background-repeat: no-repeat;background-position-x: center;background-position-y: bottom;}
.m-mushroom             {position: fixed; z-index: 0;color: transparent;background-image: url(https://i.imgur.com/M36w8gJ.png);background-size: contain;background-repeat: no-repeat;background-position-x: center;background-position-y: bottom;}
.m-goomba-crushed     {position: fixed; z-index: 0;color: transparent;background-image: url(https://i.imgur.com/1JBPbsU.png);background-size: contain;background-repeat: no-repeat;background-position-x: center;background-position-y: bottom;}
.m-goomba-spawn 	   {color:transparent}
.m-mushroom-spawn 	   {color:transparent}
.m-start              {color: transparent}div#m-target {position: fixed;width: 10px;height: 16px;background:transparent;background-size: cover;background-position-x: center;}
.flippedX              {-webkit-transform: scaleX(-1);-moz-transform: scaleX(-1);-o-transform: scaleX(-1);transform: scaleX(-1);filter: FlipH;-ms-filter: "FlipH";}
.flippedY              {-webkit-transform: scaleY(-1);-moz-transform: scaleY(-1);-o-transform: scaleY(-1);transform: scaleY(-1);filter: FlipV;-ms-filter: "FlipV";}
.m-invisible-platform {color:transparent}
.m-invisible-kill     {color:red}
#m-messagebox		   {display:none;font-family: "Press Start 2P", cursive;position: fixed;top: 0;left: 0;background: white;border: 3px solid black;padding: 10px;font-size: 6px;line-height: 12px;}
.m-point-popup        {display: block;position: fixed;color: #fff;height: 10px;padding: 10px;font-family: "Press Start 2P", cursive;}
.show				   {display:block!important}
.hide				   {display:none!important}

#m-topbar { position: fixed;z-index: 2; width: 0px; height: 0px; background: transparent; top: 0; left: 0; font-family: "Press Start 2P", cursive; font-size: 10px; padding: 10px; line-height: 1.3; }
#lives-section { color: red; }
.outline{ text-shadow: 2px -2px 0 #000000, -2px 2px 0 #000000, -2px -2px 0 #000000, 2px 0px 0 #000000, 0px 2px 0 #000000, -2px 0px 0 #000000, 0px -2px 0 #000000, 0px 0px 4px rgb(0, 0, 0); }
#coin-icon {background: url(https://i.imgur.com/Wrq208j.gif);display: block;width: 11px;height: 13px;background-size: contain;float: left;position: relative;}
points-section { position: static; }
#points-section { position: fixed; right: 69px; color: white; padding: 10px; float: right; top: 0px; line-height: 1.6em; letter-spacing: 0.3em; }
#coins { position: relative; float: right; }
#death-screen-overlay {z-index: 1; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; }
#centered-modal { font-family: "Press Start 2P", cursive; width: 30%; height: 2em; display: block; position: fixed; top: 50%; left: 50%; margin-left: -15%; text-align: center; line-height: 2em; font-size: 0.8em; color: #ffbc00; }
#centered-model h1 { text-alight:centered }
#mario-dead { background: url(https://i.imgur.com/yQPo3eC.gif); position: relative; display: block; width: 100%; height: 100px; background-size: contain; float: right; background-position-x: center; background-repeat: no-repeat; margin-top: 20px; }
#paused-overlay {display:block;position:fixed;background: #6f6f6fcc;height:100%;width:100%;top: 0px;z-index: 1;}
#paused-center {color:white;font-family: "Press Start 2P"; display: block; position: fixed; top: 50%; left: 50%; }
#paused-title {font-size:2em;color: white;}
#m-options { margin-top:10px }
#m-options input{margin-top:10px }
#m-options input + label{ margin-left:10px }
#m-options input:checked + label{ color:red }
`;

const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);

document.querySelector('body').insertAdjacentHTML('beforeend', html);