import { IAllComments } from '~/interfaces/IPost';
import addToComments from '~/store/entities/comments/actions/addToComments';
import addToCommentsByParentId from '~/store/entities/comments/actions/addToCommentsByParentId';
import addToCommentsByParentIdWithComments from '~/store/entities/comments/actions/addToCommentsByParentIdWithComments';
import cancelCommentFailed from '~/store/entities/comments/actions/cancelCommentFailed';
import updateCreatedComment from '~/store/entities/comments/actions/updateCreatedComment';
import { createStore, resetStore } from '~/store/utils';
import addChildCommentToComment from './actions/addChildCommentToComment';
import ICommentsState from './Interface';
import removeChildComment from './actions/removeChildComment';
import { InitStateType } from '~/store/interfaces/IBaseState';
import removeCommentDeleted from './actions/removeCommentDeleted';

const initState: InitStateType<ICommentsState> = {
  comments: {},
  commentsByParentId: {},
};

const commentsStore = (set, get) => ({
  ...initState,

  actions: {
    setComments: (payload?: IAllComments) => {
      set((state: ICommentsState) => {
        state.comments = payload || {};
      }, 'setComments');
    },

    setCommentsByParentId: (payload?: {[x: string]: string[]}) => {
      set((state: ICommentsState) => {
        state.commentsByParentId = payload || {};
      }, 'setCommentsByParentId');
    },

    addToComments: addToComments(set, get),
    addToCommentsByParentId: addToCommentsByParentId(set, get),
    addToCommentsByParentIdWithComments: addToCommentsByParentIdWithComments(set, get),
    updateCreatedComment: updateCreatedComment(set, get),
    cancelCommentFailed: cancelCommentFailed(set, get),
    addChildCommentToComment: addChildCommentToComment(set, get),
    removeChildComment: removeChildComment(set, get),
    removeCommentDeleted: removeCommentDeleted(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useCommentsStore = createStore<ICommentsState>(commentsStore);

export default useCommentsStore;
