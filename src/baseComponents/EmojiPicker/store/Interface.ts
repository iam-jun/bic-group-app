import IBaseStore from '~/store/interfaces/IBaseStore';

interface IEmojiPickerState extends IBaseStore {
  data: any[],
  filteredData: any[],
  actions: {
    buildEmojis: () => void;
    search: () => void,
  }
}

export default IEmojiPickerState;
