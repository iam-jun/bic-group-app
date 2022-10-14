import {
  createStore,
} from '~/store/utils';
import createComment from './actions/createComment';
import retryAddComment from './actions/retryAddComment';
import ICommentInputState from './Interface';

const initState: ICommentInputState = {
  createComment: {
    loading: false,
    content: '',
    image: undefined,
  },
};

const commentInputStore = (set, get) => ({
  ...initState,

  actions: {
    setCreateComment: (payload: {
    loading?: boolean;
    content?: string;
    image?: any;
  }) => {
      set((state: ICommentInputState) => {
        state.createComment = {
          ...state.createComment,
          ...payload,
        };
      }, 'setCreateComment');
    },
    createComment: createComment(set, get),
    retryAddComment: retryAddComment(set, get),
  },
});

const useCommentInputStore = createStore<ICommentInputState>(commentInputStore);

export default useCommentInputStore;
