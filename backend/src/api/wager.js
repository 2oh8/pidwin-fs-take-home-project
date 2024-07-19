import express from "express";
import auth from "../utils/auth.js";
import { placeWager } from "./placeWager.js"

const router = express.Router();

router.post("/", auth, placeWager);

export default router;
