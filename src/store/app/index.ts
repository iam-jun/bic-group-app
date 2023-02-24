import IBaseState from '../interfaces/IBaseState';
import { createStore, resetStore } from '../utils';

export interface IAppState extends IBaseState{
  debuggerVisible: boolean;
  actions: {
setDebuggerVisible: (visible: boolean)=>void;
  }
}

const initialState = {
  debuggerVisible: false,
};

const appStore = (set, _get) => ({
  ...initialState,
  actions: {
    setDebuggerVisible: (visible: boolean) => {
      set((state) => {
        state.debuggerVisible = visible;
      }, 'setDebuggerVisible');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useAppStore = createStore<IAppState>(appStore);

export default useAppStore;
