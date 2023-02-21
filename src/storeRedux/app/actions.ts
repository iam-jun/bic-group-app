import Actions from './constants';

export default {
  setRootScreenName: (payload: string) => ({
    type: Actions.SET_ROOT_SCREEN_NAME,
    payload,
  }),
  setDrawerVisible: (payload: boolean) => ({
    type: Actions.SET_DRAWER_VISIBLE,
    payload,
  }),
  setShowError: (payload: any) => ({
    type: Actions.SET_SHOW_ERROR,
    payload,
  }),
  setDebuggerVisible: (payload: boolean) => ({
    type: Actions.SET_DEBUGGER_VISIBLE,
    payload,
  }),
};
