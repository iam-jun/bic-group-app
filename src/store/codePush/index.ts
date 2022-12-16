import { Package } from 'react-native-code-push';
import { IBaseState, InitStateType } from '~/store/interfaces/IBaseState';
import getUpdateMetaData from './actions/getUpdateMetaData';
import sync from './actions/sync';
import { createStore, resetStore } from '~/store/utils';

export interface ICodePushState extends IBaseState{
  status: string;
  progress: {
    receivedBytes: number;
    totalBytes: number;
  };
  currentUpdate: Package;

  actions: {
    sync: () => void;
    getUpdateMetaData: () => void;
  }
}

const initialState: InitStateType<ICodePushState> = {
  status: '',
  progress: undefined,
  currentUpdate: undefined,
};

const codePushStore = (set, get) => ({
  ...initialState,
  actions: {
    getUpdateMetaData: getUpdateMetaData(set, get),
    sync: sync(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useCodePushStore = createStore<ICodePushState>(codePushStore);

export default useCodePushStore;
