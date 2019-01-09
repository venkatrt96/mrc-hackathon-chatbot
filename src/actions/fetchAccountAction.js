import axios from 'axios';

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
      },
    );
  };
};
