import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Session from "./src/model/session.model.js";
import ChatMessage from "./src/model/chat.model.js";

connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", async ({ sessionId, userId }) => {
    if (!sessionId || !userId) {
      return;
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return;
    }

    if (!session.users.some((user) => user.toString() === userId)) {
      return;
    }

    socket.join(`session_${sessionId}`);
    console.log(`Socket ${socket.id} joined session_${sessionId}`);
  });

  socket.on("sendMessage", async ({ sessionId, senderId, content }) => {
    if (!sessionId || !senderId || !content || !content.trim()) {
      return;
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return;
    }

    if (!session.users.some((user) => user.toString() === senderId)) {
      return;
    }

    const message = await ChatMessage.create({
      session: sessionId,
      sender: senderId,
      content: content.trim(),
    });

    const populatedMessage = await message.populate(
      "sender",
      "name avatar email",
    );
    io.to(`session_${sessionId}`).emit("newMessage", populatedMessage);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("The server is running on http://localhost:3000");
});
