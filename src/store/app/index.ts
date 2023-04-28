import IBaseState from '../interfaces/IBaseState';
import { createStore, resetStore } from '../utils';

export interface IAppState extends IBaseState{
  debuggerVisible: boolean;
  redirectUrl: string;
  actions: {
    setDebuggerVisible: (visible: boolean)=>void;
    setRedirectUrl: (url: string) => void;
  }
}

const initialState = {
  debuggerVisible: false,
  redirectUrl: '',
};

const appStore = (set, _get) => ({
  ...initialState,
  actions: {
    setDebuggerVisible: (visible: boolean) => {
      set((state) => {
        state.debuggerVisible = visible;
      }, 'setDebuggerVisible');
    },
    setRedirectUrl: (url: string) => {
      set((state) => {
        state.redirectUrl = url;
      }, 'setRedirectUrl');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useAppStore = createStore<IAppState>(appStore);

export default useAppStore;
