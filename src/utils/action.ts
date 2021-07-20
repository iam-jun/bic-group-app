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
  UnauthorizedLogout: 'UnauthorizedLogout',
  RefreshTokenSuccessBein: 'RefreshTokenSuccessBein',
  SaveAuthTokens: 'SaveAuthTokens',

  // getStream
  GetStreamSample: 'GetStreamSample',
};

export {ReduxAction, ActionTypes, createAction};
