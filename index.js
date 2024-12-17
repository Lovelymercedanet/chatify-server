const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route.js");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users.js");

const app = express();
app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    // Пользователь присоединяется к комнате
    socket.on("join", ({ name, room }) => {
        socket.join(room);

        const { user, isExist } = addUser({ name, room });

        const userMessage = isExist
            ? `${user.name}, here you go again`
            : `Hey my love ${user.name}`;

        // Отправляем сообщение текущему пользователю
        socket.emit("message", {
            data: { user: { name: "Admin" }, message: userMessage },
        });

        // Сообщение остальным в комнате
        socket.broadcast.to(user.room).emit("message", {
            data: { user: { name: "Admin" }, message: `${user.name} has joined` },
        });

        // Обновляем список пользователей в комнате
        io.to(user.room).emit("joinRoom", {
            data: { users: getRoomUsers(user.room) },
        });
    });

    // Пользователь отправляет сообщение
    socket.on("sendMessage", ({ message, params }) => {
        const user = findUser(params);

        if (user) {
            io.to(user.room).emit("message", {
                data: { user, message },
            });
        }
    });

    // Пользователь покидает комнату
    socket.on("leftRoom", ({ params }) => {
        const user = findUser(params);

        if (user) {
            io.to(user.room).emit("message", {
                data: { user: { name: "Admin" }, message: `${user.name} has left the room` },
            });

            removeUser(params);
        }
    });

    // Пользователь отключился
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


server.listen(5000, () => {
    console.log("Server is running");
})