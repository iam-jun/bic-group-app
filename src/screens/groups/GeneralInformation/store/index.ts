import { IGroupDetailEdit } from '~/interfaces/IGroup';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import editGroupDetail from './actions/editGroupDetail';

export interface IGeneralInformationState extends IBaseState {
  loadingAvatar: boolean;
  loadingCover: boolean;
  actions: {
    setLoadingAvatar: (payload: boolean) => void;
    setLoadingCover: (payload: boolean) => void;
    editGroupDetail: (data: IGroupDetailEdit, callback?: () => void) => void;
  };
}

const initialState: InitStateType<IGeneralInformationState> = {
  loadingAvatar: false,
  loadingCover: false,
};

const generalInformationStore = (set, get) => ({
  ...initialState,
  actions: {
    editGroupDetail: editGroupDetail(set, get),
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
