import express from "express";
import auth from "../utils/auth.js";
import { getLedgerBalance, getLedgerEntries, getLeaderboard } from "./ledger-controller.js"

const router = express.Router();

router.get("/balance", auth, getLedgerBalance);
router.get("/entries", auth, getLedgerEntries);
router.get("/leaderboard", auth, getLeaderboard);

export default router;
