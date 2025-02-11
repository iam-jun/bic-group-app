import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import getSeriesContent from './action/getSeriesContent';

export interface ISeriesContentModalState extends IBaseState {
    series: {
      data: IPost[];
      loading: boolean;
    };

    actions: {
      getSeriesContent: (contentId: string) => void;
    };
}

const initState: InitStateType<ISeriesContentModalState> = {
  series: {
    data: [],
    loading: false,
  },
};

const seriesContentModalStore = (set, get) => ({
  ...initState,

  actions: {
    getSeriesContent: getSeriesContent(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useSeriesContentModalStore = createStore<ISeriesContentModalState>(seriesContentModalStore);

export default useSeriesContentModalStore;
