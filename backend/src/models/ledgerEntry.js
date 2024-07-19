import mongoose from "mongoose";
import ledgerEntryTypes from "../enums/ledgerEntryTypes.js";

const ledgerEntrySchema = mongoose.Schema({
    type: {
        type: String,
        enum: ledgerEntryTypes.enumValue
    },
    amount: { type: Number, required: true },
    userId: { type: String },
    id: { type: String },
    description: { type: String },
    multiplier: {type: Number, default: 0},
    createdAt: { type: Number, required: true, default: Date.now},
    reason: { type: String, required: true,}
});

export default mongoose.model("LedgerEntry", ledgerEntrySchema);