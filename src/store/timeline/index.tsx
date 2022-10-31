import {
  createStore, resetStore,
} from '~/store/utils';
import getPosts from './actions/getPosts';
import { IPost } from '~/interfaces/IPost';
import IBaseState, { IBaseListState } from '../interfaces/IBaseState';

export interface ITimelineState extends IBaseState {
    items: {[x: string]: IBaseListState<IPost>};
    actions:{
      getPosts: (id: string, isRefresh?: boolean) => void;
      resetTimeline: (id: string) => void;
    }
}

const initialState = {
  items: {},
};

const timelineStore = (set, get) => ({
  ...initialState,
  actions: {
    getPosts: getPosts(set, get),
    resetTimeline: (id: string) => {
      set((state) => {
        state.items[id] = {};
      });
    },
  },
  reset: () => resetStore(initialState, set),
});

const useTimelineStore = createStore<ITimelineState>(timelineStore);

export default useTimelineStore;
