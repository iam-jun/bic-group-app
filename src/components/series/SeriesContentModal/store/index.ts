import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import getSeriesByItems from './action/getSeriesByItems';
import { IGetSeries } from '~/interfaces/ISeries';

export interface ISeriesContentModalState extends IBaseState {
    series: {
        data: IPost[];
        loading: boolean;
        hasNextPage: boolean;
    };

    actions: {
        getSeriesByItems: (payload: IGetSeries) => void;
    };
}

const initState: InitStateType<ISeriesContentModalState> = {
  series: {
    data: [],
    loading: false,
    hasNextPage: true,
  },
};

const seriesContentModalStore = (set, get) => ({
  ...initState,

  actions: {
    getSeriesByItems: getSeriesByItems(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useSeriesContentModalStore = createStore<ISeriesContentModalState>(seriesContentModalStore);

export default useSeriesContentModalStore;
