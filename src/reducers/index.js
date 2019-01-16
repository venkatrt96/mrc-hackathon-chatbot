import { combineReducers } from 'redux';
import { chatReducer } from './chatReducer';
import { alertReducer } from './alertReducer';
import { accountReducer } from './accountReducer';
import { dialogflowReducer } from './dialogflowReducer';
import { miscReducer } from './miscReducer';

const reducers = combineReducers({
  accountReducer,
  alertReducer,
  chatReducer,
  dialogflowReducer,
  miscReducer,
});

export default reducers;
