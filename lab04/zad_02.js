/* jshint strict: global, esversion: 6, devel: true */
'use strict';

let tekst = 'Ala i As poszli w las';

String.prototype.nbsp = function() {
    let re = /(\s[i,o,u,w,z])(\s)/g;
    return this.replace(re, '$1&nbsp;');
}

console.log(tekst.nbsp());
