import Fuse from 'fuse.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  resetStore,
  createStore,
} from '~/store/utils';
import {
  getRenderableEmojis, searchEmojis, selectEmojisByName, selectEmojisBySection,
} from './utils';
import { dimension } from '~/theme';
import IEmojiPickerState from './Interface';

const initialState = {
  data: [],
  filteredData: [],
  recentlyData: [],
  fuse: null,
  currentSectionIndex: 0,
};

const emojiPickerStore = (set, get) => ({
  ...initialState,
  actions: {
    addToRecently: (emoji: string) => {
      const { actions } = get();

      set((state) => {
        const { recentlyData } = state;
        const newData = recentlyData.filter((item) => item !== emoji);

        if (newData.length > 6) newData.shift();

        state.recentlyData = [emoji, ...newData];
      });

      actions.buildEmojis();
    },
    setCurrentSectionIndex: (index: number) => {
      set((state) => {
        state.currentSectionIndex = index;
      });
    },
    buildEmojis: async () => {
      const { recentlyData } = get();
      const emojis = selectEmojisByName();
      const options = {
        shouldSort: false,
        ignoreLocation: true,
        includeMatches: true,
        findAllMatches: true,
      };

      const list = emojis.length ? emojis : [];
      const fuse = new Fuse(list, options);

      const emojisBySection = selectEmojisBySection(recentlyData);
      const renderableEmojis = getRenderableEmojis(emojisBySection, dimension.deviceWidth);
      set((state) => {
        state.data = renderableEmojis;
        state.fuse = fuse;
      }, 'buildEmojis');
    },
    search: (term: string) => {
      const { fuse } = get();
      const filteredData = searchEmojis(fuse, term);
      set((state) => {
        state.filteredData = filteredData;
      });
    },
    resetData: () => {
      set((state) => {
        state.filteredData = [];
        state.currentSectionIndex = 0;
      });
    },
  },
  reset: () => resetStore(initialState, set),
});

const useEmojiPickerStore = createStore<IEmojiPickerState>(emojiPickerStore, {
  persist: {
    name: 'EmojiStorage',
    getStorage: () => AsyncStorage,
    partialize: (state) => ({ recentlyData: state.recentlyData }),
  },
});

export default useEmojiPickerStore;
