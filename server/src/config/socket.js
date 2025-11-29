let io;
const onlineUsers = new Map();

function initSocket(server) {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId;
        });

        socket.on("disconnect", () => {
            if (socket.userId) onlineUsers.delete(socket.userId);
        });
    });
}

function emitMessage(receiverId, message) {
    const socketId = onlineUsers.get(receiverId);
    if (socketId) io.to(socketId).emit("new_message", message);
}

module.exports = { initSocket, emitMessage };
