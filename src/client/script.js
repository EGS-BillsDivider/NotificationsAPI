const { io } = require("socket.io-client");

const api = "http://localhost:3000";

let socket = null;

const registerCallback = (event, callback) => {
    socket.on(event, callback);
}

const createSocket = uid => {
    if (socket) {
        socket.close()
    }

    socket = io(api, {
        auth: {
            token: uid
        }
    })
    console.log(uid)
}

createSocket("1")

module.exports = registerCallback;
module.exports = createSocket;