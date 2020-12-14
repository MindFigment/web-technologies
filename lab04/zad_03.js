/* jshint strict: global, esversion: 6, devel: true */
'use strict';

let szablon =
  '<table border="{border}">' +
  '  <tr><td>{first}</td><td>{last}</td></tr>' +
  '</table>';

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

String.prototype.podstaw = function(dane) {
    let keys = Object.keys(dane);
    let string = this;
    Array.from(keys).forEach( (key, index) => {
        let re = `{${key}}`;
        let regex = new RegExp(re, 'g');
        string = string.replace(regex, dane[key]);

    });
    return string;
}

console.log(szablon.podstaw(dane));