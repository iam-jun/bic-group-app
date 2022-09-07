import { createStore, resetStore } from '~/store/utils';

const initState: IPostState = {
};

const postStore = (set, _) => ({
  ...initState,

  reset: () => resetStore(initState, set),
});

const usePostStore = createStore<IPostState>(
  'post-store', postStore,
);

export default usePostStore;
