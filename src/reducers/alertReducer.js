const defaultState = {
  open: false,
  alerts: [],
};

export const alertReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'DISPLAY_ALERT': {
      const alerts = Object.assign([], state.alerts);
      alerts.push(action.payload);
      return Object.assign({}, state, {
        alerts,
        open: true,
      });
    }

    case 'CLOSE_ALERT': {
      return Object.assign({}, state, {
        alerts: [],
        open: false,
      });
    }

    default:
      return state;
  }
};
