export const displayAlert = (message, type) => {
  const payload = {
    message,
    type,
  };
  return {
    type: 'DISPLAY_ALERT',
    payload,
  };
};

export const closeAlert = () => {
  return {
    type: 'CLOSE_ALERT',
  };
};
