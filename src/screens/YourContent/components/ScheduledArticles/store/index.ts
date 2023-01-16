import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import getScheduleArticles from './actions/getScheduleArticles';
import { IPayloadGetScheduleArticles } from '~/interfaces/IArticle';

export interface IScheduleArticlesState extends IBaseState {
    scheduleArticles: {
        data: IPost[];
        loading: boolean;
        refreshing: boolean,
        total: number,
        hasNextPage: boolean,
    },

    actions: {
        getScheduleArticles: (payload: IPayloadGetScheduleArticles) => void;
    };
}

const initState: InitStateType<IScheduleArticlesState> = {
  scheduleArticles: {
    data: [],
    loading: false,
    refreshing: false,
    total: 0,
    hasNextPage: true,
  },
};

const scheduleArticlesStore = (set, get) => ({
  ...initState,

  actions: {
    getScheduleArticles: getScheduleArticles(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useScheduleArticlesStore = createStore<IScheduleArticlesState>(scheduleArticlesStore);

export default useScheduleArticlesStore;
