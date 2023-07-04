import { IPost } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { resetStore, createStore } from '~/store/utils';
import getContentsInSeries from './actions/getContentsInSeries';

export interface RelatedContentsInSeries {
  isLoading: boolean;
  data: IPost[];
}

export interface IRelatedContentsInSeriesState extends IBaseState {
  isLoading: boolean;
  data: IPost[];
  actions: {
    getContentsInSeries: (seriesIds: string[]) => void;
  };
}

const initialState: InitStateType<IRelatedContentsInSeriesState> = {
  isLoading: false,
  data: [],
};

const useRelatedContentsInSeries = (set, get): IRelatedContentsInSeriesState => ({
  ...initialState,
  actions: {
    getContentsInSeries: getContentsInSeries(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useRelatedContentsInSeriesStore = createStore<IRelatedContentsInSeriesState>(useRelatedContentsInSeries);

export default useRelatedContentsInSeriesStore;
