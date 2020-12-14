/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const fib = (arg)  => {
    if (arg <= 0) {
        return 0;
    }
    if (arg === 1) {
        return 1;
    }
    return fib(arg - 1) + fib(arg - 2);
};

const memo = (cache, fun) => {
    let c = cache;
    function f(n) {
        let value;
        if (c[n] !== undefined) {
            value = c[n];
        } else {
            value = fun(f, n);
            c.push(value);
        }
        console.log(c);
        return value;
    }
    return f;
};


const fibonacci = memo([0, 1], (recur, n) => {
    return recur(n - 1) + recur(n - 2);
});

let n = 40;

console.log('with cache', fibonacci(n))
console.log('without cache', fib(n));
