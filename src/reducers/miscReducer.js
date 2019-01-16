const defaultState = {
  lastTransactionView: false,
  passwordResetView: false,
};

export const miscReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'DISPLAY_LAST_TRANSACTION':
      return Object.assign({}, state, {
        lastTransactionView: action.payload,
      });

    case 'DISPLAY_PASSWORD_RESET':
      return Object.assign({}, state, {
        passwordResetView: action.payload,
      });

    default:
      return state;
  }
};
