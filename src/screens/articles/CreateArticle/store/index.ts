import {
  ICategory,
  IEditArticleAudience,
  IEditArticleData,
  IEditArticleSeries,
  IEditArticleTags,
  IParamsValidateSeriesTags,
  IPayloadPutEditArticle,
} from '~/interfaces/IArticle';
import { IArticleCover } from '~/interfaces/IPost';
import handleSaveError from './actions/handleSaveError';
import putEditArticle from './actions/putEditArticle';
import validateSeriesTags from './actions/validateSeriesTags';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import createArticle from './actions/createArticle';
import scheduleArticle from './actions/scheduleArticle';

export interface ICreateArticleState extends IBaseState {
  schedule: {
    publishedAt: string;
    errorSubmiting: string;
    isSubmitingSuccess: boolean;
    isSubmiting: boolean;
  };
  isValidating: boolean;
  loading: boolean;
  data: IEditArticleData;
  isDraft: boolean;
  actions: {
    setLoading: (isLoading: boolean) => void;
    setData: (data: IEditArticleData) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setSummary: (summary: string) => void;
    setAudience: (audience: IEditArticleAudience) => void;
    setMentions: (mentions: any) => void;
    setCover: (cover?: IArticleCover) => void;
    setCategories: (categories?: ICategory[]) => void;
    addCategory: (category: ICategory) => void;
    removeCategory: (category: ICategory) => void;
    setIsDraft: (setIsDraft: boolean) => void;
    setSeries: (series?: IEditArticleSeries[]) => void;
    addSeries: (series: IEditArticleSeries) => void;
    removeSeries: (series: IEditArticleSeries) => void;
    setTags: (tags?: IEditArticleTags[]) => void;
    addTag: (tag: IEditArticleTags) => void;
    removeTag: (tag: IEditArticleTags) => void;
    setPublishedAt: (publishedAt: string) => void;
    setErrorScheduleSubmiting: (errorScheduleSubmiting: string) => void;
    setIsValidating: (isValidating: boolean) => void;
    setIsScheduleSubmitingSuccess: (
      isScheduleSubmitingSuccess: boolean
    ) => void;
    scheduleArticle: () => void;
    putEditArticle: (params: IPayloadPutEditArticle) => void;
    createArticle: () => void;
    validateSeriesTags: (
      data: IParamsValidateSeriesTags,
      onSuccess: (response) => void,
      onError: (error) => void
    ) => void;
    handleSaveError: (error: any, onNext?: () => void) => void;
  };
}

const initialState: InitStateType<ICreateArticleState> = {
  schedule: {
    publishedAt: '',
    errorSubmiting: '',
    isSubmitingSuccess: false,
    isSubmiting: false,
  },
  isValidating: false,
  loading: false,
  data: {
    id: '',
    title: '',
    content: '',
    summary: '',
    categories: [],
    series: [],
    tags: [],
    hashtags: [],
    audience: {
      userIds: [],
      groupIds: [],
    },
    coverMedia: {},
    setting: {
      canShare: true,
      canReact: true,
      canComment: true,
      isImportant: false,
      importantExpiredAt: null,
    },
    mentions: {},
  },
  isDraft: false,
};

