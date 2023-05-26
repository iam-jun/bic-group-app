import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ContentFeed } from '~/interfaces/IFeed';

export interface IYourContentState extends IBaseState {
    activeDraftTab: number;
    activePublishTab: ContentFeed;

    actions: {
        setActiveDraftTab: (payload: number) => void;
        setActivePublishTab: (payload: ContentFeed) => void;
    }
}

const initState: InitStateType<IYourContentState> = {
  activeDraftTab: 0,
  activePublishTab: ContentFeed.ALL,
};

const yourContentStore = (set) => ({
  ...initState,

  actions: {
    setActiveDraftTab: (payload: number) => {
      set((state: IYourContentState) => {
        state.activeDraftTab = payload;
      }, 'setActiveDraftTab');
    },
    setActivePublishTab: (payload: ContentFeed) => {
      set((state: IYourContentState) => {
        state.activePublishTab = payload;
      }, 'setActivePublishTab');
    },
  },

  reset: () => resetStore(initState, set),
});

const useYourContentStore = createStore<IYourContentState>(yourContentStore);

export default useYourContentStore;
