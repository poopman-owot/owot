var bigfont = function () {
    var letterLocation = [];
    var lastclicked = null;
    document.onclick = function () {
        lastclicked = currentPosition;
    };

    function newline() {
        renderCursor(lastclicked);
        for (i = 0; i < 4; i++) {
            w.moveCursor("down");
        }
    }

    function writeCharData(char, doNotMoveCursor, temp_color, noNewline) {
        var charColor = temp_color || YourWorld.Color;
        if (temp_color == 0) charColor = 0;
        var cursor = cursorCoords;
        if (!cursor && (char == "\n" || char == "\r") && !noNewline) {
            cursor = cursorCoordsCurrent;
        }
        char = advancedSplit(char);
        char = char[0];
        if (char == void 0) return;
        if (!cursor) return; // cursor is not visible?
        var tileX = cursor[0];
        var tileY = cursor[1];
        var charX = cursor[2];
        var charY = cursor[3];
        var newLine = (char == "\n" || char == "\r") && !noNewline;
        // first, attempt to move the cursor
        if (!doNotMoveCursor) {
            // get copy of cursor coordinates
            var cSCopy = cursor.slice();
            if (pasteDirRight) {
                // move cursor right
                cSCopy[2]++;
                if (cSCopy[2] >= tileC) {
                    cSCopy[2] = 0;
                    cSCopy[0]++;
                }
            } else {
                // move cursor left
                cSCopy[2]--;
                if (cSCopy[2] < 0) {
                    cSCopy[2] = tileC - 1;
                    cSCopy[0]--;
                }
            }

            if (newLine) {
                if (pasteDirDown) {
                    // move cursor down
                    cSCopy[3]++;
                    if (cSCopy[3] >= tileR) {
                        cSCopy[3] = 0;
                        cSCopy[1]++;
                    }
                } else {
                    // move cursor up
                    cSCopy[3]--;
                    if (cSCopy[3] < 0) {
                        cSCopy[3] = tileR - 1;
                        cSCopy[1]--;
                    }
                }
                // move x position to last x position
                cSCopy[0] = lastX[0];
                cSCopy[2] = lastX[1];
            }
            renderCursor(cSCopy);
            lastclicked = [lastclicked[0], cSCopy[1], lastclicked[2], cSCopy[3]]
            if (cursorCoords) {
                var compare = cursor.slice(0);
                if (cursorCoords[0] == compare[0] && cursorCoords[1] == compare[1] &&
                    cursorCoords[2] == compare[2] && cursorCoords[3] == compare[3]) {
                    return null;
                    // for the purpose of putting the paste feature on hold while
                    // the tile is still loading
                }
            }
        }
        // add the character at where the cursor was from
        if (!newLine) {
            var data = {
                char: char,
                color: charColor,
                tileX: tileX,
                tileY: tileY,
                charX: charX,
                charY: charY
            };
            letterLocation = [getChar(data.tileX, data.tileY, data.charX, data.charY), getCharColor(data.tileX, data.tileY, data.charX, data.charY), data.tileX, data.tileY, data.charX, data.charY];
            w.emit("writeBefore", data);
            writeCharTo(data.char, data.color, data.tileX, data.tileY, data.charX, data.charY);
            w.emit("write", data);
        }
    }
    w.input.disabled = true
    var undoStorage = [];
    document.onkeydown = function (e) {
        if (e.key.toLowerCase() == "enter") {
            newline();
        }
        if (e.key.toLowerCase() == "z" && e.ctrlKey && !e.altKey) {
            undo();
            return;
        }
        if (e.key.toLowerCase() == "z" && e.ctrlKey && e.altKey) {
            undoAll();
            return;
        }
        var localStorage = [];
        var letterValue = letterConvertion[e.key];
        if (!letterValue) return
        if (letterValue.match(/\n/gm)) {
            var baselineShift = letterValue.match(/\n/gm).length;
            var baselineOffset = 0;
        }
        if (parseInt(letterValue[0])) {
            baselineOffset = parseInt(letterValue[0])
            letterValue[0] = " "
        }

        for (i = 0; i < (baselineShift - baselineOffset); i++) {
            w.moveCursor("up")
        }
        for (i = 0; i < letterValue.length; i++) {

            if (letterValue[i].match(/\d/) == void 0) {
                writeCharData(letterValue[i]);
                if (letterLocation.length > 0) {
                    localStorage.push(letterLocation)
                }
            }

        }

        undoStorage.push(localStorage)
        for (i = 0; i < baselineOffset; i++) {
            w.moveCursor("up")
        }

    }

    function undo() {
        var lastcommit = undoStorage[undoStorage.length - 1];
        if (!lastcommit) return
        for (i = 0; i < lastcommit.length; i++) {
            var localSaved = lastcommit[i];
            writeCharTo(localSaved[0], localSaved[1], localSaved[2], localSaved[3], localSaved[4], localSaved[5]);

        }
        undoStorage.splice(-1, 1);
    }

    function undoAll() {
        while (undoStorage.length > 0) {

            undo()
        }
    }

    var letterConvertion = {
        "?": "┌─┐ \n└ │ \n ┌┘ \n ┴  \n ●  ",
        "!": "┬ \n│ \n│ \n┴ \n● ",
        ".": "▪ ",
        "]": "1─┐\n │\n │\n │\n─┘",
        "[": "1┌─\n│\n│\n│\n└─",
        "{": "1 ╭\n╭╯\n│ \n╰╮\n ╰",
        "}": "1╮ \n╰╮\n │\n╭╯\n╯ ",
        "@": "╭──╮\n│ Ⴋ╯\n╰──╯",
        "#": "─┼─┼─\n─┼─┼─\n     ",
        "$": "╔╩╗\n╚═╗\n╚╦╝",
        "%": "〇  ╱ \n  ╱  \n ╱ 〇 ",
        "&": " ╭─╮ \n╭╰╲╯╱\n╰──╲ ",
        "|": "║\n║\n║",
        "/": "  ╱\n ╱ \n╱  ",
        "\\": "╲  \n ╲ \n  ╲",
        _: "___",
        "(": "1╭\n│\n│\n│\n╰",
        ")": "1╮\n│\n│\n│\n╯",
        ":": "▪\n\n▪",
        ";": "▪\n\n/",
        " ": "  \n  \n  \n  ",
        ",": " / ",
        "'": "/\n \n  ",
        '"': "//\n \n  ",
        "-": " ___\n\n    ",
        "~": ' ◠◡ \n\n   ',
        "=": ' 〓〓〓 \n     ',
        "^": ' ╱╲ \n\n\n   ',
        "*": '✴\n\n  ',
        "+": '╋  \n',
        ">": '╲\n╱\n ',
        "<": '╱\n╲\n ',
        1: "▄█\n █\n ▀ ",
        2: "▀▀█\n▄▀ \n▀▀▀ ",
        3: "▀▀█\n ▀▄\n▀▀▀ ",
        4: "█ █\n▀▀█\n  ▀ ",
        5: "█▀▀\n▀▀█\n▀▀▀ ",
        6: "█▀▀\n█▀█\n▀▀▀ ",
        7: "▀▀█\n  █\n  ▀ ",
        8: "█▀█\n█▀█\n▀▀▀ ",
        9: "█▀█\n▀▀█\n  ▀ ",
        0: "█▀█\n█ █\n▀▀▀ ",
        A: "█▀▀▀█\n█▀▀▀█\n▀   ▀ ",
        B: "█▀▀▀█\n█▀▀▀█\n▀▀▀▀▀ ",
        C: "█▀▀▀▀\n█ \n▀▀▀▀▀ ",
        D: "█▀▀▀▄\n█   █\n▀▀▀▀  ",
        E: "█▀▀▀▀\n█▀▀▀▀\n▀▀▀▀▀ ",
        F: "█▀▀▀\n█▀▀▀\n▀    ",
        G: "█▀▀▀▀\n█  ▀█\n▀▀▀▀▀ ",
        H: "█   █\n█▀▀▀█\n▀   ▀ ",
        I: "▀█▀\n █ \n▀▀▀ ",
        J: "▀▀█▀\n▄ █ \n▀▀▀  ",
        K: "█   █\n█▀▀▀▄\n▀   ▀ ",
        L: "█ \n█ \n▀▀▀▀ ",
        M: "█▀█▀█\n█ █ █\n▀ ▀ ▀ ",
        N: "█▄  █\n█ ▀▄█\n▀   ▀ ",
        O: "█▀▀▀█\n█   █\n▀▀▀▀▀ ",
        P: "█▀▀▀█\n█▄▄▄█\n▀     ",
        Q: "█▀▀▀█\n█ ▀▄▀\n▀▀▀ ▀ ",
        R: "█▀▀▀█\n█▀▀█▀\n▀   ▀ ",
        S: "█▀▀▀▀\n▀▀▀▀█\n▀▀▀▀▀ ",
        T: "▀▀█▀▀\n  █ \n  ▀   ",
        U: "█   █\n█   █\n▀▀▀▀▀ ",
        V: "█   █\n █ █ \n  ▀   ",
        W: "█ █ █\n█ █ █\n▀▀▀▀▀ ",
        X: "▀▄ ▄▀\n ▄▀▄ \n▀   ▀ ",
        Y: "▀▄ ▄▀\n  █ \n  ▀   ",
        Z: "▀▀▀█▀\n ▄▀ \n▀▀▀▀▀ ",
        a: '\n\n┌─┐\n┌─┤\n└─┴',
        b: '\n┐  \n├─┐\n│ │\n┴─┘',
        c: '\n\n┌─┐\n│  \n└─┘',
        d: '\n  ┐\n┌─┤\n│ │\n└─┴',
        e: '\n\n┌─┐\n├─┘\n└─┘',
        f: '\n┌─┐\n├┤ \n│  \n┴  ',
        g: '1\n\n┌─┬\n│ │\n└─┤\n└─┘',
        h: '\n┐  \n├─┐\n│ │\n┴ ┴',
        i: '\n . \n─┐ \n │ \n─┴─',
        j: '1\n  .\n ─┐\n  │\n  │\n└─┘',
        k: '\n┐  \n│┌ \n├┴┐\n┴ ┴',
        l: '\n ┐ \n │ \n │ \n─┴─',
        m: '\n\n┬┬┐\n│││\n┘┴└',
        n: '\n\n┬─┐\n│ │\n┴ ┴',
        o: '\n\n┌─┐\n│ │\n└─┘',
        p: '1\n\n┬─┐\n│ │\n├─┘\n┴  ',
        q: '1\n\n┌─┬\n│ │\n└─┤\n  ┴',
        r: '\n\n┬─┐\n│  \n┴  ',
        s: '\n\n┌─┐\n└─┐\n└─┘',
        t: '\n┐  \n├─ \n│  \n└─┘',
        u: '\n\n┐ ┐\n│ │\n└─┴',
        v: '\n\n┐ ┌\n└┐│\n └┘',
        w: '\n\n┐┬┌\n│││\n└┴┘',
        x: '\n\n┌┐┬\n┌┼┘\n┴└┘',
        y: '1\n\n┬ ┬\n│ │\n└─┤\n└─┘',
        z: '\n\n┌─┐\n┌─┘\n└─┘'
    };

    alert("ctrl+z: undo\nctrl+alt+z: undo all");
}();