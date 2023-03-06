import searchTags from './actions/searchTags';
import getTags from './actions/getTags';
import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import { IGetSearchTags } from '~/interfaces/IArticle';

export interface ISelectTagsState extends IBaseState {
  communityIds: string[],
  listTag: {
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
    setListTagLoading: (loading: boolean)=>void;
    setCommunityIds: (communityIds: string[])=>void;
    getTags: (isLoadMore: boolean, params?: IGetSearchTags)=> void;
    searchTags: (params: IGetSearchTags) => void;
  }
}

const initialState = {
  communityIds: [],
  listTag: {
    loading: true,
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

const useSelectTags = (set, get) => ({
  ...initialState,

  actions: {
    setListTagLoading: (loading: boolean) => {
      set((state: ISelectTagsState) => {
        state.listTag.loading = loading;
      }, 'setListTagLoading');
    },
    setCommunityIds: (communityIds: string[]) => {
      set((state: ISelectTagsState) => {
        state.communityIds = communityIds;
      }, 'setCommunityIds');
    },
    getTags: getTags(set, get),
    searchTags: searchTags(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useSelectTagsStore = createStore<ISelectTagsState>(useSelectTags);

export default useSelectTagsStore;
