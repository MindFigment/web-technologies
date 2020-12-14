/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const fun1 = (arg, cb) => {
    setTimeout(() => {
        let result = arg + 1;
        cb(result);
    }, Math.random() * 1000);
}

const fun2 = (arg, cb) => {
    setTimeout(() => {
        let result = arg + 2;
        cb(result);
    }, Math.random() * 1000);
}

const cb = (arg1, arg2) => {
    console.log(`output: ${arg1} + ${arg2}`);
    console.log(arg1 + arg2);
};

const razem = (fun1, fun2, cb) => {
    let results = [];
    return (x, y) => {
        fun1(x, (arg) => {
            results[0] = arg;
            if (results[1] !== undefined) {
                cb(results[0], results[1]);
            }
        });
        fun2(y, (arg) => {
            results[1] = arg;
            if (results[0] !== undefined) {
                cb(results[0], results[1]);
            }
        });
    }
};

razem(fun1, fun2, cb)(1, 2);

