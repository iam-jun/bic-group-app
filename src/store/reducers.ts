import {combineReducers} from 'redux';
import app from './app/reducer';
import modal from './modal/reducer';
import auth from '../screens/Auth/redux/reducer';
import chat from '../screens/Chat/chat/reducer';
import comment from '../screens/Comment/redux/reducer';

const rootReducers = combineReducers({
  app,
  modal,
  auth,
  chat,
  comment,
});

export default rootReducers;
