import { createZustand, resetStore } from '~/store/utils';

const initState: IPostState = {
};

const postStore = (set, _) => ({
  ...initState,

  reset: () => resetStore(initState, set),
});

const usePostStore = createZustand<IPostState>(
  'post-store', postStore,
);

export default usePostStore;
