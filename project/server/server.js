/* jshint node: true, esversion: 6 */
"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 4444;//4444;

const request = require("request");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const md5 = require("blueimp-md5");

const server = require("http").createServer(app);

/// /////////////////////////////////////////////////

// mechanizm sesji (wykorzystamy bazę Redis)
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const client = require("redis").createClient();
client.on("connect", () => console.log("Redis connected"));
const sessionStore = new RedisStore({
    host: "localhost",
    port: 6379,
    client: client,
    ttl: 260
});

// Passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Socket.io (wraz z modułem autoryzacji poprzez Passport)
const io = require("socket.io")(server);
const passportSocketIo = require("passport.socketio");

// Konfiguracja passport.js
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        if ((username === "admin") && (password === "tajne")) {
            console.log("Udane logowanie...");
            return done(null, {
                username: username,
                password: password
            });
        } else {
            return done(null, false);
        }
    }
));

// konfiguracji aplikacji Express.js
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// konfiguracja obsługi sesji (poziom Express,js)
const sessionSecret = "Wielki$ekret44";
const sessionKey = "express.sid";
app.use(session({
    key: sessionKey,
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

// middleware Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.post("/login",
    passport.authenticate("local", {
        // failureRedirect: "/secure"
    }),
    (req, res) => {
        // res.redirect("/home");
        res.send(req.body);
    }
);
app.get("/logout", (req, res) => {
    console.log("Wylogowanie...");
    req.logout();
    res.send("OK");
});

/// ///////////////////////////////////////////////////////////////

const onAuthorizeSuccess = (data, accept) => {
    // data – informacje o połączeniu (od Passport.js)
    // accept – funkcja służąca do akceptowania/odrzucania połączenia
    //          odrzucenie: accept(new Error('powód odrzucenia'));
    console.log("Udane połączenie z socket.io", data);
    accept(null, true);
};
// połączenie od nieutoryzowanego użytkownika lub sytuacja błędna
const onAuthorizeFail = (data, message, error, accept) => {
    if (error) { // wystąpił błąd
        throw new Error(message);
    }
    // połączenie nieautoryzowane (ale nie błąd)
    console.log("Nieudane połączenie z socket.io", sessionStore);
    // accept(new Error("Brak autoryzacji!"));
    accept(null, false);
};
// passport-socketio jako „middleware” dla Socket.io
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: sessionKey,
    secret: sessionSecret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

/// ////////////////////////////////////////////////////////////////

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const lodashId = require("lodash-id");
const db = low(adapter);
db._.mixin(lodashId);

let countries = require("./countries.json");

db.defaults({
    sedziowie: [],
    klasy: [],
    konie: [],
    kraje: countries
}).write();

app.use(express.static("public"));

app.get("/sedziowie", (req, res) => {
    let judges = db.get("sedziowie").value();
    return res.send(judges);
});

app.get("/sedziowie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let judge = db.get("sedziowie").getById(id).value();
    return res.send(judge);
});

app.post("/sedziowie", (req, res) => {
    let judge = req.body;
    db.get("sedziowie").insert(judge).write();
    return res.send(judge);
});

app.delete("/sedziowie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    const deleted = db.get("sedziowie").removeById(id).write();
    return res.send(deleted);
});

app.put("/sedziowie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let judge = req.body;
    let updatedJudge = db.get("sedziowie").updateById(id, judge).write();
    return res.send(updatedJudge);
});

app.get("/kraje", (req, res) => {
    let countries = db.get("kraje").value();
    return res.send(countries);
});

app.get("/klasy", (req, res) => {
    let classes = db.get("klasy").value();
    return res.send(classes);
});

app.get("/klasy/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let classes = db.get("klasy").getById(id).value();
    return res.send(classes);
});

app.post("/klasy", (req, res) => {
    let class_ = req.body;
    db.get("klasy").insert(class_).write();
    return res.send(class_);
});

app.delete("/klasy/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    const deleted = db.get("klasy").removeById(id).write();
    return res.send(deleted);
});

app.put("/klasy/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let class_ = req.body;
    let updated = db.get("klasy").updateById(id, class_).write();
    return res.send(updated);
});

app.get("/konie", (req, res) => {
    let horses = db.get("konie").value();
    return res.send(horses);
});

app.get("/konie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let horses = db.get("konie").getById(id).value();
    return res.send(horses);
});

app.post("/konie", (req, res) => {
    let horse = req.body;
    db.get("konie").insert(horse).write();
    return res.send(horse);
});

app.delete("/konie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    const deleted = db.get("konie").removeById(id).write();
    const toUpdate = db.get("konie").filter((h) => h.numer > deleted.numer).value();
    toUpdate.forEach((h) => {
        h.numer -= 1;
        db.get("konie").updateById(h.id, { numer: h.numer });
    });
    return res.send(deleted);
});

app.put("/konie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let horse = req.body;
    let updated = db.get("konie").updateById(id, horse).write();
    return res.send(updated);
});

app.put("/konie", (req, res) => {
    let horses = req.body;
    let updatedHorses = [];
    horses.forEach((h) => {
        let updated = db.get("konie").updateById(h.id, { numer: h.numer });
        updatedHorses.push(updated);
    });
    return res.send(updatedHorses);
});

