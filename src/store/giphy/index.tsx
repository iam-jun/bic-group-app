import {
  createStore, resetStore,
} from '~/store/utils';
import getTrending from './actions/getTrending';
import IBaseState from '../interfaces/IBaseState';
import { IGiphy } from '~/interfaces/IGiphy';
import getSearch from './actions/getSearch';
import getAPIKey from './actions/getAPIKey';

export interface IGiphyState extends IBaseState {
    apiKey: string;
    loading: boolean;
    data: IGiphy[];
    searchResults: IGiphy[];
    actions:{
      getAPIKey: () => void;
      getTrending: () => void;
      getSearch: (id: string) => void;
      clearSearch: () => void;
    }
}

const initialState = {
  apiKey: '',
  data: [],
  searchResults: [],
  loading: false,
};

const giphyStore = (set, get) => ({
  ...initialState,
  actions: {
    getAPIKey: getAPIKey(set, get),
    getSearch: getSearch(set, get),
    getTrending: getTrending(set, get),
    clearSearch: () => {
      set((state) => {
        state.searchResults = [];
      });
    },
  },
  reset: () => resetStore(initialState, set),
});

const useGiphyStore = createStore<IGiphyState>(giphyStore);

export default useGiphyStore;
