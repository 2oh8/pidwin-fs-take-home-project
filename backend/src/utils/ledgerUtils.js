import LedgerEntry from "../models/ledgerEntry.js";
import ledgerEntryTypes from "../enums/ledgerEntryTypes.js";
import reasons from "./transactionReasons.js";

export const calculateUserLedgerBalance = async (userId) => {
    try {
        const ledgerEntries = await LedgerEntry.find({ userId });

        let balance = 0;

        ledgerEntries.forEach(entry => {
            if (entry.type === 'credit') {
                balance += entry.amount;
            } else if (entry.type === 'debit') {
                balance -= entry.amount;
            }
        });

        return balance;
    } catch (error) {
        console.error("Error calculating user balance:", error);
        throw error;
    }
};

export const getUserWinningStreak = async (userId) => {
    try {
        const ledgerEntries = await LedgerEntry.find({ userId }).sort('-createdAt');

        let currentStreak = 0;
        let winCountSinceLastReset = 0;

        for (const entry of ledgerEntries) {
            if (entry.type === ledgerEntryTypes.credit && entry.reason === reasons.WON_WAGER) {
                winCountSinceLastReset++;

                // Reset win count if it's the 5th win
                if (winCountSinceLastReset % 5 === 0) {
                    winCountSinceLastReset = 0;
                }

                currentStreak = winCountSinceLastReset;
            } else {
                // No-op
                break;
            }
        }

        return currentStreak;
    } catch (error) {
        console.error("Error getting user winning streak:", error);
        throw error;
    }
};

export const addLedgerEntriesForOutcome = async (userId, amountWagered, userWonCoinToss) => {
    try {
        let currentWinningStreak = await getUserWinningStreak(userId);

        let payoutMultiplier = 1;

        if (userWonCoinToss) {
            currentWinningStreak += 1
            if (currentWinningStreak === 6) {
                currentWinningStreak = 1
            }
            console.log("New winning streak: " + currentWinningStreak)
            if (currentWinningStreak === 3) {
                payoutMultiplier = 3;
            } else if (currentWinningStreak === 5) {
                payoutMultiplier = 10;
            }

            await LedgerEntry.create({
                userId,
                type: ledgerEntryTypes.credit,
                amount: amountWagered * payoutMultiplier,
                description: `Winning wager with ${currentWinningStreak} win${currentWinningStreak > 1 ? 's' : ''} in a row`,
                multiplier: payoutMultiplier,
                reason: reasons.WON_WAGER
            });
        } else {
            await LedgerEntry.create({
                userId,
                type: ledgerEntryTypes.debit,
                amount: amountWagered,
                description: 'Losing wager',
                reason: reasons.LOST_WAGER
            });
        }
    } catch (error) {
        console.error("Error adding ledger entries for outcome:", error);
        throw error;
    }
};