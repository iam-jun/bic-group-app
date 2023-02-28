import {
  ILinkPreviewCreatePost,
  IPayloadPublishDraftPost,
  IPostCreatePost,
} from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import createNewPost from './actions/createNewPost';
import postPublishDraftPost from './actions/postPublishDraftPost';

export type CreatePost = {
  id?: string;
  content: string;
  chosenAudiences: any[];
  important: {
    active?: boolean;
    expiresTime?: string | null;
  };
  canComment: boolean;
  canReact: boolean;
  images: any[];
  video: any;
  files: any[];
  count: number;
  isInitDone: boolean;
};

export type PrevUpdate = {
  images: any[];
  chosenAudiences: any[];
  important: {
    active?: boolean;
    expiresTime?: string | null;
  };
  linkPreview: {
    lstLinkPreview: ILinkPreviewCreatePost[];
    lstRemovedLinkPreview: string[];
  };
  video: any;
  files: any[];
};
export interface ICreatePostState extends IBaseState {
  loading: boolean;
  createPost: CreatePost;
  prevUpdate: PrevUpdate;
  actions: {
    createNewPost: (payload: IPostCreatePost) => void;
    updateCreatePost: (payload: Partial<CreatePost>) => void;
    updatePrevUpdate: (payload: Partial<PrevUpdate>) => void;
    setLoadingCreatePost: (payload: boolean) => void;
    postPublishDraftPost: (payload: IPayloadPublishDraftPost) => void;
  };
}

const initialState: InitStateType<ICreatePostState> = {
  loading: false,
  createPost: {
    content: '',
    chosenAudiences: [],
    important: {
      active: false,
      expiresTime: null,
    },
    canComment: true,
    canReact: true,
    images: [],
    video: undefined,
    files: [],
    count: 0,
    isInitDone: false,
  },
  prevUpdate: {
    images: [],
    video: undefined,
    files: [],
    important: {
      active: false,
      expiresTime: null,
    },
    chosenAudiences: [],
    linkPreview: {
      lstLinkPreview: [],
      lstRemovedLinkPreview: [],
    },
  },
};

const createPostStore = (set, get): ICreatePostState => ({
  ...initialState,

  actions: {
    createNewPost: createNewPost(set, get),
    updateCreatePost: (payload: Partial<CreatePost>) => {
      set((state: ICreatePostState) => {
        state.createPost = {
          ...state.createPost,
          ...payload,
        };
      }, 'updateCreatePost');
    },
    updatePrevUpdate: (payload: Partial<PrevUpdate>) => {
      set((state: ICreatePostState) => {
        state.prevUpdate = {
          ...state.prevUpdate,
          ...payload,
        };
      }, 'updatePrevUpdate');
    },
    setLoadingCreatePost: (payload: boolean) => {
      set((state: ICreatePostState) => {
        state.loading = payload;
      }, 'setLoadingCreatePost');
    },
    postPublishDraftPost: postPublishDraftPost(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useCreatePostStore = createStore<ICreatePostState>(createPostStore);

export default useCreatePostStore;
