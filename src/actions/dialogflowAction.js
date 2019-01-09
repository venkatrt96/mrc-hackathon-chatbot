import axios from 'axios';
// import isEqual from 'lodash/isEqual';
import { displayAlert } from 'actions/alertAction';
import { sendMessage } from 'actions/chatAction';

export const fetchBotResponseInit = () => {
  return {
    type: 'FETCH_BOT_RESPONSE_INIT',
  };
};

export const fetchBotResponseFulfilled = (payload) => {
  return {
    type: 'FETCH_BOT_RESPONSE_FULFILLED',
    payload,
  };
};

export const fetchBotResponse = (payload) => {
  return (dispatch) => {
    dispatch(fetchBotResponseInit());
    axios.post('/api/dialogflow', payload).then((res) => {
      dispatch(fetchBotResponseFulfilled(res.data));
      dispatch(sendMessage({
        sender: {
          id: payload.sessionID,
          username: 'BOT',
        },
        message: res.data.content,
        // isEqual(res.data.type, 'text') ? res.data.content : JSON.stringify(res.data.content),
      }));
    }).catch(() => {
      dispatch(displayAlert('Error Fetching Bot Response', 'error'));
    });
  };
};
