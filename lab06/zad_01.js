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

const fun1 = (arg, cb) => {
    setTimeout(() => {
        let compute = arg + 1;
        cb(compute);
    }, Math.random() * 1000);
}

const fun2 = (arg, cb) => {
    setTimeout(() => {
        let compute = arg * 2;
        cb(compute);
    }, Math.random() * 1000);
}

const cb = (output) => {
    console.log("output: " + output);
};

const poKolei = (fun1, fun2, cb) => {
    return (x) => {
        fun1(x, (result) => {
            fun2(result, cb)});
    };
};

poKolei(fun1, fun2, cb)(2);

poKolei(funA, funB, cb)(2);

