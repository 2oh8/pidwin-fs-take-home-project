import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import userRouter from "./src/api/user.js";
import ledgerRouter from "./src/api/ledger.js"
import wagerRouter from "./src/api/wager.js"
import giphyRouter from "./src/api/giphy-controller.js"

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/ledger", ledgerRouter);
app.use("/api/wager", wagerRouter);
app.use("/api/giphy", giphyRouter);

const PORT = process.env.PORT || 80;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
