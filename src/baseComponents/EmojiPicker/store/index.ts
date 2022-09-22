import Fuse from 'fuse.js';
import {
  resetStore,
  createStore,
} from '~/store/utils';
import { getRenderableEmojis, selectEmojisByName, selectEmojisBySection } from './utils';
import { dimension } from '~/theme';
import IEmojiPickerState from './Interface';

const initialState = {
  data: [],
  filteredData: [],
  fuse: null,
};

const emojiPickerStore = (set, _get) => ({
  ...initialState,
  actions: {
    buildEmojis: async () => {
      const emojis = selectEmojisByName();
      const options = {
        shouldSort: false,
        ignoreLocation: true,
        includeMatches: true,
        findAllMatches: true,
      };

      const list = emojis.length ? emojis : [];
      const fuse = new Fuse(list, options);

      const emojisBySection = selectEmojisBySection();
      const renderableEmojis = getRenderableEmojis(emojisBySection, dimension.deviceWidth);
      set((state) => {
        state.data = renderableEmojis;
        state.fuse = fuse;
      }, 'buildEmojis');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useEmojiPickerStore = createStore<IEmojiPickerState>(emojiPickerStore);

export default useEmojiPickerStore;
