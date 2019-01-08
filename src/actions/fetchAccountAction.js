import axios from 'axios';
import { fetchMessages } from './chatAction';

export const fetchAccountFulfilled = (payload) => {
  return {
    type: 'FETCH_ACCOUNT_FULFILLED',
    payload,
  };
};

export const fetchAccount = () => {
  return (dispatch) => {
    axios.get('/api/users/me').then(
      (response) => {
        const userDetails = response.data;
        dispatch(fetchAccountFulfilled(userDetails));
        if (userDetails && userDetails.email) {
          dispatch(fetchMessages(userDetails.email));
        }
      },
    );
  };
};
