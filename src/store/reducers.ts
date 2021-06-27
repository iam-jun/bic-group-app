import {combineReducers} from 'redux';
import app from './app/reducer';
import common from './common/reducer';
import language from './language/reducer';
import auth from './auth/reducer';
import chat from './chat/reducer';
import comment from './comment/reducer';

/**
 * Root reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const rootReducers = combineReducers({
  app,
  common,
  language,
  auth,
  chat,
  comment,
});

export default rootReducers;
