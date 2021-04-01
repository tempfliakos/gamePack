document.addEventListener("DOMContentLoaded", function(event) {
    createDefinitionFields();
});

let fullTable;
let gameProgress;
const X = 'X';
const O = 'O';
const empty = 'empty';

let requiredMatches;

function createDefinitionFields() {
    const dataParentDiv = document.createElement('div');
    dataParentDiv.id = 'dataParentDiv';
    const dimensionParentDiv = document.createElement('div');
    dimensionParentDiv.id = 'dimensionParentDiv';
    const seqParentDiv = document.createElement('div');
    seqParentDiv.id = 'seqParentDiv';

    const dimensionLabel = document.createElement('label');
    dimensionLabel.id = 'inputLabel';
    dimensionLabel.for = 'inputField';
    dimensionLabel.innerHTML = 'DIMENZIÓ:';

    const dimensionInput = document.createElement('input');
    dimensionInput.id = 'inputField';
    dimensionInput.type = 'number';
    dimensionInput.min = 2;
    dimensionInput.max = 50;
    dimensionInput.value = 3;
    dimensionInput.onblur = () => {
        if (Number(dimensionInput.value) > Number(dimensionInput.max)) {
            dimensionInput.value = dimensionInput.max;
        }
        if (Number(dimensionInput.value) < Number(dimensionInput.min)) {
            dimensionInput.value = dimensionInput.min;
        }
    };

    const matchesLabel = document.createElement('label');
    matchesLabel.id = 'matchesLabel';
    matchesLabel.for = 'inputField';
    matchesLabel.innerHTML = 'SOROZAT:';

    const matchesInput = document.createElement('input');
    matchesInput.id = 'matchesInputField';
    matchesInput.type = 'number';
    matchesInput.min = 3;
    matchesInput.max = 50;
    matchesInput.value = 3;
    matchesInput.onblur = () => {
        if (Number(dimensionInput.value) < Number(matchesInput.value)) {
            matchesInput.value = dimensionInput.value;
        }
        if (Number(matchesInput.value) < Number(matchesInput.min)) {
            matchesInput.value = matchesInput.min;
        }
    };

    const actualPlayerLabel = document.createElement('label');
    actualPlayerLabel.id = 'actualPlayerLabel';
    actualPlayerLabel.for = 'inputField';
    actualPlayerLabel.innerHTML = 'Aktuális játékos';

    const actualPlayer = document.createElement('input');
    actualPlayer.id = 'actualPlayer';
    actualPlayer.disabled = true;



    const button = document.createElement('button');
    button.id = 'createField';
    button.type = 'submit';
    button.innerHTML = 'START';
    button.onclick = () => {
        if (!document.getElementById('gameBoard').firstChild) {
            document.getElementById('container').style.height = '90%';
            document.getElementById('container').style.minWidth = '50%';
            document.getElementById('gameBoard').innerHTML = '';
            document.getElementById('createField').innerHTML = '⭯';
            document.getElementById('createField').title = 'ÚJRA';
            document.getElementById('createField').style.width = 'auto';

            const playerParentDiv = document.createElement('div');
            playerParentDiv.id = 'playerParentDiv';

            const actualPlayerLabel = document.createElement('label');
            actualPlayerLabel.id = 'actualPlayerLabel';
            actualPlayerLabel.for = 'inputField';
            actualPlayerLabel.innerHTML = 'AKTUÁLIS JÁTÉKOS:';

            const actualPlayer = document.createElement('input');
            actualPlayer.id = 'actualPlayer';
            actualPlayer.disabled = true;

            document.getElementById('definition').insertBefore(playerParentDiv, document.getElementById('createField'));
            document.getElementById('definition').insertBefore(document.createElement('div'), playerParentDiv);
            addToDocument('playerParentDiv', [actualPlayerLabel, actualPlayer]);

            createField();
            document.getElementById('dataParentDiv').remove();
            document.getElementById('definition').style.flexDirection = 'row';
        } else {
            location.reload();
        }

    };
    const result = [dataParentDiv, button];

    addToDocument('definition', result);
    addToDocument('dataParentDiv', [dimensionParentDiv, seqParentDiv]);
    addToDocument('dimensionParentDiv', [dimensionLabel, dimensionInput]);
    addToDocument('seqParentDiv', [matchesLabel, matchesInput]);

}

function createField() {
    requiredMatches = Number(document.getElementById('matchesInputField').value) - 1;
    const dimension = Number(document.getElementById('inputField').value);
    document.getElementById('actualPlayer').value = 'X';
    gameProgress = {
        X: [],
        O: [],
        empty: []
    };
    for (let i = 0; i < dimension; ++i) {
        let result = [];
        const div = document.createElement('div');
        div.id = i + 'Div';
        for (let j = 0; j < dimension; ++j) {
            result.push(createGameBoard(i, j));
            addGameProgress(empty, [i, j]);
        }
        addToDocument('gameBoard', [div]);
        addToDocument(i + 'Div', result);
    }
}


function createGameBoard(x, y) {
    const button = document.createElement('button');
    button.id = x + ':' + y;
    button.type = 'submit';
    button.onclick = (event) => chooseButton(event);
    return button;
}

