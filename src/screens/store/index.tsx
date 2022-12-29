import _ from 'lodash';
import { IGetUserProfile, IUserProfile } from '~/interfaces/IAuth';
import {
  ICommentData,
  IOwnReaction,
  IPayloadReactToComment,
  IPayloadReactToPost,
  IPayloadUpdateReaction,
  IReactionCounts,
  PostType,
  TargetType,
} from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import deleteReactToComment from './actions/deleteReactToComment';
import deleteReactToPost from './actions/deleteReactToPost';
import getMyProfile from './actions/getMyProfile';
import onUpdateReactionOfCommentById from './actions/onUpdateReactionOfCommentById';
import onUpdateReactionOfPostById from './actions/onUpdateReactionOfPostById';
import putReactionToComment from './actions/putReactionToComment';
import putReactionToPost from './actions/putReactionToPost';
import savePost from './actions/savePost';
import unsavePost from './actions/unsavePost';
import updateReactionBySocket from './actions/updateReactionBySocket';

export interface ICommonController extends IBaseState {
  myProfile: IUserProfile;

  actions: {
    reactToPost: _.DebouncedFunc<
      (payload: { type: 'put' | 'delete'; data: IPayloadReactToPost; targetType?: TargetType }) => void
    >;
    putReactionToPost?: (payload: IPayloadReactToPost) => void;
    onUpdateReactionOfPostById: (
        postId: string, ownReaction: IOwnReaction, reactionsCount: IReactionCounts,) => void;
    deleteReactToPost: (payload: IPayloadReactToPost) => void;
    putReactionToComment: (payload: IPayloadReactToComment) => void;
    deleteReactToComment: (payload: IPayloadReactToComment) =>void;
    onUpdateReactionOfCommentById: (
        commentId: string,
        ownReaction: IOwnReaction,
        reactionsCount: IReactionCounts,
        defaultComment?: ICommentData,
    )=>void;
    updateReactionBySocket: (payload: IPayloadUpdateReaction)=>void;
    getMyProfile: (payload: IGetUserProfile) => void;
    setMyProfile: (payload: IUserProfile) => void;

    savePost: (id:string, type: PostType) => void;
    unsavePost: (id:string, type: PostType) => void;
  }
}

const initialState = {
  myProfile: {} as IUserProfile,
};

const commonController = (set, get) => ({
  ...initialState,
  actions: {
    reactToPost: _.throttle(
      (payload: { type: 'put' | 'delete'; data: IPayloadReactToPost; targetType?: TargetType }) => {
        const { type, data, targetType } = payload;
        if (type === 'put') {
          get().actions.putReactionToPost(data, targetType);
        }
        if (type === 'delete') {
          get().actions.deleteReactToPost(data);
        }
      },
      500,
      { trailing: false },
    ),
    putReactionToPost: putReactionToPost(set, get),
    onUpdateReactionOfPostById: onUpdateReactionOfPostById(set, get),
    deleteReactToPost: deleteReactToPost(set, get),
    putReactionToComment: putReactionToComment(set, get),
    deleteReactToComment: deleteReactToComment(set, get),
    onUpdateReactionOfCommentById: onUpdateReactionOfCommentById(set, get),
    updateReactionBySocket: updateReactionBySocket(set, get),
    getMyProfile: getMyProfile(set, get),

    setMyProfile: (payload: IUserProfile) => {
      set((state) => {
        state.myProfile = payload;
      }, 'setMyProfile');
    },
    savePost: savePost(set, get),
    unsavePost: unsavePost(set, get),
  },
});

const useCommonController = createStore<ICommonController>(commonController);

export default useCommonController;
