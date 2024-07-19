import { calculateUserLedgerBalance } from "../utils/ledgerUtils.js"
import LedgerEntry from "../models/ledgerEntry.js";

export const getLedgerBalance = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    const balance = await calculateUserLedgerBalance(req.userId)

    res.status(200).json(balance);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLedgerEntries = async (req, res) => {
  const ENTRY_RETURN_LIMIT = 10
  const { userId } = req
  try {
    if (!userId) {
      return res.json({ message: "Unauthenticated" });
    }

    const ledgerEntries = await LedgerEntry.find({ userId }).sort('-createdAt').limit(ENTRY_RETURN_LIMIT);

    res.status(200).json({entries: ledgerEntries});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
};