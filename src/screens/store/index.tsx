import {
  ICommentData,
  IOwnReaction, IPayloadReactToComment, IPayloadReactToPost, IPayloadUpdateReaction, IReactionCounts,
} from '~/interfaces/IPost';
import {
  createStore,
} from '~/store/utils';
import deleteReactToComment from './actions/deleteReactToComment';
import deleteReactToPost from './actions/deleteReactToPost';
import onUpdateReactionOfCommentById from './actions/onUpdateReactionOfCommentById';
import onUpdateReactionOfPostById from './actions/onUpdateReactionOfPostById';
import putReactionToComment from './actions/putReactionToComment';
import putReactionToPost from './actions/putReactionToPost';
import updateReactionBySocket from './actions/updateReactionBySocket';

interface ICommonController {
  actions: {
    putReactionToPost?: (payload: IPayloadReactToPost) => void;
    onUpdateReactionOfPostById: (
        postId: string, ownReaction: IOwnReaction, reactionCounts: IReactionCounts,) => void;
    deleteReactToPost: (payload: IPayloadReactToPost) => void;
    putReactionToComment: (payload: IPayloadReactToComment) => void;
    deleteReactToComment: (payload: IPayloadReactToComment) =>void;
    onUpdateReactionOfCommentById: (
        commentId: string,
        ownReaction: IOwnReaction,
        reactionCounts: IReactionCounts,
        defaultComment?: ICommentData,
    )=>void;
    updateReactionBySocket: (payload: IPayloadUpdateReaction)=>void;
  }
}

const commonController = (set, get) => ({
  actions: {
    putReactionToPost: putReactionToPost(set, get),
    onUpdateReactionOfPostById: onUpdateReactionOfPostById(set, get),
    deleteReactToPost: deleteReactToPost(set, get),
    putReactionToComment: putReactionToComment(set, get),
    deleteReactToComment: deleteReactToComment(set, get),
    onUpdateReactionOfCommentById: onUpdateReactionOfCommentById(set, get),
    updateReactionBySocket: updateReactionBySocket(set, get),
  },
});

const useCommonController = createStore<ICommonController>(commonController);

export default useCommonController;
