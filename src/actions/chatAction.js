import axios from 'axios';
import { displayAlert } from 'actions/alertAction';
import { socket } from 'utils';

export const fetchMessagesInit = (payload) => {
  return {
    type: 'FETCH_MESSAGES_INIT',
    payload,
  };
};

export const fetchMessagesFulfilled = (payload) => {
  return {
    type: 'FETCH_MESSAGES_FULFILLED',
    payload,
  };
};

export const errorMessagesFetching = (payload) => {
  return {
    type: 'ERROR_MESSAGES_FETCHING',
    payload,
  };
};

export const fetchMessages = (payload) => {
  return (dispatch) => {
    dispatch(fetchMessagesInit());
    axios.get(`/api/chat/message/${payload}`).then((res) => {
      socket.emit('message', res.data.messages);
      dispatch(fetchMessagesFulfilled(res.data));
    }).catch(() => {
      dispatch(errorMessagesFetching('Error Fetching Messages'));
      dispatch(displayAlert('Error Fetching Messages', 'error'));
    });
  };
};

export const fetchUsers = () => {
  return (dispatch) => {
    axios.get('/api/chat/users').then((res) => {
      console.log(res.data);
      socket.emit('updateUsers', res.data);
    }).catch(() => {
      dispatch(displayAlert('Error Fetching Users', 'error'));
    });
  };
};

export const joinChat = (payload) => {
  return (dispatch) => {
    axios.post('/api/chat/join', payload).then((res) => {
      socket.emit('updateUsers', res.data);
      // dispatch(displayAlert('Joining Chat', 'info'));
    }).catch(() => {
      dispatch(displayAlert('Error Joining Chat', 'error'));
    });
  };
};

export const leaveChat = (payload) => {
  return (dispatch) => {
    axios.post('/api/chat/leave', payload).then((res) => { // eslint-disable-line      
      socket.emit('updateUsers', `${payload && payload.username} left the chat`);
      // dispatch(displayAlert('Leaving Chat', 'info'));
    }).catch(() => {
      dispatch(displayAlert('Error Leaving Chat', 'error'));
    });
  };
};

export const sendMessage = (payload) => {
  return (dispatch) => {
    axios.post('/api/chat/message', payload).then((res) => {
      // socket.emit('message', res.data.messages);
      socket.emit('message', res.data.messages, payload.sender.id);
    }).catch(() => {
      dispatch(displayAlert('Error Sending Message', 'error'));
    });
  };
};
