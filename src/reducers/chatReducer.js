const defaultState = {
  messages: [],
  messagesLoading: false,
  messagesLoaded: false,
  messagesError: '',
  users: [],
};

export const chatReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_MESSAGES_INIT':
      return Object.assign({}, state, {
        messagesLoading: true,
        messagesLoaded: false,
        messages: [],
        messagesError: '',
      });

    case 'FETCH_MESSAGES_FULFILLED':
      return Object.assign({}, state, {
        messagesLoading: false,
        messagesLoaded: true,
        messages: action.payload.messages,
        messagesError: '',
      });

    case 'ERROR_MESSAGES_FETCHING':
      return Object.assign({}, state, {
        messagesLoading: false,
        messagesLoaded: true,
        messages: [],
        messagesError: action.payload,
      });

    case 'FETCH_USERS_FULFILLED':
      return Object.assign({}, state, {
        users: action.payload.users,
      });

    default:
      return state;
  }
};
