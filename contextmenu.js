var isMobile = false;
var showKeyboard = false;

function BuildContextMenu() { // Get the canvas element
  const canvas = document.getElementById('main_view');

  // Create a context menu container
  const contextMenu = document.createElement('div');
  contextMenu.classList.add('context-menu');

  // Create the buttons
  const buttons = [{
      label: 'paste',
      action: context_Paste
    },
    {
      label: 'copy char',
      action: context_Copy
    },
    {
      label: 'copy char color',
      action: context_copyColor

    },
    {
      label: 'copy char background',
      action: context_copyColorBG
    },
    {
      label: 'region select',
      action: context_RegionSelect
    }
  ];

  function CreateContextMenuButtons() {
    // Create buttons and attach event listeners
    buttons.forEach(button => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = button.label;

      // Attach the custom function to the button click event
      buttonElement.addEventListener('click', button.action);
      // Append the button to the context menu
      contextMenu.appendChild(buttonElement);
    });
  }
  CreateContextMenuButtons();
  // Append the context menu to the document body
  document.body.appendChild(contextMenu);

  elm.main_view.addEventListener('contextmenu', function(e) {
    handleContextMenu(e);
  });
  let startX = 0;
  let startY = 0;
  let isDraggingMobile = false;
  // Add event listener to handle long touch and show the context menu
  elm.main_view.addEventListener('touchstart', function(e) {
    if (!isMobile) {
      setup_Mobile_CSS();
    }
    //handle dragging for mobile without a context menu
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDraggingMobile = false;


    e.preventDefault();
    hideContextMenu();
    touchTimeout = setTimeout(function() {
      handleContextMenu(e);

    }, 500); // Adjust the timeout duration (in milliseconds) to define the long touch duration
  });

  // Add event listener to handle touchend and clear the timeout
  elm.main_view.addEventListener('touchend', function() {
    clearTimeout(touchTimeout);
  });


  // Add event listener to track touchmove event
  elm.main_view.addEventListener('touchmove', function(event) {
    const touch = event.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    // Calculate the distance moved
    const distanceX = Math.abs(currentX - startX);
    const distanceY = Math.abs(currentY - startY);

    // Check if the distance moved is significant
    if (distanceX > 10 || distanceY > 10) {
      isDraggingMobile = true;
    }
  });



  elm.main_view.addEventListener('click', function() {
    // Hide the context menu
    hideContextMenu();

  });

  function handleContextMenu(e) {
    if (w.regionSelect.isSelecting == false && isDraggingMobile == false) {
      var pageX = Math.trunc((e.type == "touchstart" ? e.targetTouches[0].pageX : e.pageX) * zoomRatio);
      var pageY = Math.trunc((e.type == "touchstart" ? e.targetTouches[0].pageY : e.pageY) * zoomRatio);
      var pos = getTileCoordsFromMouseCoords(pageX, pageY);
      w.emit("mouseUp", {
        tileX: pos[0],
        tileY: pos[1],
        charX: pos[2],
        charY: pos[3],
        pageX: pageX,
        pageY: pageY
      });
      renderCursor(pos)
      e.preventDefault();

      // Position the context menu at the click location
      contextMenu.style.left = (e.type == "touchstart" ? e.targetTouches[0].pageX : e.pageX) + 'px';
      contextMenu.style.top = (e.type == "touchstart" ? e.targetTouches[0].pageY : e.pageY) + 'px';
      contextMenu.style.display = 'block';
      SetKeyboard();

    } else {
      hideContextMenu();

    }
  }

  function SetKeyboard() {
    if (isMobile) {
      if (showKeyboard) {
        elm.textInput.focus();
      } else {
        elm.textInput.blur();
      }
    }

  }

  function hideContextMenu() {
    contextMenu.style.display = 'none';
    SetKeyboard();
  };

  // Function for regionSelect
  function context_RegionSelect() {
    w.regionSelect.startSelection();
    hideContextMenu();

  }
  w.regionSelect.onselection(
    function() {
      if (isMobile) {
        Modal.current.setMinimumSize(document.body.clientWidth, document.body.clientheight);
        Modal.current.setMaximumSize(document.body.clientWidth, document.body.clientheight);
        if (isMobile) {
          elm.textInput.blur(); //this should be force since the keyboard will cover the close button.
        }
      }
    }

  )

  function context_Copy() {
    hideContextMenu();
    var pos_ref = cursorCoords;
    if (pos_ref) {
      var tileX = pos_ref[0];
      var tileY = pos_ref[1];
      var charX = pos_ref[2];
      var charY = pos_ref[3];
      var char = getChar(tileX, tileY, charX, charY);
      char = char.replace(/\r|\n/g, " ");
      w.clipboard.copy(char);
    }

  } {}

  function context_CopyColor(bg = false) {
    hideContextMenu();
    var pos = currentPosition;
    if (!pos) return;
    var tileX = pos[0];
    var tileY = pos[1];
    var charX = pos[2];
    var charY = pos[3];
    var color;
    if (!bg) {
      color = getCharColor();
      w.changeColor(color);
    } else {
      color = getCharBgColor();
      w.changeBgColor(color);
    }
  }

  function context_copyColor() {
    mobileCopyColor();
  }

  function context_copyColorBG() {
    mobileCopyColor(true);
  }

  function context_Paste() {
    // Request permission to access the clipboard
    navigator.permissions.query({
      name: 'clipboard-read'
    }).then(function(result) {
      if (result.state === 'granted' || result.state === 'prompt') {
        // Read the clipboard contents
        navigator.clipboard.readText().then(function(text) {
          // Do something with the pasted text
          elm.textInput.value = text;
        }).catch(function(error) {
          console.error('Failed to read clipboard contents:', error);
        });
      }
    })

    hideContextMenu();
  }

  function isMobileDevice() {
    const userAgent = navigator.userAgent;
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

  if (isMobileDevice()) {
    setup_Mobile_CSS();
  } else {

  }
}

