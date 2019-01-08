const defaultState = {
  messages: [],
  messagesLoading: false,
  messagesLoaded: false,
  messagesError: '',
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

    default:
      return state;
  }
};
