var linedraw = function() {
    class EventHandlerClass {
        constructor() {
            this.functionMap = {};
        }

        addEventListener(event, func) {
            this.functionMap[event] = func;
            document.addEventListener(event.split('.')[0], this.functionMap[event]);
        }

        removeEventListener(event) {
            document.removeEventListener(event.split('.')[0], this.functionMap[event]);
            delete this.functionMap[event];
        }
    }

    const EventHandler = new EventHandlerClass();

    var chars =
    {
        horizontal: ["─", "═"],
        vertical: ["│", "║"],
        cross: ["┼", "╬", "╪", "╫"],
        t_down: ["┬", "╦", "╤", "╥"],
        t_up: ["┴", "╩", "╧", "╨"],
        t_right: ["├", "╠", "╟", "╞"],
        t_left: ["┤", "╣", "╢", "╡"],
        tl: ["┌", "╔"],
        tr: ["┐", "╗"],
        bl: ["└", "╚"],
        br: ["┘", "╝"]
    }

    var dirHistory = ""
    var firstChar = true;
    var altChars = false;
    function charByHistory(ArrowLeft, ArrowRight, ArrowUp, ArrowDown, defaultDirection) {
        if (dirHistory == "ArrowLeft") {
            return ArrowLeft;
        }
        else if (dirHistory == "ArrowRight") {
            return ArrowRight;
        }
        else if (dirHistory == "ArrowUp") {
            return ArrowUp;
        }
        else if (dirHistory == "ArrowDown") {
            return ArrowDown;
        }
        else {
            return defaultDirection;
        }
    };
    function charByData(i, horizontal, vertical, firstH, firstV, defaultChar) {
        var charData = getChar();

        if (firstChar) {
            if (charData == chars.horizontal[i] || charData == firstH[i]) {

                return firstH[i];
            }
            else if (charData == chars.vertical[i] || charData == firstV[i]) {
                return firstV[i];
            }

            else if (charData == chars.horizontal[1 - i]) {
                if (typeof firstH[2 + i] == "undefined") {
                    return defaultChar[i];
                }
                return firstH[2 + i];
            }
            else if (charData == chars.vertical[1 - i]) {
                if (typeof firstV[2 + i] == "undefined") {
                    return defaultChar[i];
                }
                return firstV[2 + i];
            }


            else {
                return defaultChar[i];
            }
        }
        else {
            if (altChars) {

                if (charData == chars.horizontal[i]) {

                    return horizontal[i];
                }
                else if (charData == chars.vertical[i]) {

                    return vertical[i];
                }
                else if (charData == chars.horizontal[0]) {
                    if (typeof horizontal[3] == "undefined") {
                        return defaultChar[i];
                    }
                    return horizontal[3];
                }
                else if (charData == chars.vertical[0]) {
                    if (typeof vertical[2] == "undefined") {
                        return defaultChar[i];
                    }
                    return vertical[2];
                }

                else {

                    return defaultChar[i];
                }


            }
            else {
                if (charData == chars.horizontal[i]) {
                    return horizontal[i];
                }
                else if (charData == chars.vertical[i]) {
                    return vertical[i];
                }
                else if (charData == chars.horizontal[1]) {
                    if (typeof horizontal[2] == "undefined") {
                        return defaultChar[i];
                    }
                    return horizontal[2];
                }
                else if (charData == chars.vertical[1]) {
                    if (typeof vertical[3] == "undefined") {
                        return defaultChar[i];
                    }
                    return vertical[3];
                }
                else {

                    return defaultChar[i];
                }
            }
        }

    };
    function draw(arrow, i) {

        if (arrow == "ArrowLeft") {
            w.moveCursor("right");
            var char = charByHistory(chars.horizontal[i], chars.horizontal[i], chars.tr[i], chars.br[i], chars.horizontal[i]);
            char = [char, char];
            char = charByData(i, char, chars.cross, char, chars.t_left, char);
            w.typeChar(char, true);
            w.moveCursor("left");
        }

        if (arrow == "ArrowRight") {
            w.moveCursor("left");
            var char = charByHistory(chars.horizontal[i], chars.horizontal[i], chars.tl[i], chars.bl[i], chars.horizontal[i]);
            char = [char, char];
            char = charByData(i, char, chars.cross, char, chars.t_right, char);
            w.typeChar(char, true);
            w.moveCursor("right");
        }

        if (arrow == "ArrowUp") {
            w.moveCursor("down");
            var char = charByHistory(chars.bl[i], chars.br[i], chars.vertical[i], chars.vertical[i], chars.vertical[i]);
            char = [char, char];
            char = charByData(i, chars.cross, char, chars.t_up, char, char);
            w.typeChar(char, true);
            w.moveCursor("up");
        }

        if (arrow == "ArrowDown") {
            w.moveCursor("up");
            var char = charByHistory(chars.tl[i], chars.tr[i], chars.vertical[i], chars.vertical[i], chars.vertical[i]);
            char = [char, char];
            char = charByData(i, chars.cross, char, chars.t_down, char, char);
            w.typeChar(char, true);
            w.moveCursor("down");
        }
        dirHistory = arrow;
        firstChar = false;
    };


    function load() {
        EventHandler.addEventListener("keydown.linedraw", function (e) {
            if (e.code == "Escape") {
                unload();
                return
            }
            draw(e.code, ~~altChars)
        });
        EventHandler.addEventListener("click.linedraw", function () {
            firstChar = true;
            dirHistory = "";
        });

        EventHandler.addEventListener("dblclick.linedraw", function () {
            altChars = !altChars
        });
    };
    function unload() {
        EventHandler.removeEventListener('keydown.linedraw');
        EventHandler.removeEventListener('click.linedraw');
        EventHandler.removeEventListener('dblclick.linedraw');
        console.log("Line Drawer Unloaded.")
    }
    load();

} ();