const useCreateArticle = (set, get) => ({
  ...initialState,

  actions: {
    setLoading: (isLoading: boolean) => {
      set((state: ICreateArticleState) => {
        state.loading = isLoading;
      }, 'setLoading');
    },
    setData: (data?: IEditArticleData) => {
      set((state: ICreateArticleState) => {
        state.data = data || (initialState.data as IEditArticleData);
      }, 'setData');
    },
    setTitle: (title: string) => {
      set((state: ICreateArticleState) => {
        state.data.title = title;
      }, 'setTitle');
    },
    setContent: (content: string) => {
      set((state: ICreateArticleState) => {
        state.data.content = content;
      }, 'setContent');
    },
    setSummary: (summary: string) => {
      set((state: ICreateArticleState) => {
        state.data.summary = summary;
      }, 'setSummary');
    },
    setAudience: (audience?: IEditArticleAudience) => {
      set((state: ICreateArticleState) => {
        state.data.audience = audience || ({} as IEditArticleAudience);
      }, 'setAudience');
    },
    setMentions: (mentions?: any) => {
      set((state: ICreateArticleState) => {
        state.data.mentions = mentions || {};
      }, 'setMentions');
    },
    setCover: (cover?: IArticleCover) => {
      set((state: ICreateArticleState) => {
        state.data.coverMedia = cover || {};
      }, 'setCover');
    },
    setCategories: (categories?: ICategory[]) => {
      set((state: ICreateArticleState) => {
        state.data.categories = categories || [];
      }, 'setCategories');
    },
    addCategory: (category: ICategory) => {
      const selecting = get().data.categories || [];
      const isAdded
        = selecting.findIndex((catItem) => catItem?.name === category?.name) > -1;
      if (!isAdded) {
        const newSelecting = [...selecting];
        newSelecting.push(category);
        set((state) => {
          state.data.categories = newSelecting;
        }, 'addCategory');
      }
    },
    removeCategory: (category: ICategory) => {
      const selecting = get().data.categories || [];
      const newSelecting = selecting.filter(
        (catItem) => catItem?.name !== category?.name,
      );
      set((state) => {
        state.data.categories = newSelecting;
      }, 'removeCategory');
    },
    setIsDraft: (isDraft: boolean) => {
      set((state: ICreateArticleState) => {
        state.isDraft = isDraft;
      }, 'setIsDraft');
    },
    setSeries: (series?: IEditArticleSeries[]) => {
      set((state: ICreateArticleState) => {
        state.data.series = series || [];
      }, 'setSeries');
    },
    addSeries: (seriesData: IEditArticleSeries) => {
      const selecting = get().data.series || [];
      const isAdded
        = selecting.findIndex((item) => item?.id === seriesData?.id) > -1;
      if (!isAdded) {
        const newSelecting = [...selecting];
        newSelecting.push(seriesData);
        set((state) => {
          state.data.series = newSelecting;
        }, 'addSeries');
      }
    },
    removeSeries: (seriesData: IEditArticleSeries) => {
      const selecting = get().data.series || [];
      const newSelecting = selecting.filter(
        (item) => item?.id !== seriesData?.id,
      );
      set((state) => {
        state.data.series = newSelecting;
      }, 'removeSeries');
    },
    setTags: (tags?: IEditArticleTags[]) => {
      set((state: ICreateArticleState) => {
        state.data.tags = tags || [];
      }, 'setTags');
    },
    addTag: (tag: IEditArticleTags) => {
      const selecting = get().data.tags || [];
      const isAdded = selecting.findIndex((item) => item?.id === tag?.id) > -1;
      if (!isAdded) {
        const newSelecting = [...selecting];
        newSelecting.push(tag);
        set((state) => {
          state.data.tags = newSelecting;
        }, 'addTag');
      }
    },
    removeTag: (tag: IEditArticleTags) => {
      const selecting = get().data.tags || [];
      const newSelecting = selecting.filter((item) => item?.id !== tag?.id);
      set((state) => {
        state.data.tags = newSelecting;
      }, 'removeTags');
    },
    setPublishedAt: (publishedAt: string) => {
      set((state: ICreateArticleState) => {
        state.schedule.publishedAt = publishedAt;
      }, 'setPublishedAt');
    },
    setErrorScheduleSubmiting: (errorScheduleSubmiting: string) => {
      set((state: ICreateArticleState) => {
        state.schedule.errorSubmiting = errorScheduleSubmiting;
      }, 'setErrorScheduleSubmiting');
    },
    setIsScheduleSubmiting: (isScheduleSubmiting: boolean) => {
      set((state: ICreateArticleState) => {
        state.schedule.isSubmiting = isScheduleSubmiting;
      }, 'setIsScheduleSubmiting');
    },
    setIsValidating: (isValidating: boolean) => {
      set((state: ICreateArticleState) => {
        state.isValidating = isValidating;
      }, 'setIsValidating');
    },
    setIsScheduleSubmitingSuccess: (isScheduleSubmitingSuccess: boolean) => {
      set((state: ICreateArticleState) => {
        state.schedule.isSubmitingSuccess = isScheduleSubmitingSuccess;
      }, 'setIsScheduleSubmitingSuccess');
    },
    scheduleArticle: scheduleArticle(set, get),
    putEditArticle: putEditArticle(set, get),
    createArticle: createArticle(set, get),
    validateSeriesTags: validateSeriesTags(set, get),
    handleSaveError: handleSaveError(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useCreateArticleStore
  = createStore<ICreateArticleState>(useCreateArticle);

export default useCreateArticleStore;
