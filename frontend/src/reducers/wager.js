import { WAGER } from '../constants/actionTypes';

const wagerReducer = (state = { wager: null }, action) => {
    switch (action.type) {
        case WAGER:
            localStorage.setItem('wager', JSON.stringify({ ...action?.data }));
            return { ...state, wager: action?.data };
        default:
            return state;
    }
}
export default wagerReducer;