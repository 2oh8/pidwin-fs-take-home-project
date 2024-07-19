import { LEDGER_BALANCE, LEDGER_ENTRIES } from '../constants/actionTypes';

const ledgerReducer = (state = { balance: 0, entries: [] }, action) => {
    let newState;
    switch (action.type) {
        case LEDGER_BALANCE:
            newState = { ...state, balance: action?.data };
            break;
        case LEDGER_ENTRIES:
            newState = { ...state, entries: action?.data.entries };
            break;
        default:
            return state;
    }
    // Update localStorage once with the consolidated new state
    localStorage.setItem('ledger', JSON.stringify(newState));
    return newState;
}

export default ledgerReducer;