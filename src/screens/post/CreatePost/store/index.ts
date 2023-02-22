import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface ICreatePostState extends IBaseState {
  loading: boolean;

  actions: {
    setLoadingCreatePost: (payload: boolean) => void;
  };
}

const initialState: InitStateType<ICreatePostState> = {
  loading: false,
};

const createPostStore = (set) => ({
  ...initialState,

  actions: {
    setLoadingCreatePost: (payload: boolean) => {
      set((state: ICreatePostState) => {
        state.loading = payload;
      }, 'setLoadingCreatePost');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useCreatePostStore = createStore<ICreatePostState>(createPostStore);

export default useCreatePostStore;
