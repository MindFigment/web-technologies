/* jshint strict: global, esversion: 6, devel: true */
'use strict';

let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
let min = (x, y) => x <= y ? x : y;

let kod = [0, 0, 0, 0, 1];
let ruch = [1, 0, 1, 1, 1];

const ocena = (kod) => {
    return (ruch) => {
        const out = countBlack(kod, ruch);
        const black = out[0];
        const left_moves = out[1];
        const kodMap = convert2Map(kod);
        const ruchMap = convert2Map(left_moves);
        let white = 0;
        ruchMap.forEach(function(v, k) {
            let x = kodMap.has(k) ? kodMap.get(k).length : 0
            white += min(v.length, x);
        });
        return [black, white];
    }
}

function countBlack(kod, ruch) {
    return [zip(kod, ruch)
           .map(([x, y]) => { 
               if (x == y) { 
                    ruch.pop();
                    return 1;
               } else {
                   return 0;
               }
           })
           .reduce((x, y) => x + y), ruch];
};

function convert2Map(arr) {
    let freqMap = new Map();
    arr.forEach((x, i) => freqMap.has(x) ? freqMap.set(x, freqMap.get(x).concat([i])) : freqMap.set(x, [i]));
    return freqMap;
}

console.log(ocena(kod)(ruch));



