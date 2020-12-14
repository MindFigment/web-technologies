/* jshint esversion: 6, browser: true, devel: true */

document.addEventListener('DOMContentLoaded', () => {
    let newGameBtn = document.getElementById("new-game");
    let sizeInp = document.getElementById("size");
    let colorsInp = document.getElementById("colors");
    let stepsInp = document.getElementById("steps");

    newGameBtn.addEventListener('click', () => {
        let size =  sizeInp.value.trim();
        let colors = colorsInp.value.trim();
        let steps = stepsInp.value.trim();

        newGame(size, colors, steps);
        
    });
});


const newGame =  (size, colors, steps) => {
    postData(`http://localhost:3000/game/new`, {size: size, colors: colors, steps: steps})
        .then(data => {
            // console.log(JSON.stringify(data));
            handleNewGame(data);
        }) 
        .catch(error => console.error(error));
};

const handleNewGame = (data) => {
    sessionStorage.setItem('game', data.game);
    sessionStorage.setItem('steps', data.steps);
    let lastGame = document.querySelector('.game');
    if (lastGame !== null) {
        lastGame.remove();
    }
    gameDiv = newElem('div', {className: "game"});
    document.body.appendChild(gameDiv);
    window.generateRow = newRowGen(data.size, data.colors);
    window.generateRow();
}

const checkStatus =  (result, step, wrappingDiv) => {
    let game = sessionStorage.getItem('game');
    postData(`http://localhost:3000/game/status`, {game: game})
        .then(data => {
            // console.log(JSON.stringify(data));
            handleCheckStatus(data, result, step, wrappingDiv);
        }) 
        .catch(error => console.error(error));
};

const handleCheckStatus = (data, result, steps, wrappingDiv) => {
    if (data.solved === true) {
        alert("YOU WON THE GAME");
    } else {
        sessionStorage.setItem('steps', steps - 1);
        wrappingDiv.appendChild(result);
        window.generateRow();
    }
}


const nextMove = (move) => {
    game = sessionStorage.getItem('game');
    postData(`http://localhost:3000/game/move`, {game: game, move: move})
        .then(data => {
            // console.log(JSON.stringify(data));
            handleNextMove(data);
        })
        .catch(error => console.error(error));
}

const handleNextMove = (data) => {
    let checkButton = document.querySelector('.button');
    let wrappingDiv = checkButton.parentNode;
    let circles = wrappingDiv.querySelectorAll('.circle');
    circles.forEach( (circle) => {
        circle.removeEventListener('click', window.nextColor);
    })
    checkButton.remove();
    let result = newElem('small', {className: ".result"});
    result.textContent = `Black: ${data.result.black} White: ${data.result.white}`
    
    let steps = sessionStorage.getItem('steps');
    if (steps - 1 === 0) {
        alert("YOU LOST THE GAME");
    } else {
        checkStatus(result, steps, wrappingDiv);
    }
}

const newRowGen = (size, colors) => {
    let width = (80 / size) + "%;";

    function random(number) {
        return Math.floor(Math.random() * number);
    }

    function setRandomColor() {
        let rndCol = 'rgb(' + random(255) + ', ' + random(255) + ', ' + random(255) + ')';
        return rndCol;
    }

    color2idx = new Map();
    idx2color = new Map();
    for (let i = 0; i < colors; i++) {
        let color = setRandomColor();
        color2idx.set(color, i);
        idx2color.set(i, color);
    }

    function setNextColor(color) {
        let idx = color2idx.get(color);
        idx = (idx + 1) % colors;
        return idx2color.get(idx)
    }

    function collectGuess() {
        let move = []
        let checkButton = document.querySelector('.button');
        let circles = checkButton.parentNode.querySelectorAll('.circle');
        circles.forEach( (circle) => {
            let idx = color2idx.get(circle.style.backgroundColor);
            move.push(idx);
        });
        return move;
    }

    window.nextColor = (e) => {
        e.target.style.backgroundColor = setNextColor(e.target.style.backgroundColor);
    }
    

    return () => {
        let wrappingDiv = newElem('div', {className: "wrapping"});
        for(let i = 1; i <= size; i++) {
            let myDiv = newElem('div', {className: "circle"});
            myDiv.setAttribute('style', 'width:' + width + 'background-color:' + idx2color.get(0) + ";");
            myDiv.addEventListener('click', window.nextColor);
            wrappingDiv.appendChild(myDiv);
        };

        let nextMoveButton = newElem('button', {className: "button"});
        nextMoveButton.textContent = "Check";
        nextMoveButton.addEventListener('click', () => { 
            let move = collectGuess();
            console.log("MOVE", move); 
            nextMove(move);
        });

        wrappingDiv.appendChild(nextMoveButton);
        gameDiv = document.querySelector('.game');
        gameDiv.appendChild(wrappingDiv);
        collectGuess();
    };
}


function postData(url = ``, data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects 
}

const newElem = (typ, attrs) => {
    let el = document.createElement(typ);
    Object.assign(el, attrs);
    return el;
};

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}