const defaultState = {
  unreadTexts: 1,
  dialogflowResponse: {},
  help: false,
};

export const dialogflowReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_BOT_RESPONSE_INIT':
      return Object.assign({}, state, {
        dialogflowResponse: {},
      });

    case 'FETCH_BOT_RESPONSE_FULFILLED':
      return Object.assign({}, state, {
        dialogflowResponse: action.payload,
      });

    case 'SEEK_AGENT':
      return Object.assign({}, state, {
        help: action.payload,
      });

    default:
      return state;
  }
};
