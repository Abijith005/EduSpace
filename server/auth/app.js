import express from "express";
import helmet from "helmet";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import socialAuthRoutes from "./routes/socialAuth.js"
import sequelize from "./config/sequelize.js";
import cronJob from "./helpers/cronJob.js";

const app = express();
const port = process.env.PORT;
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err);
  });
cronJob();

app.use("/api/v1/auth/user", userAuthRoutes);
app.use("/api/v1/auth/socialAuth",socialAuthRoutes)
app.use("/api/v1/auth/token", tokenRoutes);
app.listen(port, () => {
  console.log(`auth service running in port ${port}`);
});
