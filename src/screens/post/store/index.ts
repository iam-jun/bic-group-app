import { createZustand, resetZustand } from '~/store/utils';

const initState: IPostState = {
};

const postStore = (set, _) => ({
  ...initState,

  reset: () => resetZustand(initState, set),
});

const usePostStore = createZustand<IPostState>(
  'post-store', postStore,
);

export default usePostStore;
