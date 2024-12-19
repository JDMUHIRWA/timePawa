import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import { authRoutes, usersRoutes } from "./routes/index.js";
import BreakGenerationScheduler from "./services/breakGenerationScheduler.js"
import "./config/passportConfig.js";

dotenv.config();

// Initialize break generation scheduler
BreakGenerationScheduler.scheduleBreakGeneration();

// Connect to the database
dbConnect();

const app = express();

//middlewares
const corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
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
// Listen to the server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
