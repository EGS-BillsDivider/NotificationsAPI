var mysql = require('mysql');
var mysqlConfig = require('../config.js');
var connection = mysql.createConnection(mysqlConfig);

var getUUID = async function () {
    return new Promise((resolve, reject) => {
        connection.query('SELECT UUID()', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

var validateUUID = async function (uuid) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT IS_UUID("' + uuid + '")', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

var createChannel = async function (channel) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO CHANNEL (`uid`, `name`) VALUES ("' + channel["uid"] + '","' + channel["name"] + '")', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}

var deleteAssociationUserChannel = async function (channel_uid) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM USER_CHANNEL WHERE channel_uid="' + channel_uid + '"', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}

var deleteChannel = async function (channel_uid) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM CHANNEL WHERE uid="' + channel_uid + '"', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}

var associateUserChannel = async function (user_uid, channel_uid) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO USER_CHANNEL (`user_uid`, `channel_uid`) VALUES ("' + user_uid + '","' + channel_uid + '")', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}

var createNotification = async function (notification) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO NOTIFICATION (`uid`, `msg`, `channel_uid`) VALUES ("' + notification["uid"] + '","' + notification["msg"] + '","' + notification["channel_uid"] + '")', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
}

var getUsersOfChannel = async function (channel_uid) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT user_uid FROM USER_CHANNEL WHERE channel_uid = "' + channel_uid + '"', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    })
}

var addToNotificationQueue = async function (user_uid, message) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO NOTIFICATION_QUEUE (`user_uid`, `msg`) VALUES ("' + user_uid + '","' + message + '")', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    })
}

var getNotificationQueue = async function (user_uid) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT msg FROM NOTIFICATION_QUEUE WHERE user_uid= "' + user_uid + '"', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    })
}

var deleteNotificationQueue = async function (user_uid) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM NOTIFICATION_QUEUE WHERE user_uid= "' + user_uid + '"', (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    })
}

var getChannelByName = async function (channel_name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT uid FROM CHANNEL WHERE name="' + channel_name + '"', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

module.exports.getUUID = getUUID;
module.exports.validateUUID = validateUUID;
module.exports.createChannel = createChannel;
module.exports.associateUserChannel = associateUserChannel;
module.exports.deleteAssociationUserChannel = deleteAssociationUserChannel;
module.exports.deleteChannel = deleteChannel;
module.exports.createNotification = createNotification;
module.exports.getUsersOfChannel = getUsersOfChannel;
module.exports.addToNotificationQueue = addToNotificationQueue;
module.exports.getNotificationQueue = getNotificationQueue;
module.exports.deleteNotificationQueue = deleteNotificationQueue;
module.exports.getChannelByName = getChannelByName;