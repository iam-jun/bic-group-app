import IBaseStore from '~/store/interfaces/IBaseStore';

interface IEmojiPickerState extends IBaseStore {
  data: any[],
  filteredData: any[],
  currentSectionIndex: number;
  actions: {
    buildEmojis: () => void;
    search: (term: string) => void,
    resetData: () => void;
    setCurrentSectionIndex: (index: number) => void;
  }
}

export default IEmojiPickerState;
