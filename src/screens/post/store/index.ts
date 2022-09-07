import { createStore, resetStore } from '~/store/utils';
import { IPostState } from './Interface';

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
