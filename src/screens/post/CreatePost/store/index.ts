import {
  ICreatePostSeries,
  ICreatePostTags,
  ILinkPreviewCreatePost,
  IPostCreatePost,
} from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import createNewPost from './actions/createNewPost';
import getPostDetail from './actions/getPostDetail';
import schedulePost from './actions/schedulePost';

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
  canShare: boolean;
  images: any[];
  video: any;
  files: any[];
  count: number;
  tags?: ICreatePostTags[];
  series?: ICreatePostSeries[];
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
  tags: ICreatePostTags[];
  series: ICreatePostSeries[];
};

export type TempData = {
  tags: ICreatePostTags[];
  series: ICreatePostSeries[];
};
export interface ICreatePostState extends IBaseState {
  isLoadPostDetailDone: boolean;
  loading: boolean;
  createPost: CreatePost;
  prevUpdate: PrevUpdate;
  tempData: TempData;
  schedule: {
    scheduledAt: string;
    errorSubmiting: string;
    isSubmitingSuccess: boolean;
    isSubmiting: boolean;
  };
  actions: {
    getPostDetail: (postId: string) => void;
    createNewPost: (payload: IPostCreatePost) => void;
    schedulePost: (postId: string, payload: IPostCreatePost) => void;
    updateCreatePost: (payload: Partial<CreatePost>) => void;
    updatePrevUpdate: (payload: Partial<PrevUpdate>) => void;
    setLoadPostDetailDone: (payload: boolean) => void;
    setLoadingCreatePost: (payload: boolean) => void;
    initTagsTempData: () => void;
    addTagToTempData: (tag: ICreatePostTags) => void;
    removeTagTempData: (tag: ICreatePostTags) => void;
    clearTagsTempData: () => void;
    removeTag: (tag: ICreatePostTags) => void;
    initSeriesTempData: () => void;
    addSeriesToTempData: (series: ICreatePostSeries) => void;
    removeSeriesTempData: (series: ICreatePostSeries) => void;
    clearSeriesTempData: () => void;
    removeSeries: (series: ICreatePostSeries) => void;
    setScheduledAt: (scheduledAt: string) => void;
    setErrorScheduleSubmiting: (errorScheduleSubmiting: string) => void;
    setIsScheduleSubmitingSuccess: (
      isScheduleSubmitingSuccess: boolean
    ) => void;
  };
}

const initialState: InitStateType<ICreatePostState> = {
  isLoadPostDetailDone: false,
  loading: false,
  // for creating post
  createPost: {
    content: '',
    chosenAudiences: [],
    important: {
      active: false,
      expiresTime: null,
    },
    canComment: true,
    canReact: true,
    canShare: true,
    images: [],
    video: undefined,
    files: [],
    count: 0,
    tags: [],
    series: [],
    isInitDone: false,
  },
  // for checking change between current createPost data & previous createPost data
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
    tags: [],
    series: [],
  },
  // for selecting before saving to createPost data
  tempData: {
    tags: [],
    series: [],
  },
  schedule: {
    scheduledAt: '',
    errorSubmiting: '',
    isSubmitingSuccess: false,
    isSubmiting: false,
  },
};

const createPostStore = (
  set,
  get: () => ICreatePostState,
): ICreatePostState => ({
  ...initialState,

  actions: {
    getPostDetail: getPostDetail(set, get),
    createNewPost: createNewPost(set, get),
    schedulePost: schedulePost(set, get),
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
    setLoadPostDetailDone: (payload: boolean) => {
      set((state: ICreatePostState) => {
        state.isLoadPostDetailDone = payload;
      }, 'setLoadPostDetailDone');
    },
    initTagsTempData: () => {
      set((state: ICreatePostState) => {
        state.tempData.tags = state.createPost.tags;
      }, 'initTagTempData');
    },
    addTagToTempData: (tag: ICreatePostTags) => {
      const selecting = get().tempData.tags || [];
      const isAdded = selecting.findIndex((item) => item?.id === tag?.id) > -1;
      if (!isAdded) {
        const newSelecting = [...selecting];
        newSelecting.push(tag);
        set((state: ICreatePostState) => {
          state.tempData.tags = newSelecting;
        }, 'addTagToTempData');
      }
    },
    removeTagTempData: (tag: ICreatePostTags) => {
      const selecting = get().tempData.tags || [];
      const newSelecting = selecting.filter((item) => item?.id !== tag?.id);
      set((state) => {
        state.tempData.tags = newSelecting;
      }, 'removeTagTempData');
    },
    clearTagsTempData: () => {
      set((state: ICreatePostState) => {
        state.tempData.tags = [];
      }, 'clearTagsTempData');
    },
    removeTag: (tag: ICreatePostTags) => {
      const selecting = get().createPost.tags || [];
      const newSelecting = selecting.filter((item) => item?.id !== tag?.id);
      set((state) => {
        state.createPost.tags = newSelecting;
      }, 'removeTag');
    },
    initSeriesTempData: () => {
      set((state: ICreatePostState) => {
        state.tempData.series = state.createPost.series;
      }, 'initSeriesTempData');
    },
    addSeriesToTempData: (series: ICreatePostSeries) => {
      const selecting = get().tempData.series || [];
      const isAdded
        = selecting.findIndex((item) => item?.id === series?.id) > -1;
      if (!isAdded) {
        const newSelecting = [...selecting];
        newSelecting.push(series);
        set((state: ICreatePostState) => {
          state.tempData.series = newSelecting;
        }, 'addSeriesToTempData');
      }
    },
    removeSeriesTempData: (series: ICreatePostSeries) => {
      const selecting = get().tempData.series || [];
      const newSelecting = selecting.filter((item) => item?.id !== series?.id);
      set((state) => {
        state.tempData.series = newSelecting;
      }, 'removeSeriesTempData');
    },
    clearSeriesTempData: () => {
      set((state: ICreatePostState) => {
        state.tempData.series = [];
      }, 'clearSeriesTempData');
    },
    removeSeries: (series: ICreatePostSeries) => {
      const selecting = get().createPost.series || [];
      const newSelecting = selecting.filter((item) => item?.id !== series?.id);
      set((state) => {
        state.createPost.series = newSelecting;
      }, 'removeSeries');
    },
    setScheduledAt: (scheduledAt: string) => {
      set((state: ICreatePostState) => {
        state.schedule.scheduledAt = scheduledAt;
      }, 'setScheduledAt Post');
    },
    setErrorScheduleSubmiting: (errorScheduleSubmiting: string) => {
      set((state: ICreatePostState) => {
        state.schedule.errorSubmiting = errorScheduleSubmiting;
      }, 'setErrorScheduleSubmiting Post');
    },
    setIsScheduleSubmitingSuccess: (isScheduleSubmitingSuccess: boolean) => {
      set((state: ICreatePostState) => {
        state.schedule.isSubmitingSuccess = isScheduleSubmitingSuccess;
      }, 'setIsScheduleSubmitingSuccess Post');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useCreatePostStore = createStore<ICreatePostState>(createPostStore);

export default useCreatePostStore;
