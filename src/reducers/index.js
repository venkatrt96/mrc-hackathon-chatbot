import { combineReducers } from 'redux';
import { chatReducer } from './chatReducer';
import { alertReducer } from './alertReducer';
import { accountReducer } from './accountReducer';

const reducers = combineReducers({
  accountReducer,
  alertReducer,
  chatReducer,
});

export default reducers;
