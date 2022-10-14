import IBaseState from '~/store/interfaces/IBaseState';

interface IEmojiPickerState extends IBaseState {
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
