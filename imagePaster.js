alert("1: Copy image to clipboard.\n2. Click where you want to paste.\n3. Press Ctrl+v\n\nA good image size is 32x32")
var CLIPBOARD = new CLIPBOARD_CLASS("my_canvas", true);

function owot_color_code(rgb24) {
    if(rgb24 == 0) return "\x1Bx";
    var str = rgb24.toString(16);
    return "\x1B" + "ABCDEF"[str.length - 1] + str;
}

function CLIPBOARD_CLASS(canvas_id, autoresize) {
    var _self = this;

    //build offscreen canvas
    var clipboardCanvas = new OffscreenCanvas(10, 10);
    clipboardCanvas.id = "image-canvas";
    const offScreenCTX = clipboardCanvas.getContext('2d');

    //handlers
    document.addEventListener('paste', function (e) {
        _self.paste_auto(e);
    }, false);

    function colourToNumber(r, g, b) {
        return (r << 16) + (g << 8) + (b);
    }

    //on paste
    this.paste_auto = function (e) {
        if (e.clipboardData) {
            var items = e.clipboardData.items;
            if (!items) return;

            //access data directly
            var is_image = false;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    //image
                    var blob = items[i].getAsFile();
                    var URLObj = window.URL || window.webkitURL;
                    var source = URLObj.createObjectURL(blob);
                    this.paste_createImage(source);
                    is_image = true;
                }
            }
            if (is_image == true) {
                e.preventDefault();
            }
        }
    };
    //draw pasted image to canvas
    this.paste_createImage = function (source) {
        var pastedImage = new Image();
        var imageData;
        pastedImage.onload = function () {
            clipboardCanvas.width = pastedImage.width;
            clipboardCanvas.height = pastedImage.height;
            offScreenCTX.drawImage(pastedImage, 0, 0);
            console.log(clipboardCanvas.width)
            imageData = offScreenCTX.getImageData(0, 0, clipboardCanvas.width, clipboardCanvas.height);
            _self.drawImage(imageData)
        };
        pastedImage.src = source;

    };
    //paste image to owot canvas
    this.drawImage = function (imageData) {
		var str = "";
		var rgb = imageData.data;
		var lastColor = -1;
		var spaces_when_white = true;
		for(var i = 0; i < rgb.length; i += 4) {
			var r = rgb[i + 0];
            var g = rgb[i + 1];
            var b = rgb[i + 2];
			var a = rgb[i + 3];
			var color = colourToNumber(r, g, b);
			var code = "";
			if(lastColor != color) {
				code = owot_color_code(color);
			}
			lastColor = color;
			if((i / 4) % imageData.width == 0 && (i / 4) != 0) str += "\n";
			if((color == 0xFFFFFF || a == 0) && spaces_when_white) {
				str += "  ";
			} else {
				str += code + "██";
			}
		}
		w.input.value = str;
    };
}