function chooseButton(event) {
    const button = document.getElementById(event.target.id);
    const hiddenInput = document.getElementById('actualPlayer');
    button.className = hiddenInput.value;
    button.disabled = true;
    const btnValue = document.getElementById('actualPlayer').value === X ? X : O;
    button.value = btnValue;

    hiddenInput.value = hiddenInput.value === X ? O : X;

    //a játéktábla frissítése az új mező lerakásakor
    const tempPoints = button.id.split(':');
    const points = [Number(tempPoints[0]), Number(tempPoints[1])];
    addGameProgress(button.value, points);

    if (checkGame(button.value)) {
        const winnerDiv = document.getElementById('winner');
        winnerDiv.style.visibility = 'visible';

        const dialog = document.createElement('dialog');
        dialog.id = 'winnerDialog';
        dialog.open = true;

        const nyertesDiv = document.createElement('div');
        nyertesDiv.id = 'nyertesDiv';

        const nyertesText = document.createElement('span');
        nyertesText.id = 'nyertesText';
        nyertesText.innerHTML = 'NYERTES: ';

        const nyertesValue = document.createElement('span');
        nyertesValue.id = 'nyertesValue';
        nyertesValue.innerHTML = button.value;
        nyertesValue.classList.add(button.value);

        const btnNewGame = document.createElement('button');
        btnNewGame.id = 'createNewGameDialog';
        btnNewGame.type = 'submit';
        btnNewGame.innerHTML = 'ÚJ JÁTÉK';
        btnNewGame.onclick = () => {
            location.reload();
        };

        addToDocument('container', [dialog]);
        addToDocument('winnerDialog', [nyertesDiv]);
        addToDocument('nyertesDiv', [nyertesText]);
        addToDocument('nyertesDiv', [nyertesValue]);
        addToDocument('winnerDialog', [btnNewGame]);
    }
}

function addGameProgress(value, points) {
    if (value != empty) {
        gameProgress[empty] = gameProgress[empty].filter(gp => gp[0] != points[0] || gp[1] != points[1]);
    }
    gameProgress[value].push(points);
}

function checkGame(value) {
    const filtered = sortGameProgress(value);
    AI();
    return checkXY(filtered, 1, 0) || checkXY(filtered, 0, 1) || checkDiaonal(filtered)
}

function sortGameProgress(value) {
    return gameProgress[value].sort((a, b) => {
        let result = a[0] - b[0];
        if (result == 0) {
            result = a[1] - b[1];
        }
        return result;
    });
}

function checkXY(filtered, x, y) {
    const mappedList = [...new Set(filtered.map(f => f[x]))].sort();
    for (elem of mappedList) {
        const actualColumn = filtered.filter(f => f[x] === elem);
        let nrOfMatches = 0;
        if (actualColumn.length > 1) {
            for (let i = 0; i < actualColumn.length - 1; ++i) {
                let actualElem = actualColumn[i][y];
                let nextElem = actualColumn[i + 1][y];

                if (actualElem + 1 === nextElem) {
                    nrOfMatches++;
                } else {
                    nrOfMatches = 0;
                }
                if (nrOfMatches >= requiredMatches) {
                    return true;
                }
            }
        }
    }
}

function checkDiaonal(filtered) {
    if (filtered.length > 1) {
        //balról jobbra átló (azért 1 a modifier mert mindig a következő sor jobbra lévő mezőjét kell nézni)
        for (let i = 0; i < filtered.length; ++i) {
            const nrOfMatches = checkDiagonalHelper(filtered.slice(i, filtered.length), 0, 1);
            if (nrOfMatches === requiredMatches) {
                return true;
            }
        }
        //jobbról balra átló (azért -1 a modifier mert mindig a következő sor balra lévő mezőjét kell nézni)
        for (let i = 0; i < filtered.length; ++i) {
            const nrOfMatches = checkDiagonalHelper(filtered.slice(i, filtered.length), 0, -1);
            if (nrOfMatches === requiredMatches) {
                return true;
            }
        }
    }
}

function checkDiagonalHelper(subList, nrOfMatches, modifier) {
    let findable = [subList[0][0] + 1, subList[0][1] + (modifier)];
    for (let elem of subList) {
        if (elem[0] === findable[0] && elem[1] === findable[1]) {
            const indexFrom = subList.indexOf(elem);
            nrOfMatches = checkDiagonalHelper(subList.slice(indexFrom), ++nrOfMatches, modifier);
        }
        if (nrOfMatches === requiredMatches) {
            return nrOfMatches;
        }
    }
    return nrOfMatches;
}
const nrOfTotalDepths = 5;

function AI() {
    const stepJSON = {};
    for (let emptyField of sortGameProgress(empty)) {
        stepJSON[emptyField[0] + ':' + emptyField[1]] = calculateWithDepths(emptyField);
    }
    console.log(stepJSON);
}

const win = 1;
const tie = 0;
const lose = -1;

function calculateWithDepths(field) {
    const depths = {};
    const gameProgressCopy = JSON.parse(JSON.stringify(gameProgress));
    const actualPlayer = document.getElementById('actualPlayer').value;
    const result = calculateFields(gameProgressCopy, field, 0, actualPlayer);
    console.log("field", field, "result", result);
    return 1;
}

function calculateFields(gameProgressCopy, field, nrOfDepths, actualPlayer) {
    console.log("depths", nrOfDepths);
    if (nrOfDepths < nrOfTotalDepths) {
        gameProgressCopy[empty] = gameProgressCopy[empty].filter(gp => gp[0] != field[0] || gp[1] != field[1]);
        gameProgressCopy[actualPlayer].push(field);
        calculateFields(gameProgressCopy, gameProgressCopy[empty][0], ++nrOfDepths, swapActualPlayer(actualPlayer));
    }
    return gameProgressCopy;
}

function swapActualPlayer(actualPlayer) {
    return actualPlayer === X ? O : X;
}

function addToDocument(parent, elements) {
    const destinationElement = document.getElementById(parent);
    for (element of elements) {
        destinationElement.appendChild(element);
    }
}