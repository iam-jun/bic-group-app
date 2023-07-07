import streamApi from '~/api/StreamApi';
import { IDraftQuizState } from '../index';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';

const getDraftQuiz = (set, get) => async (isRefresh?: boolean) => {
    const { draftQuiz }: IDraftQuizState = get();
    const {
        data: listDraftQuiz,
        loading,
        endCursor,
    } = draftQuiz || {};
    const endCursorParams = isRefresh ? null : endCursor;

    if (loading) return;

    try {
        set((state: IDraftQuizState) => {
            if (isRefresh) {
                state.draftQuiz.refreshing = true;
            } else {
                state.draftQuiz.loading = true;
            }
        }, 'getDraftQuiz');

        const response = await streamApi.getDraftQuiz({ endCursor: endCursorParams });
        console.log('log response: ', response)

        const newDraftQuizzes
        = isRefresh ? response?.data?.list || [] : listDraftQuiz?.concat(response?.data?.list || []);

        set((state: IDraftQuizState) => {
            state.draftQuiz.data = newDraftQuizzes;
            state.draftQuiz.hasNextPage = response?.data?.meta?.hasNextPage;
            state.draftQuiz.endCursor = response?.data?.meta?.endCursor;
            state.draftQuiz.refreshing = false;
            state.draftQuiz.loading = false;
        }, 'getDraftQuiz Success');
        usePostsStore.getState().actions.addToPosts({ data: newDraftQuizzes });
    } catch (e) {
        set((state: IDraftQuizState) => {
            state.draftQuiz.refreshing = false;
            state.draftQuiz.endCursor = null;
            state.draftQuiz.loading = false;
            state.draftQuiz.hasNextPage = false;
        }, 'getDraftQuiz Error');
        console.error('\x1b[31m🐣️ action getDraftQuiz error: ', e, '\x1b[0m');
        showToastError(e);
    }
};

export default getDraftQuiz;
