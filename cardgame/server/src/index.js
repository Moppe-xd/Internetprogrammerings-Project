import express from "express";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import { createServer } from "http";
import logger from "./middlewares/logger.js";
import login from "./controllers/login.controller.js";
import register from "./controllers/register.controller.js";
import account from "./controllers/account.controller.js";
import game from "./controllers/game.controller.js";
import model from "./model.js";

const port = 8989;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(logger);
app.use(express.json());

// Configure session management
const sessionConf = expressSession({
    secret: "Super secret! Shh! Do not tell anyone...",
    resave: true,
    saveUninitialized: true,
  });
app.use(sessionConf);
io.use(
    socketIOSession(sessionConf, {
      autoSave: true,
      saveUninitialized: true,
    })
);

app.get('/', (req,res) =>{
    res.send("Hello World");
});

app.use("/api", login.router);
app.use("/api", register.router);
app.use("/api", account.router);
app.use("/api", game.router);

// Ser över det ifall det kan tas bort.
model.init(io);
model.createRoom("test");
model.createRoom("Lobby 2");
model.createRoom("Lobby 3");
model.createRoom("Lobby 4");

// Handle socket.io connections
io.on("connection", (socket) => {
  const { session } = socket.handshake;
  session.socketID = socket.id;
  session.save((err) => {
    if (err) console.error(err);
    else console.debug(`Saved socketID: ${session.socketID}`);
  });
});


server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});