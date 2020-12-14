/* jshint strict: global, esversion: 6, devel: true */
'use strict';

function defFun(fun, types) {
    fun.typeConstr = types;
    return fun;
}

const myWrongFun = (a, b) => a + b;

const myfun = defFun((a, b) => a + b, ['number', 'number']);

function appFun(f) {
    if (f.typeConstr) {
       Array.from(arguments).slice(1).forEach((arg, i) => {
            if (typeof arg !== f.typeConstr[i]) {
                throw({ typerr: "Spodziewałem się " + (typeof arg) + ", a dostałem " + (f.typeConstr[i])});
            }
        });
        return f.apply(this, Array.from(arguments).slice(1));
    } else {
        throw({ typerr: "Funkcja nie posiada atrybutu typeConstr" });
    }
}

try {
    console.log(appFun(myfun, 12, 23));
} catch (e) {
    console.log(e.typerr);
}

try {
    console.log(appFun(myfun, 12, "23"));
} catch (e) {
    console.log(e.typerr);
}

try {
    console.log(appFun(myWrongFun, 12, 23));
} catch (e) {
    console.log(e.typerr);
}