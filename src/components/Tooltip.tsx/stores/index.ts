import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

interface ViewPosition {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface IScreenTooltip {
  id: string;
  isShow: boolean;
  position: ViewPosition;
}

interface IAllScreen {
  [screenId: string]: IScreenTooltip;
}

export interface ITooltipState extends IBaseState {
  allScreen: IAllScreen;

  actions: {
    setUpScreenTooltip: (screenId: string) => void;
    showTooltip: (screenId: string) => void;
    hideTooltip: (screenId: string) => void;
    setViewPosition: (screenId: string, position:ViewPosition) => void;
  }
}

const initialState: InitStateType<ITooltipState> = {
  allScreen: {},
};

const tooltipStore = (set, _get) => ({
  ...initialState,

  actions: {
    setUpScreenTooltip: (screenId: string) => {
      set((state: ITooltipState) => {
        state.allScreen[screenId] = {
          id: screenId,
          isShow: false,
          position: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
        };
      }, `setUpScreenTooltip_${screenId}`);
    },
    showTooltip: (screenId: string) => {
      set((state: ITooltipState) => {
        state.allScreen[screenId].isShow = true;
      }, `showTooltip_${screenId}`);
    },
    hideTooltip: (screenId: string) => {
      set((state: ITooltipState) => {
        state.allScreen[screenId].isShow = false;
      }, `hideTooltip_${screenId}`);
    },
    setViewPosition: (screenId: string, position:ViewPosition) => {
      set((state: ITooltipState) => {
        const oldPosition = !!state.allScreen[screenId]?.position ? state.allScreen[screenId].position : {};
        state.allScreen[screenId].position = {
          ...oldPosition,
          ...position,
        };
      }, `setViewPosition_${screenId}`);
    },
  },

  reset: () => resetStore(initialState, set),
});

const useTooltip = createStore<ITooltipState>(tooltipStore);

export default useTooltip;