BuildContextMenu();

function setup_Mobile_CSS() {
  isMobile = true;
  //add "mobile" class to elements
  for (const key of Object.keys(elm)) {
    const i = elm[key];
    if (i instanceof HTMLElement) {
      i.classList.add("mobile");
    }
  }

  elm.menu_elm.addEventListener("touchstart", function() {
    if (menu.visible) {
      menu.unpin();
      menu.hideNow();
    }
  })

  elm.chat_open.innerHTML = `<span style = "display: flex;flex-wrap: nowrap;align-content: center;justify-content: center; align-items: center;"><span id ="chat-icon">🗨️</span><b id="total_unread" class="unread mobile" style="display:none">(-)</b></span>`;
  elm.menu_elm.innerText = "⋮";
  var keyboard_elm = document.createElement('div');
  keyboard_elm.id = "keyboard";
  keyboard_elm.innerHTML = `
<span id="keyboard_icon">⌨️</span>

`;
  document.body.appendChild(keyboard_elm);

  keyboard_elm.addEventListener('touchstart', function(e) {
    showKeyboard = !showKeyboard;
  })
}


styleDiv = document.createElement('style');
styleDiv.innerHTML = `
#chat-icon {
    position: absolute;
    top: 0.25em;
    left: 0.25em;
    z-index: 1;
}
.mobile + #modal_overlay {
    justify-content: normal !important;
    align-items: normal;
}
.mobile + #modal_overlay {
    /* color: red; */
    font-size: x-large;
}

.mobile + #modal_overlay button {
    font-size: x-large;
}
#menu.mobile, #chat_open.mobile, #keyboard{
    font-size: xx-large;
    padding: 0.4em;
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    width: 1em;
    height: 1em;
position: fixed;
    top: 0px;
}
#chat_window.mobile {
    width: 100%!important;
    height: 100%!important;
    z-index: 100;
    position: fixed;
}
#nav.mobile {
    top: 4.1em!important;
    min-width: max-content;
    font-size: unset;
    overflow-y: scroll;
    height: max-content;
    margin: 0px;
    padding: 1em;
}
.mobile #chat_upper .chat_tab_button, .mobile #chat_lower #chatsend {
    font-size: large;
    padding: 0.5em;
}
.mobile #chat_close {
    font-size: xx-large;
    padding: 0.3em;
    display: flex;
    align-items: center;
    justify-content: center;
}
.mobile #usr_online {
    font-size: smaller;
}
#nav.mobile li {
    padding: 0.5em;
    margin: 0px;
}
.context-menu {
  position: fixed;
  display: none;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 999;
}

.context-menu button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 6px;
  border: none;
  background-color: transparent;
  color: #333;
  text-align: left;
  cursor:pointer;
}

.context-menu button:hover {
  background-color: #f0f0f0;
}
.mobile#total_unread {
    z-index: 2;
		font-family: monospace;
}
#keyboard {
    left: 50%;
    margin-left: -0.75em;
    background: #8aa2c5;
}
`

document.body.appendChild(styleDiv)
