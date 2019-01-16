export const displayLastTransaction = (payload) => {
  return {
    type: 'DISPLAY_LAST_TRANSACTION',
    payload,
  };
};

export const displayPasswordReset = (payload) => {
  return {
    type: 'DISPLAY_PASSWORD_RESET',
    payload,
  };
};
