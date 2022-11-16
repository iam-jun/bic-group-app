import {
  ICategory, IEditArticleAudience, IEditArticleData, IEditArticleSeries, IPayloadPutEditArticle,
} from '~/interfaces/IArticle';
import { IArticleCover } from '~/interfaces/IPost';
import putEditArticle from '~/screens/articles/EditArticle/store/actions/putEditArticle';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface IEditArticleState extends IBaseState {
  loading: boolean;
  data: IEditArticleData;
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
    setSeries: (series?: IEditArticleSeries[]) => void;
    addSeries: (series: IEditArticleSeries) => void;
    removeSeries: (series: IEditArticleSeries) => void;
    putEditArticle: (param: IPayloadPutEditArticle) => void;
  };
}

const initialState = {
  loading: false,
  data: {
    title: '',
    content: '',
    summary: '',
    categories: [],
    series: [],
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
};

const useEditArticle = (set, get) => ({
  ...initialState,

  actions: {
    setData: (data?: IEditArticleData) => {
      set((state: IEditArticleState) => {
        state.data = data || initialState.data as IEditArticleData;
      }, 'setData');
    },
    setTitle: (title: string) => {
      set((state: IEditArticleState) => {
        state.data.title = title;
      }, 'setTitle');
    },
    setContent: (content: string) => {
      set((state: IEditArticleState) => {
        state.data.content = content;
      }, 'setContent');
    },
    setSummary: (summary: string) => {
      set((state: IEditArticleState) => {
        state.data.summary = summary;
      }, 'setSummary');
    },
    setAudience: (audience?:IEditArticleAudience) => {
      set((state: IEditArticleState) => {
        state.data.audience = audience || {} as IEditArticleAudience;
      }, 'setAudience');
    },
    setMentions: (mentions?:any) => {
      set((state: IEditArticleState) => {
        state.data.mentions = mentions || {};
      }, 'setMentions');
    },
    setCover: (cover?:IArticleCover) => {
      set((state: IEditArticleState) => {
        state.data.coverMedia = cover || {};
      }, 'setCover');
    },
    setCategories: (categories?: ICategory[]) => {
      set((state: IEditArticleState) => {
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
    setSeries: (series?: IEditArticleSeries[]) => {
      set((state: IEditArticleState) => {
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
    putEditArticle: putEditArticle(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useEditArticleStore = createStore<IEditArticleState>(useEditArticle);

export default useEditArticleStore;
