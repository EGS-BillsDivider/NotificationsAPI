const router = require('express').Router();
var db = require('../db');
const socket = require("../socketio/socket.js");


//SEND NOTIFICATION
router.post('/notification', async (req, res) => {

    //Validate
    //cena do nogs

    //Create notification uuid
    try {
        result = await db.getUUID()
    }
    catch (e) {
        res.send(e);
    }

    //Add notification to db
    data = JSON.stringify(result);
    uid = JSON.parse(data)[0]["UUID()"];

    try {
        channel = await db.getChannelByName(req.body.channel_name)
    }
    catch (e) {
        res.send(e);
    }

    data2 = JSON.stringify(channel)
    channel_uid = JSON.parse(data2)[0]["uid"];

    notification = {
        "uid": uid,
        "msg": req.body.msg,
        "channel_uid": channel_uid
    };

    try {
        await db.createNotification(notification);
    }
    catch (e) {
        res.send(e);
    }

    socket.notifyChannel(notification);
    res.sendStatus(200);
});

//CREATE CHANNEL
router.post('/channel', async (req, res) => {

    //Validate
    //cenas do nogs

    //Create channel uuid
    try {
        result = await db.getUUID()
    }
    catch (e) {
        res.send(e);
    }

    //Add channel to db
    data = JSON.stringify(result);
    uid = JSON.parse(data)[0]["UUID()"];
    channel = {
        "uid": uid,
        "name": req.body.name
    };

    try {
        await db.createChannel(channel);
        await db.associateUserChannel(req.body.user, channel["uid"]);
    }
    catch (e) {
        res.send(e);
    }

    res.sendStatus(200);
    //ver como retornar um uid
});

router.delete('/channel', async (req, res) => {

    //Validate
    //cenas do nogs

    //Delete channel

    try {
        await db.validateUUID(req.body.uuid);
        await db.deleteAssociationUserChannel(req.body.uuid);
        await db.deleteChannel(req.body.uuid);
    }
    catch (e) {
        res.send(e);
    }

    res.sendStatus(200);
});

router.put('/channel', async (req, res) => {

    //Validate
    //cenas do nogs

    //Get channel uuid
    result = await db.getChannelByName(req.body.name);
    data = JSON.stringify(result);
    uid = JSON.parse(data)[0]["uid"];

    try {
        await db.associateUserChannel(req.body.user, uid);
    }
    catch (e) {
        res.send(e);
    }

    res.sendStatus(200);
});

module.exports = router;