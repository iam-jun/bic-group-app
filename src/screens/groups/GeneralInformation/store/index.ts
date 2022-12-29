import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';

export interface IGeneralInformationState extends IBaseState {
  loadingAvatar: boolean;
  loadingCover: boolean;
  actions: {
    setLoadingAvatar: (payload: boolean) => void;
    setLoadingCover: (payload: boolean) => void;
  };
}

const initialState: InitStateType<IGeneralInformationState> = {
  loadingAvatar: false,
  loadingCover: false,
};

const generalInformationStore = (set) => ({
  ...initialState,
  actions: {
    setLoadingAvatar: (payload: boolean) => {
      set((state: IGeneralInformationState) => {
        state.loadingAvatar = payload;
      }, 'setLoadingAvatar');
    },
    setLoadingCover: (payload: boolean) => {
      set((state: IGeneralInformationState) => {
        state.loadingCover = payload;
      }, 'setLoadingCover');
    },
  },
});

const useGeneralInformationStore = createStore<IGeneralInformationState>(generalInformationStore);

export default useGeneralInformationStore;
