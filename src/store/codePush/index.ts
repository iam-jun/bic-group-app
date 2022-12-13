import { Package } from 'react-native-code-push';
import getUpdateMetaData from './actions/getUpdateMetaData';
import sync from './actions/sync';
import { createStore, resetStore } from '~/store/utils';

export interface ICodePushState {
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

const initialState = {
  status: '',
  progress: undefined,
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
