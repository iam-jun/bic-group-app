import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IPost } from '~/interfaces/IPost';
import getDraftQuiz from './actions/getDraftQuiz';

export interface IDraftQuizState extends IBaseState {
    draftQuiz: {
        data: IPost[];
        loading: boolean;
        refreshing: boolean,
        hasNextPage: boolean,
        endCursor: string,
    },

    actions: {
        getDraftQuiz: (isRefresh?: boolean) => void;
    }
}

const initState: InitStateType<IDraftQuizState> = {
    draftQuiz: {
        data: [],
        loading: false,
        refreshing: false,
        hasNextPage: true,
        endCursor: '',
    },
};

const draftQuizStore = (set, get) => ({
    ...initState,

    actions: {
        getDraftQuiz: getDraftQuiz(set, get),
    },

    reset: () => resetStore(initState, set),
});

const useDraftQuizStore = createStore<IDraftQuizState>(draftQuizStore);
export default useDraftQuizStore;
