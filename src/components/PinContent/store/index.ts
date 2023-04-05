import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getPinContentsGroup from './actions/getPinContentsGroup';
import updatePinContent from './actions/updatePinContent';
import { IPost } from '~/interfaces/IPost';

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
    getPinContentsGroup: (id: string) => void;
    initDataPinContentsGroup: (id: string) => void;
    resetDataPinContentsGroup: (id: string) => void;
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
    initDataPinContentsGroup: (id: string) => {
      set((state: IPinContentState) => {
        state.groupPinContent[id] = {
          isLoading: false,
          data: [],
        };
      }, 'initDataPinContentsGroup');
    },
    resetDataPinContentsGroup: (id: string) => {
      set((state) => {
        state.groupPinContent[id] = {};
      }, 'resetDataPinContentsGroup');
    },
  },
  reset: () => resetStore(initialState, set),
});

const usePinContentStore = createStore<IPinContentState>(usePinContent);

export default usePinContentStore;
