
const path = require("path");
const socket = require("../socketio/socket.js");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer)

app.use(
    cors({
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

//Import routes
const routes = require('../routes/routes.js');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('../public'));

app.get('/favicon.ico', (req, res) => {
    return res.status(204).end()
});

//Route middleware
app.use('/', routes);

io.on("connection", socket.socketHandler)

httpServer.listen(3000);