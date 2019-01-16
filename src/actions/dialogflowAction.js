import axios from 'axios';
import isEqual from 'lodash/isEqual';
import { displayAlert } from 'actions/alertAction';
import { sendMessage } from 'actions/chatAction';
import { displayLastTransaction, displayPasswordReset } from 'actions/miscAction';

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

export const seekHelp = (payload) => {
  return {
    type: 'SEEK_AGENT',
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
      if (res.data.action) {
        if (isEqual(res.data.action, 'last.transaction.history')) {
          dispatch(displayLastTransaction(true));
        }
        if (isEqual(res.data.action, 'got.loan.number')) {
          dispatch(displayAlert('Making A Payment For The Given Loan Number', 'info'));
        }
        if (isEqual(res.data.action, 'reset.password.link')) {
          dispatch(displayPasswordReset(true));
        }
      }
      if (res.data.action && isEqual(res.data.action, 'service.agent.request')) {
        dispatch(seekHelp(true));
      }
    }).catch(() => {
      dispatch(displayAlert('Error Fetching Bot Response', 'error'));
    });
  };
};
