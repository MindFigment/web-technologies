/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const asyncFunGen = (fun) => {
    return (x, cb) => {
        setTimeout(() => {
            cb(fun(x));
        }, Math.random() * 1000);
    }
};

const funA = asyncFunGen( (x) =>  x + 1);
const funB = asyncFunGen( (x) =>  x * 2);
const funC = asyncFunGen( (x) =>  Math.pow(x, 2));

const reducer = (acc, cur) => acc + cur;

const cb = (argTab) => {
    console.log(argTab);
    console.log(argTab.reduce(reducer));
};

const razem = (funTab, cb) => {
    let results = new Array(funTab.length);
    return (argTab) => {
        funTab.forEach( (fun, i) => {
            fun(argTab[i], (arg) => {
                results[i] = arg;
                if (!results.includes(undefined)) {
                    cb(results);
                }
            });
        });
    };
    
};



const funTab = [funA, funB, funC];

razem(funTab, cb)([1, 1, 1]);

