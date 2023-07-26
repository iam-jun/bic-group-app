import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface IPreviewJoinableGroupState extends IBaseState {
  data: any[];
  loading: boolean;
}

const initialState: InitStateType<IPreviewJoinableGroupState> = {
  data: [],
  loading: false,
};

const previewJoinableGroupStore = (set, _get) => ({
  ...initialState,

  reset: () => resetStore(initialState, set),
});

const usePreviewJoinableGroupStore = createStore<IPreviewJoinableGroupState>(previewJoinableGroupStore);

export default usePreviewJoinableGroupStore;
