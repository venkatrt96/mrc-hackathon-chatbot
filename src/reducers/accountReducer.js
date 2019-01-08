const defaultState = {
  name: '',
  email: '',
  groupName: '',
};

export const accountReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_ACCOUNT_FULFILLED': {
      return Object.assign({}, state, {
        name: action.payload.name,
        email: action.payload.email,
        groupName: action.payload.groupName,
      });
    }

    default:
      return state;
  }
};
