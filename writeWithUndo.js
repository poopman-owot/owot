function writeWithUndo() 
    { 
        var localEdits = [];

        function checkForUndo(e) {
            var ctrl = e.ctrlKey;
            var alt = e.altKey;
            var zKey = e.key.toLowerCase() == "z";
            if (ctrl && zKey && !alt) {
                undo();
            }
            if (ctrl && zKey && alt) {
                undoAll();
            }
        }
        function undo() {
            if (!localEdits) { return };
            var lastEdit = localEdits[localEdits.length - 1];
            if (!lastEdit) { return };
            var tileX = lastEdit[1].tileX;
            var tileY = lastEdit[1].tileY;
            var charX = lastEdit[1].charX;
            var charY = lastEdit[1].charY;
            var char = lastEdit[0].char;
            var color = lastEdit[0].color;

            renderCursor([tileX, tileY, charX, charY]);
            writeCharTo(char, color, tileX, tileY, charX, charY);
            localEdits.pop()
        };

        function undoAll() {
            var undoInterval = setInterval(doUndo, 5);
            function doUndo() {
                if (localEdits) { undo(); }
                else { stopUndoInterval(); }
            };
            function stopUndoInterval() {
                clearInterval(undoInterval);
            }
        };

        document.addEventListener("keydown", function (e) { checkForUndo(e); });

        w.on("writeBefore", function (data) {
            var charInfo = getCharInfo(data.tileX, data.tileY, data.charX, data.charY);
            localEdits.push([charInfo, data]);
        })
    }
writeWithUndo();