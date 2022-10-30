import {
  createStore, resetStore,
} from '~/store/utils';
import getTrending from './actions/getTrending';
import IBaseState from '../interfaces/IBaseState';
import { IGiphy } from '~/interfaces/IGiphy';
import getSearch from './actions/getSearch';

export interface IGiphyState extends IBaseState {
    loading: boolean;
    data: IGiphy[];
    searchResults: IGiphy[];
    actions:{
      getTrending: () => void;
      getSearch: (id: string) => void;
      clearSearch: () => void;
    }
}

const initialState = {
  data: [],
  searchResults: [],
  loading: false,
};

const giphyStore = (set, get) => ({
  ...initialState,
  actions: {
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
