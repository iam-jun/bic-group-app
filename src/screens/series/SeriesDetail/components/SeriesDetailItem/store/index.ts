import IBaseState from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import deleteItemFromSeriesDetail from './actions/deleteItemFromSeriesDetail';

export interface ISeriesDetailItemState extends IBaseState{
  actions?: {
    deleteItemFromSeriesDetail: (seriesId: string, itemId: string) => void;
  }
}

const useSeriesDetailItem = (set, get) => ({
  actions: {
    deleteItemFromSeriesDetail: deleteItemFromSeriesDetail(set, get),
  },
});

const useSeriesDetailItemStore = createStore<ISeriesDetailItemState>(useSeriesDetailItem);

export default useSeriesDetailItemStore;
