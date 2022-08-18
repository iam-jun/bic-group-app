import Actions from './constants';

export default {
  getAPIKey: () => ({
    type: Actions.GET_API_KEY,
  }),
  setAPIKey: (payload: string) => ({
    type: Actions.SET_API_KEY,
    payload,
  }),
};
