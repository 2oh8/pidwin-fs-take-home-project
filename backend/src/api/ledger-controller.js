import { calculateUserLedgerBalance } from "../utils/ledgerUtils.js"
import LedgerEntry from "../models/ledgerEntry.js";
import User from "../models/user.js";

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

    res.status(200).json({ entries: ledgerEntries });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLeaderboard = async (req, res) => {
  const ENTRY_RETURN_LIMIT = 10
  const { userId } = req
  try {
    if (!userId) {
      return res.json({ message: "Unauthenticated" });
    }

    const leaderBoard = await LedgerEntry.aggregate([
      {
        $group: {
          _id: "$userId",
          ledgerBalance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "credit"] },
                "$amount",
                { $multiply: ["$amount", -1] }
              ]
            }
          }
        }
      },
      {
        $addFields: {
          userIdAsObjectId: { $toObjectId: "$_id" } // Convert userId to ObjectId if necessary
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdAsObjectId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userName: "$user.name",
          ledgerBalance: 1
        }
      },
      { $sort: { ledgerBalance: -1 } },
      { $limit: ENTRY_RETURN_LIMIT }
    ]);

    console.log(leaderBoard)

    res.status(200).json({ leaderBoard: leaderBoard });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
};