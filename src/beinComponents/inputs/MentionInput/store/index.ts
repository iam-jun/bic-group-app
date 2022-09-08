import { createStore, resetStore } from '~/store/utils';
import completeMention from './actions/completeMention';
import runSearch from './actions/runSearch';
import IMentionInputState from './Interface';

const initialState = {
  text: '',
  fullContent: '',
  key: null,
  groupIds: '',
  cursorPosition: -2, // follow MatterMost
  topPosition: 0,
  loading: false,
  data: [],
  tempSelected: {},
};

const mentionInputStore = (set, get) => ({
  ...initialState,
  setGroupIds: (payload: string) => set((state) => {
    state.groupIds = payload;
  }),
  setText: (payload: string) => set((state) => {
    state.text = payload;
  }),
  setFullContent: (payload: string) => set((state) => {
    state.fullContent = payload;
  }),
  setData: (payload: any[]) => set((state) => {
    state.data = payload;
  }),
  setCursorPosition: (payload: number) => set((state) => {
    state.cursorPosition = payload;
  }),
  addTempSelected: (payload: {[x: string]: any}) => set((state) => {
    state.tempSelected = { ...state.tempSelected, ...payload };
  }, 'addTempSelected'),
  doCompleteMention: completeMention(set, get),
  doRunSearch: runSearch(set, get),
  reset: () => resetStore(initialState, set),
});

const useMentionInputStore = createStore<IMentionInputState>(
  'joined-group-tree-store', mentionInputStore,
);

export default useMentionInputStore;
