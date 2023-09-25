import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ContentFeed, ScheduledFeed } from '~/interfaces/IFeed';

export interface IYourContentState extends IBaseState {
    activeDraftTab: number;
    activePublishTab: ContentFeed;
    activeScheduledTab: ScheduledFeed;

    actions: {
        setActiveDraftTab: (payload: number) => void;
        setActivePublishTab: (payload: ContentFeed) => void;
        setActiveScheduledTab: (payload: ScheduledFeed) => void;
    }
}

const initState: InitStateType<IYourContentState> = {
  activeDraftTab: 0,
  activePublishTab: ContentFeed.ALL,
  activeScheduledTab: ScheduledFeed.ALL,
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
    setActiveScheduledTab: (payload: ScheduledFeed) => {
      set((state: IYourContentState) => {
        state.activeScheduledTab = payload;
      }, 'setActiveScheduledTab');
    },
  },

  reset: () => resetStore(initState, set),
});

const useYourContentStore = createStore<IYourContentState>(yourContentStore);

export default useYourContentStore;
