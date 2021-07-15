interface ReduxAction {
  type: string;
  payload: object;
}

const createAction = (type: string, payload: object = {}): ReduxAction => {
  return {
    type: `${type}`,
    payload,
  };
};

const ActionTypes = {
  LOG_OUT: 'auth/SIGN_OUT',
  REFRESH_TOKEN: 'auth/REFRESH_TOKEN',
};

export {ReduxAction, ActionTypes, createAction};
