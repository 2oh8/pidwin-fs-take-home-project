import express from "express";
import auth from "../utils/auth.js";
import { getLedgerBalance, getLedgerEntries } from "./ledger-controller.js"

const router = express.Router();

router.get("/balance", auth, getLedgerBalance);
router.get("/entries", auth, getLedgerEntries);

export default router;
