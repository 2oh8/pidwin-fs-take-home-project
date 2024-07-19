import { WAGER } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

export const wager = (formData, history) => async (dispatch) => {
    try {
      const { data } = await api.wager(formData);
      dispatch({ type: WAGER, data });
    } catch (error) {
      messages.error(error.response.data.message);
    }
  };