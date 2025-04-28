import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 8040;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
