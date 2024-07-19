import { GIPHY_COINTOSS } from '../constants/actionTypes';

const giphyReducer = (state = { coinToss: [] }, action) => {
    switch (action.type) {
        case GIPHY_COINTOSS:
            const giphyOut = action?.data?.data?.data
            const randomIndex = Math.floor(Math.random() * giphyOut?.length || 0) || 0
            return { ...state, coinToss: giphyOut?.[randomIndex] };
        default:
            return state;
    }
}
export default giphyReducer;