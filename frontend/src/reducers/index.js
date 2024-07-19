import { combineReducers } from "redux";
import login from "./login";
import ledger from "./ledger";
import wager from "./wager";
import giphy from "./giphy"

export default combineReducers({
    login,
    ledger,
    wager,
    giphy
});
