/*jshint browser: true, esversion: 6, globalstrict: true, devel: true */
'use strict';


document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        let nicknameBtn = document.querySelector('#nicknameBtn');
        let nicknameInp = document.querySelector('#nicknameInp');
        let messageInp = document.querySelector('#messageInp');
        let messageBtn = document.querySelector('#messageBtn');
        let newRoomInp = document.querySelector('#newRoomInp');
        let newRoomBtn = document.querySelector('#newRoomBtn');
        let appDiv = document.querySelector('#app');
        let loginDiv = document.querySelector('#loginDiv');
        let listOfRooms = document.querySelector('#list-of-rooms');
        let listOfMessages = document.querySelector('#list-of-messages');
        let currentChat = document.querySelector('#current-chat');
        let yourNickname = document.querySelector('#your-nickname');
        let socket = io();
        let nickname;
        let chat;

        nickname = sessionStorage.getItem('nickname');
        
        if (nickname !== null) {
            loginDiv.setAttribute('style', 'display: none;');
            appDiv.setAttribute('style', 'display: flex;');
            yourNickname.setAttribute('style', 'display: flex;');
            yourNickname.innerHTML = `<b>Nickname: </b> ${nickname}`;
        }

        // EVENT LISTENERS
        
        messageBtn.addEventListener('click', () => {
            sendMessage();
        });

        newRoomBtn.addEventListener('click', () => {
            makeNewRoom();
        });  
        
        nicknameBtn.addEventListener('click', () => {
            nickname = nicknameInp.value;
            if (nickname) {
                sessionStorage.setItem('nickname', nickname);
                loginDiv.setAttribute('style', 'display: none;');
                appDiv.setAttribute('style', 'display: flex;');
                yourNickname.setAttribute('style', 'display: flex;');
                nicknameInp.value = '';
                yourNickname.innerHTML = `<b>Nickname: </b> ${nickname} `;
            }
        });

        newRoomBtn.addEventListener('click',() => {
            let newRoom = newRoomInp.value;
            if (newRoom) {
                socket.emit('new-room', newRoom);
            }
        });


        // SOCKET CHANNELS

        socket.on('new-room', (room) => {
            let newRoom = newElem('button', {textContent: room});
            newRoom.addEventListener('click', joinRoomListener(newRoom));
            listOfRooms.appendChild(newRoom);
        });

        socket.on('allRooms', (rooms) => {
            rooms.forEach( (room) => {
                let newRoom = newElem('button', {textContent: room});
                newRoom.addEventListener('click', joinRoomListener(newRoom));
                listOfRooms.appendChild(newRoom);
            });
        });

        socket.on('last5Messages', (history) => {
            listOfMessages.innerHTML = '';
            history.forEach( (msg) => {
                let newMessage = newElem('div', {innerHTML: `<b>${msg.nickname}</b>: ${msg.message}`});
                listOfMessages.appendChild(newMessage);
            });
        });

        socket.on('newmsg', (msg) => {
            let newMessage = newElem('div', {innerHTML: `<b>${msg.nickname}</b>: ${msg.message}`});
            listOfMessages.appendChild(newMessage);
        });


        // FUNCTIONS

        const sendMessage = () => {
            let msg = messageInp.value;
            if (msg) {
                socket.emit('msg', { message: msg, nickname: nickname, room: chat });
                messageInp.value = '';
            }
        };

        const makeNewRoom = () => {
            let room = newRoomInp.value;
            if (room) {
                socket.emit('new-room', room);
                newRoomInp.value = '';
            }
        };

        const joinRoomListener = (room) => {
            return () => {
                chat = room.innerHTML;
                currentChat.innerHTML = `<b>Chat:</b> ${chat}`;
                messageBtn.setAttribute('style', 'visibility: visible;');
                messageInp.setAttribute('style', 'visibility: visible;');
                socket.emit('join-room', room.innerHTML);
            };
        };

    }
}


const newElem = (typ, attrs) => {
    let el = document.createElement(typ);
    Object.assign(el, attrs);
    return el;
};
