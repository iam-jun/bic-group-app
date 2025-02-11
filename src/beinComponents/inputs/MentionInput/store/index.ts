import { createStore, resetStore } from '~/store/utils';
import completeMention from './actions/completeMention';
import runSearch from './actions/runSearch';
import IMentionInputState from './Interface';

const initialState = {
  fullContent: '',
  key: null,
  cursorPosition: -2, // follow MatterMost
  topPosition: 0,
  loading: false,
  data: [],
  tempSelected: {},
};

const mentionInputStore = (set, get) => ({
  ...initialState,
  setFullContent: (payload: string) => set((state) => {
    state.fullContent = payload;
  }, 'setFullContent'),
  setData: (payload: any[]) => set((state) => {
    state.data = payload;
  }, 'setData'),
  addTempSelected: (payload: {[x: string]: any}) => set((state) => {
    state.tempSelected = { ...state.tempSelected, ...payload };
  }, 'addTempSelected'),
  doCompleteMention: completeMention(set, get),
  doRunSearch: runSearch(set, get),
  reset: () => resetStore(initialState, set),
});

const useMentionInputStore = createStore<IMentionInputState>(mentionInputStore);

export default useMentionInputStore;
