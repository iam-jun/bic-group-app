import { IObject } from '~/interfaces/common';
import { IEditArticleAudience } from '~/interfaces/IArticle';
import { IArticleCover } from '~/interfaces/IPost';
import { ISeriesData } from '~/interfaces/ISeries';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import deleteSeries from './actions/deleteSeries';
import getSeriesDetail from './actions/getSeriesDetail';
import postCreateNewSeries from './actions/postCreateNewSeries';

export interface ISeriesState extends IBaseState{
  loading: boolean;
  data: ISeriesData;
  requestings: IObject<boolean>;

  actions?: {
    setData: (data: ISeriesData) => void;
    setTitle: (title: string) => void;
    setSummary: (summary: string) => void;
    setAudience: (audience: IEditArticleAudience) => void;
    setCover: (cover: IArticleCover) => void;
    postCreateNewSeries?: () => void;
    getSeriesDetail: (id: string) => void;
    deleteSeries: (id: string, callbackError: any) => void;
  }

  reset?: () => void;
}

const initialState = {
  loading: false,
  data: {
    title: '',
    summary: '',
    coverMedia: {},
    audience: {
      userIds: [],
      groupIds: [],
    },
  },
  requestings: {},
};

const useSeries = (set, get) => ({
  ...initialState,

  actions: {
    setData: (data: ISeriesData) => {
      set((state: ISeriesState) => {
        state.data = data || initialState.data as ISeriesData;
      }, 'setData');
    },
    setTitle: (title: string) => {
      set((state: ISeriesState) => {
        state.data.title = title;
      }, 'setTitle');
    },
    setSummary: (summary?: string) => {
      set((state: ISeriesState) => {
        state.data.summary = summary;
      }, 'setSummary');
    },
    setAudience: (audience:IEditArticleAudience) => {
      set((state: ISeriesState) => {
        state.data.audience = audience || {} as IEditArticleAudience;
      }, 'setAudience');
    },
    setCover: (cover:IArticleCover) => {
      set((state: ISeriesState) => {
        state.data.coverMedia = cover || {};
      }, 'setCover');
    },
    postCreateNewSeries: postCreateNewSeries(set, get),
    getSeriesDetail: getSeriesDetail(set, get),
    deleteSeries: deleteSeries(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useSeriesStore = createStore<ISeriesState>(useSeries);

export default useSeriesStore;
