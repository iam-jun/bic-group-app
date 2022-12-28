import IBaseState from '~/store/interfaces/IBaseState';

interface IEmojiPickerState extends IBaseState {
  data: any[],
  filteredData: any[],
  currentSectionIndex: number;
  actions: {
    addToRecently: (emoji: string) => void;
    buildEmojis: () => void;
    search: (term: string) => void,
    resetData: () => void;
    setCurrentSectionIndex: (index: number) => void;
  }
}

export default IEmojiPickerState;
