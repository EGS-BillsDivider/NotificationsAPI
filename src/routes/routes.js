const router = require('express').Router();
var db = require('../db');
const socket = require("../socketio/socket.js");
const axios = require('axios');

const validationURL = "http://api:3000/verifyUser";

router.get('/test', async (req, res) => {
    return res.send('api is here');
})

//SEND NOTIFICATION
router.post('/notification', async (req, res) => {

    //Validate
    try {
        await axios.get(validationURL, {
            headers: {
                'auth-token': req.headers['token']
            }
        });
    }
    catch (e) {
        return res.status(401).json({ error: "Unauthorized, invalid authentication credentials" });
    }


    //Create notification uuid
    try {
        result = await db.getUUID()
    }
    catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }

    //Add notification to db
    data = JSON.stringify(result);
    uid = JSON.parse(data)[0]["UUID()"];

    //validação do channel_name ???
    try {
        channel = await db.getChannelByName(req.body.channel_name)
    }
    catch (e) {
        return res.status(404).json({ error: "Channel not found" });
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
        return res.status(500).json({ error: "Internal server error" });
    }

    socket.notifyChannel(notification);
    return res.status(201).json({ error: "Notification created with success" });
});

//CREATE CHANNEL
router.post('/channel', async (req, res) => {

    //Validate
    try {
        await axios.get(validationURL, {
            headers: {
                'auth-token': req.headers['token']
            }
        });
    }
    catch (e) {
        return res.status(401).json({ error: "Unauthorized, invalid authentication credentials" });
    }

    //Create channel uuid
    try {
        result = await db.getUUID()
    }
    catch (e) {
        return res.status(500).json({ error: "Internal server error, 1" });
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
        return res.status(500).json({ error: "Internal server error, 2" });
    }

    return res.status(201).json({ error: "Channel created with success" });
    //ver como retornar um uid
});

router.delete('/channel', async (req, res) => {

    //Validate
    try {
        await axios.get(validationURL, {
            headers: {
                'auth-token': req.headers['token']
            }
        });
    }
    catch (e) {
        return res.status(401).json({ error: "Unauthorized, invalid authentication credentials" });
    }

    //Delete channel

    try {
        await db.validateUUID(req.body.uuid);
    }
    catch (e) {
        return res.status(400).json({ error: "Invalid Id supplied" })
    }

    try {
        await db.deleteAssociationUserChannel(req.body.uuid);
        await db.deleteChannel(req.body.uuid);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal server error" })
    }
    return res.status(200).json({ error: "Channel deleted with success" });
});

router.put('/channel', async (req, res) => {

    //Validate
    try {
        await axios.get(validationURL, {
            headers: {
                'auth-token': req.headers['token']
            }
        });
    }
    catch (e) {
        return res.status(401).json({ error: "Unauthorized, invalid authentication credentials" });
    }

    //Get channel uuid
    try {
        result = await db.getChannelByName(req.body.name);
        data = JSON.stringify(result);
        uid = JSON.parse(data)[0]["uid"];
    }
    catch (e) {
        return res.status(400).json({ error: "Invalid channel name" })
    }


    try {
        await db.associateUserChannel(req.body.user, uid);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ error: "Channel updated with success" });
});

module.exports = router;