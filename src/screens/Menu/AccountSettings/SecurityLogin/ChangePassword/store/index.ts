import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IChangePasswordPayload } from '~/interfaces/IAuth';
import changePassword from './actions/changePassword';

export interface IChangePasswordState extends IBaseState {
  errorText: string;
  loading: boolean;

  actions: {
    setErrorText: (error?: string) => void;
    changePassword: (payload: IChangePasswordPayload) => void;
  }
}

const initialState: InitStateType<IChangePasswordState> = {
  errorText: '',
  loading: false,
};

const useChangePassword = (set, get) => ({
  ...initialState,
  actions: {
    setErrorText: (error?: string) => {
      set((state: IChangePasswordState) => {
        state.errorText = error || initialState.errorText;
      }, 'setErrorText');
    },
    changePassword: changePassword(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useChangePasswordStore = createStore<IChangePasswordState>(useChangePassword);

export default useChangePasswordStore;
