interface ReduxAction {
  type: string;
  payload: unknown;
}

const createAction = (
  type: string, payload = {},
): ReduxAction => ({
  type: `${type}`,
  payload,
});

const ActionTypes = {
  UnauthorizedLogout: 'UnauthorizedLogout',
  RefreshTokenSuccessBein: 'RefreshTokenSuccessBein',
  SaveAuthTokens: 'SaveAuthTokens',
};

export { ReduxAction, ActionTypes, createAction };
