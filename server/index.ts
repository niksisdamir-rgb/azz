import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type User = {
  id: string;
  username: string;
}

type Message = {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'system';
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const users = new Map<string, User>();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (data: { username: string }) => {
      const user: User = { id: socket.id, username: data.username };
      users.set(socket.id, user);
      
      const joinMessage: Message = {
        id: nanoid(),
        username: "System",
        content: `${data.username} joined the chat`,
        timestamp: new Date(),
        type: 'system'
      };

      socket.broadcast.emit("user-joined", { user, message: joinMessage });
      socket.emit("message", joinMessage);
      io.emit("users-list", { users: Array.from(users.values()) });
    });

    socket.on("message", (data: { content: string, username: string }) => {
      const message: Message = {
        id: nanoid(),
        username: data.username,
        content: data.content,
        timestamp: new Date(),
        type: 'user'
      };
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);
      if (user) {
        const leaveMessage: Message = {
          id: nanoid(),
          username: "System",
          content: `${user.username} left the chat`,
          timestamp: new Date(),
          type: 'system'
        };
        users.delete(socket.id);
        io.emit("user-left", { user, message: leaveMessage });
        io.emit("users-list", { users: Array.from(users.values()) });
      }
      console.log("User disconnected:", socket.id);
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
