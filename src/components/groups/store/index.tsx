import {
  createStore, resetStore,
} from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IGroupTreeState extends IBaseState {
    collapsedIds: {[x: string]: string},
    actions:{
      toggle: (id: string) => void;
    }
}

const initialState = {
  collapsedIds: {},
};

const groupTreeStore = (set, get) => ({
  ...initialState,
  actions: {
    toggle: (id: string) => {
      const { collapsedIds } = get();
      if (collapsedIds[id]) {
        set((state) => {
          delete state.collapsedIds[id];
        }, `Expand item ${id}`);
      } else {
        set((state) => {
          state.collapsedIds[id] = true;
        }, `Collapse item ${id}`);
      }
    },
  },
  reset: () => resetStore(initialState, set),
});

const useGroupTreeStore = createStore<IGroupTreeState>(groupTreeStore);

export default useGroupTreeStore;
