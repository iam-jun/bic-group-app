import searchSeries from './actions/searchSeries';
import getSeries from './actions/getSeries';
import { createStore, resetStore } from '~/store/utils';
import { IGetSeries } from '~/interfaces/ISeries';
import IBaseState from '~/store/interfaces/IBaseState';

export interface ICreateArticleSeriesState extends IBaseState {
  listSeries: {
    loading: boolean;
    items: any;
    hasNextPage: boolean;
  },
  search: {
    key: string;
    loading: boolean;
    items: any;
  },
  actions: {
    getSeries: (isLoadMore: boolean, params?: IGetSeries)=> void;
    searchSeries: (params: IGetSeries) => void;
  }
}

const initialState = {
  listSeries: {
    loading: false,
    items: undefined,
    hasNextPage: true,
  },
  search: {
    key: '',
    loading: false,
    items: [],
  },
  selecting: [],
};

const useCreateArticleSeries = (set, get) => ({
  ...initialState,

  actions: {
    getSeries: getSeries(set, get),
    searchSeries: searchSeries(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useCreateArticleSeriesStore = createStore<ICreateArticleSeriesState>(useCreateArticleSeries);

export default useCreateArticleSeriesStore;