app.get("/konie/pagination/:perPage/:page", (req, res) => {
    let perPage = parseInt(req.params.perPage);
    let page = parseInt(req.params.page);
    let from = page === 1 ? 0 : (page - 1) * perPage;
    let to = from + perPage;
    let pageHorses = db.get("konie").slice(from, to).value();
    let len = db.get("konie").value().length;
    return res.send({ pageHorses, len });
});

app.get("/klasy/konie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let horsesInClass = db.get("konie").filter({ klasa: id }).value();
    return res.send(horsesInClass);
});

app.get("/klasy/tylko/zakonczone", (req, res) => {
    let categories = db.get("klasy").filter(klasa => klasa.zakonczona === true).value();
    return res.send(categories);
});

app.get("/klasy/sedziowie/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let judgeClasses = db.get("klasy").filter(klasa => klasa.komisja.includes(id)).value();
    return res.send(judgeClasses);
});

app.get("/klasy/arbitrator/:id", (req, res) => {
    let id = isNaN(parseInt(req.params.id)) || req.params.id.length > 15 ? req.params.id : parseInt(req.params.id);
    let arbitrator = db.get("klasy").find({ id: id }).value().arbitrator;
    return res.send(arbitrator);
});

app.get("/fetch", (req, res) => {
    request("http://localhost:3000/sedziowie", (error, response, body) => {
        let json = JSON.parse(body);
        console.log(error, response);
        console.log(json);
        db.set("sedziowie", json).write();
    });
    request("http://localhost:3000/konie", (error, response, body) => {
        let json = JSON.parse(body);
        console.log(error, response);
        console.log(json);
        db.set("konie", json).write();
    });
    request("http://localhost:3000/klasy", (error, response, body) => {
        let json = JSON.parse(body);
        json.forEach((klasa) => {
            klasa.arbitrator = {};
        });
        console.log(error, response);
        console.log(json);
        db.set("klasy", json).write();
        res.send("OK");
    });
});

/// //////////////// SOCKETS ///////////////////////////

const computeScores = (horse) => {
    let scoreSum = 0;
    let typeScore = 0;
    let moveScore = 0;
    horse.wynik.noty.forEach(score => {
        scoreSum += Object.values(score).reduce((a, b) => a + b);
        typeScore += score.typ;
        moveScore += score.ruch;
    });
    return [scoreSum, typeScore, moveScore];
};

const checkIfArbitratorNeeded = (horseToCheck, scores) => {
    let scoresToCompare = computeScores(horseToCheck);
    if (scores[0] === scoresToCompare[0] && scores[1] === scoresToCompare[1] && scores[2] === scoresToCompare[2]) {
        return true;
    } else {
        return false;
    }
};

io.sockets.on("connection", (socket) => {
    socket.on("activeCategories", () => {
        let categories = db.get("klasy").filter(klasa => klasa.zakonczona !== true).value();
        socket.emit("activeCategories", categories);
    });

    socket.on("horseRated", (data) => {
        let horse = data.horse.horse;
        let scores = [data.horse.scoreSum, data.horse.typeSum, data.horse.moveSum];
        horse.scores = scores;
        db.get("konie").updateById(horse.id, horse).write();
        let klasa = db.get("klasy").find({ id: horse.klasa }).value();
        let arbitrator = klasa.arbitrator;
        let hashId = md5(scores);
        if (arbitrator[hashId] === undefined) {
            let arbitraryHorses = db.get("konie").filter(h => h.klasa === horse.klasa && checkIfArbitratorNeeded(h, scores)).value();
            if (arbitraryHorses.length > 1) {
                arbitrator[hashId] = arbitraryHorses;
                klasa.arbitrator = arbitrator;
                db.get("klasy").updateById(klasa.id, klasa).write();
                socket.emit("arbitrator", { horses: arbitrator[hashId], id: hashId });
            }
        } else {
            let canAdd = true;
            arbitrator[hashId].forEach((h) => {
                if (h.id === horse.id) {
                    canAdd = false;
                }
            });
            if (canAdd) {
                arbitrator[hashId].push(horse);
                klasa.arbitrator = arbitrator;
                db.get("klasy").updateById(klasa.id, klasa).write();
                socket.emit("arbitrator", { horses: arbitrator[hashId], id: hashId });
            }
        }
        io.sockets.in(horse.klasa).emit("newHorseRated", horse);
    });

    socket.on("rozjemca", ({ horses, index }) => {
        horses.forEach((horse, i) => {
            horse.wynik.rozjemca = i + 1;
            db.get("konie").updateById(horse.id, horse).write();
        });
        io.sockets.in(horses[0].klasa).emit("rozjemcaKonie", horses);
        io.emit("rozjemcaDodany", index);
    });

    socket.on("makeCategoryInactive", (data) => {
        let finishedClass = db.get("klasy").updateById(data.id, { zakonczona: data.zakonczona }).write();
        io.emit("newFinishedClass", finishedClass);
    });

    socket.on("joinCategory", (data) => {
        let horses = db.get("konie").filter({ klasa: data.categoryId }).value();
        socket.join(data.categoryId);
        socket.emit("horsesInCategory", horses);
    });
});

server.listen(port, "172.17.0.1", () => {
    console.log(`Server HTTTP runs on port ${port}`);
});
