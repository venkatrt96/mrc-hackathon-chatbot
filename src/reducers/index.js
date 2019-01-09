import { combineReducers } from 'redux';
import { chatReducer } from './chatReducer';
import { alertReducer } from './alertReducer';
import { accountReducer } from './accountReducer';
import { dialogflowReducer } from './dialogflowReducer';

const reducers = combineReducers({
  accountReducer,
  alertReducer,
  chatReducer,
  dialogflowReducer,
});

export default reducers;
