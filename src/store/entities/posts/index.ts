import {
  IAllPosts,
  IPayloadAddToAllPost,
  IPayloadDeletePost,
  IPayloadGetPostDetail,
  IPayloadPutEditPost,
  IPayloadPutMarkSeenPost,
  IPost,
  IPayloadRemoveAudiencesOfPost,
  IPayloadReplying,
  IErrorContent,
  IPutEditSettingsParams,
  PostType,
} from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import addToPosts from './actions/addToPosts';
import deletePost from './actions/deletePost';
import deletePostLocal from './actions/deletePostLocal';
import getPostDetail from './actions/getPostDetail';
import putEditPost from './actions/putEditPost';
import putEditSettings from './actions/putEditSettings';
import putMarkSeenPost from './actions/putMarkSeenPost';
import removeAudiencesFromPost from './actions/removeAudiencesFromPost';
import getContentDetail from './actions/getContentDetail';

export interface IPostsState extends IBaseState {
  isLoadingGetPostDetail: boolean;
  posts: { [id: string]: IPost };
  replyingComment: any,
  scrollToLatestItem: any,
  scrollToCommentsPosition: any,
  commentErrorCode: any,
  errorContents: { [id: string]: IErrorContent }

  actions: {
    setPosts: (payload?: IAllPosts) => void;
    setIsLoadingGetPostDetail: (isLoadingGetPostDetail: boolean) => void;
    getPostDetail: (payload: IPayloadGetPostDetail) => void;
    addToPosts: (payload: IPayloadAddToAllPost) => void;
    deletePost: (payload: IPayloadDeletePost) => void;
    deletePostLocal: (id: string) => void;
    putEditPost: (payload: IPayloadPutEditPost) => Promise<void>;
    putMarkSeenPost: (payload: IPayloadPutMarkSeenPost) => void;
    removeAudiencesFromPost: (payload: IPayloadRemoveAudiencesOfPost) => void;
    setPostDetailReplyingComment: (payload?: IPayloadReplying) => void;
    setScrollToLatestItem: (payload: null | { parentCommentId?: string | number }) => void;
    setScrollCommentsPosition: (payload: null | { position?: string }) => void;
    setCommentErrorCode: (payload: boolean | string) => void;
    addToErrorContents: (id: string, payload: IErrorContent) => void;
    putEditSettings: (params: IPutEditSettingsParams) => void;
    getContentDetail: (contentId: string, contentType?: PostType) => void;
  };
}

const initState: InitStateType<IPostsState> = {
  isLoadingGetPostDetail: false,
  posts: {},
  replyingComment: {},
  scrollToLatestItem: null,
  scrollToCommentsPosition: null,
  commentErrorCode: '',
  errorContents: {},
};

const postsStore = (set, get) => ({
  ...initState,

  actions: {
    setPosts: (payload?: IAllPosts) => {
      set((state: IPostsState) => {
        state.posts = payload || {};
      }, 'setPosts');
    },
    setIsLoadingGetPostDetail: (isLoadingGetPostDetail: boolean) => {
      set((state: IPostsState) => {
        state.isLoadingGetPostDetail = isLoadingGetPostDetail;
      }, 'setIsLoadingGetPostDetail');
    },
    getPostDetail: getPostDetail(set, get),
    addToPosts: addToPosts(set, get),
    deletePost: deletePost(set, get),
    deletePostLocal: deletePostLocal(set, get),
    putEditPost: putEditPost(set, get),
    putMarkSeenPost: putMarkSeenPost(),
    removeAudiencesFromPost: removeAudiencesFromPost(),
    setPostDetailReplyingComment: (payload?: IPayloadReplying) => {
      set((state: IPostsState) => {
        state.replyingComment = payload;
      }, 'setPostDetailReplyingComment');
    },
    setScrollToLatestItem: (payload: null | { parentCommentId?: string | number }) => {
      set((state: IPostsState) => {
        state.scrollToLatestItem = payload;
      }, 'setScrollToLatestItem');
    },
    setScrollCommentsPosition: (payload: null | { position?: string }) => {
      set((state: IPostsState) => {
        state.scrollToCommentsPosition = payload;
      }, 'setScrollCommentsPosition');
    },
    setCommentErrorCode: (payload: boolean | string) => {
      set((state: IPostsState) => {
        state.commentErrorCode = payload;
      }, 'setCommentErrorCode');
    },
    addToErrorContents: (id, payload) => {
      set((state: IPostsState) => {
        state.errorContents[id] = payload;
      }, 'addToErrorContents');
    },
    putEditSettings: putEditSettings(set, get),
    getContentDetail: getContentDetail(set, get),
  },

  reset: () => resetStore(initState, set),
});

const usePostsStore = createStore<IPostsState>(postsStore);

export default usePostsStore;
