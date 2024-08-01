import { LEDGER_BALANCE, LEDGER_ENTRIES, LEADERBOARD } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

export const getLedgerBalance = () => async (dispatch) => {
    try {
        const { data } = await api.getLedgerBalance();
        dispatch({ type: LEDGER_BALANCE, data });
    } catch (error) {
        console.log(error)
        messages.error(error.response.data.message);
    }
};

export const getLedgerEntries = () => async (dispatch) => {
    try {
        const { data } = await api.getLedgerEntries();
        dispatch({ type: LEDGER_ENTRIES, data });
    } catch (error) {
        console.log(error)
        messages.error(error.response.data.message);
    }
};

export const getLeaderboard = () => async (dispatch) => {
    try {
        const { data } = await api.getLeaderboard();
        dispatch({ type: LEADERBOARD, data });
    } catch (error) {
        console.log(error)
        messages.error(error.response.data.message);
    }
};