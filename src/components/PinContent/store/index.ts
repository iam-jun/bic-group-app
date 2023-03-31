import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getPinContentsGroup from './actions/getPinContentsGroup';
import updatePinContent from './actions/updatePinContent';

export interface PinContent {
  isLoading: boolean;
  data: string[];
}

export interface IPinContentState extends IBaseState {
  groupPinContent: {
    [idGroup: string]: PinContent;
  };
  actions: {
    updatePinContent: () => void;
    getPinContentsGroup: () => void;
  };
}

const initialState: InitStateType<IPinContentState> = {
  groupPinContent: {},
};

const usePinContent = (set, get): IPinContentState => ({
  ...initialState,
  actions: {
    updatePinContent: updatePinContent(set, get),
    getPinContentsGroup: getPinContentsGroup(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const usePinContentStore = createStore<IPinContentState>(usePinContent);

export default usePinContentStore;
