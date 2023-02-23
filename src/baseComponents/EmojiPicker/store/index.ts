import Fuse from 'fuse.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  resetStore,
  createStore,
} from '~/store/utils';
import {
  getNumberOfColumns,
  getRenderableEmojis, measureEmojiSections, searchEmojis, selectEmojisByName, selectEmojisBySection,
} from './utils';
import { dimension } from '~/theme';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';

export interface IEmojiPickerState extends IBaseState {
  data: any[];
  fuse: any;
  filteredData: any[]|null;
  recentlyData: any[];
  emojiSectionIndexByOffset: any[];
  currentSectionIndex: number;
  actions: {
    addToRecently: (emoji: string) => void;
    buildEmojis: () => void;
    search: (term: string) => void,
    resetData: () => void;
    setCurrentSectionIndex: (index: number) => void;
  }
}

const initialState: InitStateType<IEmojiPickerState> = {
  data: [],
  filteredData: null,
  recentlyData: [],
  fuse: null,
  emojiSectionIndexByOffset: [],
  currentSectionIndex: 0,
};

const emojiPickerStore = (set, get) => ({
  ...initialState,
  actions: {
    addToRecently: (emoji: string) => {
      const { actions } = get();
      const numberOfColumns = getNumberOfColumns(dimension.deviceWidth);

      set((state) => {
        const { recentlyData } = state;
        const newData = recentlyData.filter((item) => item !== emoji);

        if (newData.length >= numberOfColumns) newData.pop();

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

      const fuse = new Fuse(emojis, options);

      const emojisBySection = selectEmojisBySection(recentlyData);
      const renderableEmojis = getRenderableEmojis(emojisBySection, dimension.deviceWidth);
      set((state) => {
        state.data = renderableEmojis;
        state.fuse = fuse;
        if (state.emojiSectionIndexByOffset.length === 0) {
          state.emojiSectionIndexByOffset = measureEmojiSections(renderableEmojis);
        }
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
        state.filteredData = null;
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
