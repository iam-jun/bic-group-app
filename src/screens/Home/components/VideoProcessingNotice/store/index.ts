import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getPostsInProgress from './actions/getPostsInProgress';
import updatePostsInProgress from './actions/updatePostsInProgress';
import { ISocketNotification } from '~/interfaces/INotification';

export interface IPostsInProgressState extends IBaseState{
  total: number,
  data: any[],
  hasNextPage: boolean,

  actions: {
    setTotal: (newTotal: number) => void;
    getPosts: () => void;
    updatePosts: (payload: ISocketNotification) => void;
  }
}

const initialState: InitStateType<IPostsInProgressState> = {
  total: 0,
  data: [],
  hasNextPage: false,
};

const postsContainingVideoInProgressStore = (set, get) => ({
  ...initialState,

  actions: {
    setTotal: (newTotal: number) => {
      set((state: IPostsInProgressState) => {
        state.total = newTotal;
      }, 'updatePostInProgressByNoti');
    },
    getPosts: getPostsInProgress(set, get),
    updatePosts: updatePostsInProgress(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const usePostsInProgressStore = createStore<IPostsInProgressState>(
  postsContainingVideoInProgressStore,
  {
    persist: {
      name: 'PostContainerStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: IPostsInProgressState) => ({
        total: state.total,
        data: state.data,
        hasNextPage: state.hasNextPage,
      }),
    },
  },
);

export default usePostsInProgressStore;
