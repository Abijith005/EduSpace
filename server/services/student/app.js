import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = process.env.PORT;

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

// app.all("/api/v1//hello", );

app.listen(port, () => {
  console.log(`student service running in port ${port}`);
});
