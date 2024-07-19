import { calculateUserLedgerBalance } from "../utils/ledgerUtils.js"
import coinToss from "../utils/coinToss.js";
import { addLedgerEntriesForOutcome } from "../utils/ledgerUtils.js";

export const placeWager = async (req, res) => {
    try {
        const { userId, body } = req
        const { wagerAmount, selectedOutcome } = body

        if (!userId) {
            return res.json({ message: "Unauthenticated" });
        }

        const balance = await calculateUserLedgerBalance(userId)
        const isValidWager = balance > 0 && balance >= wagerAmount

        if (isValidWager) {
            const { outcome, userWonCoinToss } = coinToss(selectedOutcome)
            await addLedgerEntriesForOutcome(userId, wagerAmount, userWonCoinToss)
            res.status(200).json({ outcome, userWonCoinToss });
        } else {
            throw new Error("Wagered amount exceeds account balance")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
};