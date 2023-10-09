import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getTags from './actions/getTags';

export interface ISearchFilterTagsState extends IBaseState {
  data: {
    key: string;
    loading: boolean;
    hasNextPage: boolean;
    tags: string[];
  };
  selected: string[];
  actions: {
    updateSelectedTags: (tags: string[]) => void;
    getTags: (key: string, isRefresh?: boolean) => void;
  };
}

export const initState: InitStateType<ISearchFilterTagsState> = {
  data: {
    key: '',
    loading: false,
    hasNextPage: true,
    tags: [],
  },
  selected: [],
};

const searchFilterTagsStore = (set, get): ISearchFilterTagsState => ({
  ...initState,
  actions: {
    updateSelectedTags: (tags: string[]) => {
      set((state: ISearchFilterTagsState) => {
        state.selected = [...tags];
      }, 'updateSelectedTags');
    },
    getTags: getTags(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useSearchFilterTagsStore = createStore<ISearchFilterTagsState>(
  searchFilterTagsStore,
);

export default useSearchFilterTagsStore;
