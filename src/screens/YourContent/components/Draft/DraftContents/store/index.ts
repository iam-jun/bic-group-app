import { createStore, resetStore } from '~/store/utils';
import { IPayloadGetDraftContents, IPost } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getDraftContents from './actions/getDraftContents';

export interface IDraftContentsState extends IBaseState {
  posts: IPost[]
  hasNextPage: boolean
  loading: boolean
  refreshing: boolean
  total: number
  actions:{
    getDraftContents: (payload: IPayloadGetDraftContents) => void;
  }
}

const initState: InitStateType<IDraftContentsState> = {
  posts: [],
  hasNextPage: true,
  loading: false,
  refreshing: false,
  total: 0,
};

const draftContentsStore = (set, get): IDraftContentsState => ({
  ...initState,
  actions: {
    getDraftContents: getDraftContents(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useDraftContentsStore = createStore<IDraftContentsState>(draftContentsStore);

export default useDraftContentsStore;
