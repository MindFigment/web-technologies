/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const asyncFunGen = (fun) => {
    return (x, cb) => {
        setTimeout(() => {
            cb(fun(x));
        }, Math.random() * 1000);
    }
};

const funA =  asyncFunGen( (x) => x + 1);
const funB = asyncFunGen( (x) => x * 2);
const funC = asyncFunGen( (x) => Math.pow(x, 2));

const cb = (output) => {
    console.log("output: " + output);
};

const poKoleiTab = (funTab, cb) => {
    const recur = (x, funTab) => {
        if (funTab.length === 1) {
            funTab[0](x, cb);
        } else {
            funTab[0](x, (result) => recur(result, funTab.slice(1)));
        }
    }
    return (x) => {
        recur(x, funTab);
    }

};

const funTab = [funA, funB, funC];

poKoleiTab(funTab, cb)(1);

