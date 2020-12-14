/*jshint node: true, esversion: 6 */
'use strict';


const app = require('express')();
const uuid = require('uuid');
let bodyParser = require('body-parser')
const serveStatic = require('serve-static');
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(serveStatic('public'));

app.post('/game/new', (req, res) => {
    let id = uuid.v1();
    let size = parseInt(req.body.size, 10);
    let colors = parseInt(req.body.colors, 10);
    let steps = parseInt(req.body.steps, 10);
    let newGame = {
        "game": id,
        "size": size,
        "colors": colors,
        "steps": steps,
    }
    res.json(newGame);
    newGame.status = false;
    allGames.set(id, newGame);
    guessMe.set(id, randomGame(size, colors - 1));
    console.log(guessMe.get(id))
});

app.post('/game/move', (req, res) => {
    let trueScore = guessMe.get(req.body.game)
    let scores = ocena(trueScore)(req.body.move);
    let result = {
        "black": scores[0],
        "white": scores[1]
    };
    let game = allGames.get(req.body.game)
    if (game.status === true) {}
    else if (game.size === scores[0] && (game.steps > 0 || game.steps === undefined)) {
        game.status = true;
    }
    else {
        game.status = false;
    }
    if (game.steps !== undefined) {
        game.steps -= 1;
    }
    console.log("GAME STATUS", game.status);
    console.log(scores);
    allGames.set(game.id, game);
    res.json({
        "game": req.body.game,
        "result": result
    });
});

app.post('/game/status', (req, res) => {
    let game = allGames.get(req.body.game)
    res.json({
        "game": game.game,
        "solved": game.status
    });
});

app.listen(port, () => {
    console.log('Serwer działa na porcie 3000.');
});

let allGames = new Map();
let guessMe = new Map()

let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
let min = (x, y) => x <= y ? x : y;

const ocena = (kod) => {
    return (ruch) => {
        const black = countBlack(kod, ruch);
        const kodMap = convert2Map(kod);
        const ruchMap = convert2Map(ruch);
        let white = 0;
        ruchMap.forEach( (v, k) => {
            let x = kodMap.has(k) ? kodMap.get(k).length : 0
            white += min(v.length, x);
        });
        return [black, white - black];
    }
}

function countBlack(kod, ruch) {
    return zip(kod, ruch) 
           .map(([x, y], i) => { 
               if (x == y) { 
                    return 1;
               } else {
                   return 0;
               }
           })
           .reduce((x, y) => x + y);
};

function convert2Map(arr) {
    let freqMap = new Map();
    arr.forEach((x, i) => freqMap.has(x) ? freqMap.set(x, freqMap.get(x).concat([i])) : freqMap.set(x, [i]));
    return freqMap;
}

const randomGame = (size, colors) => [...new Array(size)]
    .map(() => Math.round(Math.random() * colors));

