import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import groupsReducer from '~/storeRedux/groups/reducer';
import postReducer from '~/storeRedux/post/reducer';

import modal from './modal/reducer';

const postPersistConfig = {
  key: 'post',
  storage: AsyncStorage,
  whitelist: [],
};

export const appReducer = combineReducers({
  modal,
  post: persistReducer(
    postPersistConfig, postReducer,
  ),
  groups: groupsReducer,
});

const rootReducers = (
  state:any, action:{type:string, payload?:any},
) => appReducer(
  state, action,
);

export default rootReducers;
