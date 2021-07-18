interface ReduxAction {
  type: string;
  payload: unknown;
}

const createAction = (type: string, payload = {}): ReduxAction => {
  return {
    type: `${type}`,
    payload,
  };
};

const ActionTypes = {
  REFRESH_TOKEN: 'auth/REFRESH_TOKEN',
};

export {ReduxAction, ActionTypes, createAction};
