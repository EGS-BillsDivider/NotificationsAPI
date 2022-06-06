var db = require('../db');

const userSockets = new Map();

const socketHandler = async (socket) => {

    if (socket.handshake.auth.token) {
        socket.uid = socket.handshake.auth.token;
    }

    socket.on('disconnect', () => {
        userSockets.delete(socket.uid);
        console.log('User disconnected: ' + socket.uid);
    });

    userSockets.set(socket.uid, socket);

    console.log('User connected: ' + socket.uid);

    notifications = await db.getNotificationQueue(socket.uid);

    if (notifications) {
        data = JSON.parse(JSON.stringify(notifications));
        for (i in data) {
            socket.emit("Notification", [data][i]["msg"])
        }
        await db.deleteNotificationQueue(socket.uid);
    }
}

const notifyChannel = async (notification) => {

    try {
        users = await db.getUsersOfChannel(notification["channel_uid"]);
        data = JSON.parse(JSON.stringify(users));
    }
    catch (e) {
        console.log(e)
    }

    for (i in data) {
        socket = userSockets.get(data[i]["user_uid"]);
        if (socket) {
            socket.emit("Notification", notification["msg"])
        } else {
            db.addToNotificationQueue(data[i]["user_uid"], notification["msg"])
        }
    }
}

module.exports.socketHandler = socketHandler;
module.exports.notifyChannel = notifyChannel; 