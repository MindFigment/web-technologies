/*jshint node: true, esversion: 6 */
const connect = require('connect');
const app = connect();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000;
const serverStatic = require('serve-static');
const io = require('socket.io')(http);

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({history: [], rooms: []})
    .write();

app.use(serverStatic('public'));

let history;
io.on('connect', (socket) => {

    let rooms = db.get('rooms').value();

    socket.emit('allRooms', rooms);

    socket.on('setUserNickname', (nickname) => {
        history = db.get('history').takeRight(5).value();
        socket.emit('userNicknameSet', { nickname: nickname });
        socket.emit('last5Messages', history);
    });

    socket.on('msg', (data) => {
        db.get('history').push(data).write();
        io.sockets.in(data.room).emit('newmsg', data);
    });

    socket.on('new-room', (room) => {
        db.get('rooms').push(room).write();
        io.sockets.emit('new-room', room);
    });

    socket.on('join-room', (room) => {
        history = db.get('history').filter({room: room}).takeRight(5).value();
        socket.join(room);
        socket.emit('last5Messages', history);
    });

});

http.listen(port, () => {
    console.log(`Serwer HTTP działa na porcie ${port}`);
});



