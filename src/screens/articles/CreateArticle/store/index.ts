import {
  ICategory,
  IEditAritcleError,
  IEditArticleAudience,
  IEditArticleData,
  IEditArticleSeries,
  IEditArticleTags,
  IPayloadPutEditArticle,
} from '~/interfaces/IArticle';
import { IArticleCover } from '~/interfaces/IPost';
import putEditArticle from '~/screens/articles/CreateArticle/store/actions/putEditArticle';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import createArticle from './actions/createArticle';

export interface ICreateArticleState extends IBaseState {
  loading: boolean;
  data: IEditArticleData;
  isPublishing: boolean;
  actions: {
    setData: (data: IEditArticleData) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setSummary: (summary: string) => void;
    setAudience: (audience: IEditArticleAudience) => void;
    setMentions: (mentions: any) => void;
    setCover: (cover?:IArticleCover) => void;
    setCategories: (categories?: ICategory[]) => void;
    addCategory: (category: ICategory) => void;
    removeCategory: (category: ICategory) => void;
    setIsPublishing: (isPublishing: boolean) => void;
    setSeries: (series?: IEditArticleSeries[]) => void;
    addSeries: (series: IEditArticleSeries) => void;
    removeSeries: (series: IEditArticleSeries) => void;
    setTags: (tags?: IEditArticleTags[]) => void;
    addTag: (tag: IEditArticleTags) => void;
    removeTag: (tag: IEditArticleTags) => void;
    putEditArticle: (
      params: IPayloadPutEditArticle,
      callbackError: (data: IEditAritcleError) => void,
      ) => void;
    createArticle: () => void;
  };
}

const initialState = {
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
    media: {},
    setting: {
      canShare: true,
      canReact: true,
      canComment: true,
      isImportant: false,
      importantExpiredAt: null,
    },
    mentions: {},
  },
  isPublishing: false,
};

const useCreateArticle = (set, get) => ({
  ...initialState,

  actions: {
    setData: (data?: IEditArticleData) => {
      set((state: ICreateArticleState) => {
        state.data = data || initialState.data as IEditArticleData;
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
    setAudience: (audience?:IEditArticleAudience) => {
      set((state: ICreateArticleState) => {
        state.data.audience = audience || {} as IEditArticleAudience;
      }, 'setAudience');
    },
    setMentions: (mentions?:any) => {
      set((state: ICreateArticleState) => {
        state.data.mentions = mentions || {};
      }, 'setMentions');
    },
    setCover: (cover?:IArticleCover) => {
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
      const isAdded = selecting.findIndex((catItem) => catItem?.name === category?.name) > -1;
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
      const newSelecting = selecting.filter((catItem) => catItem?.name !== category?.name);
      set((state) => {
        state.data.categories = newSelecting;
      }, 'removeCategory');
    },
    setIsPublishing: (isPublishing: boolean) => {
      set((state: ICreateArticleState) => {
        state.isPublishing = isPublishing;
      }, 'setIsPublishing');
    },
    setSeries: (series?: IEditArticleSeries[]) => {
      set((state: ICreateArticleState) => {
        state.data.series = series || [];
      }, 'setSeries');
    },
    addSeries: (seriesData: IEditArticleSeries) => {
      const selecting = get().data.series || [];
      const isAdded = selecting.findIndex((item) => item?.id === seriesData?.id) > -1;
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
      const newSelecting = selecting.filter((item) => item?.id !== seriesData?.id);
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

    putEditArticle: putEditArticle(set, get),
    createArticle: createArticle(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useCreateArticleStore = createStore<ICreateArticleState>(useCreateArticle);

export default useCreateArticleStore;
