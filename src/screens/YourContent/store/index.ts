import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';

export interface IYourContentState extends IBaseState {
    activeDraftTab: number;

    actions: {
        setActiveDraftTab: (payload: number) => void;
    }
}

const initState: InitStateType<IYourContentState> = {
  activeDraftTab: 0,
};

const yourContentStore = (set) => ({
  ...initState,

  actions: {
    setActiveDraftTab: (payload: number) => {
      set((state: IYourContentState) => {
        state.activeDraftTab = payload;
      }, 'setActiveDraftTab');
    },
  },

  reset: () => resetStore(initState, set),
});

const useYourContentStore = createStore<IYourContentState>(yourContentStore);

export default useYourContentStore;
