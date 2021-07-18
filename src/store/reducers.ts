import {combineReducers} from 'redux';
import app from './app/reducer';
import modal from './modal/reducer';
import auth from '../screens/Auth/redux/reducer';
import chat from '../screens/Chat/redux/reducer';
import comment from '../screens/Home/Comment/redux/reducer';
import audience from '../screens/CreatePost/SelectAudience/redux/reducer';
import post from '../screens/CreatePost/redux/reducer';
import groupsReducer from '~/screens/Groups/redux/reducer';

const rootReducers = combineReducers({
  app,
  modal,
  auth,
  chat,
  comment,
  audience,
  post,
  groups: groupsReducer,
});

export default rootReducers;
