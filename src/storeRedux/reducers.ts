import { combineReducers } from 'redux';

export const appReducer = combineReducers({});

const rootReducers = (
  state:any, action:{type:string, payload?:any},
) => appReducer(
  state, action,
);

export default rootReducers;
