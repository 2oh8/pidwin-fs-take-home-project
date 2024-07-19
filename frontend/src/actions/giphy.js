import { GIPHY_COINTOSS } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

export const getCoinTossGiphy = () => async (dispatch) => {
    try {
        const { data } = await api.getGiphyCointoss();
        dispatch({ type: GIPHY_COINTOSS, data });
    } catch (error) {
        console.log(error)
        messages.error(error.response.data.message);
    }
};