import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import {
  authRoutes,
  usersRoutes,
  swapRoutes,
  scheduleRoutes,
} from "./routes/index.js";
import BreakGenerationScheduler from "./services/breakGenerationScheduler.js";
import "./config/passportConfig.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const allowedOrigins = [
  "http://localhost:3001",
  "https://timepawa.vercel.app",
  "https://timepawa.onrender.com",
];

dotenv.config();

// Initialize break generation scheduler
BreakGenerationScheduler.scheduleBreakGeneration();

// Connect to the database
dbConnect();

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // If no origin (like from Postman), allow the request
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies, authentication tokens, etc.
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/auth", authRoutes);
app.use("/api", usersRoutes);
app.use("/api", swapRoutes);
app.use("/api", scheduleRoutes);

// Handle socket.io
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, sessions)
  },
});

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // emit an event to the client
  socket.emit("Notification received", { message: "Hello from the server" });
  // Example: Listening for a custom event
  socket.on("swap-notification", (data) => {
    socket.broadcast.emit("receive-swap-notification", data);
    console.log("Notification received:", data);
  });

  // listening on the new break requests
  socket.on("new-break-request", (data) => {
    socket.broadcast.emit("receive-new-break-request", data);
    console.log("New break request received:", data);
  });

  // Cleanup when a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Listen to the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
