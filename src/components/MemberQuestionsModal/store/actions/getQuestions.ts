import groupApi from '~/api/GroupApi';
import { IMemberQuestionsState } from '../index';
import showToastError from '~/store/helper/showToastError';

const getQuestions = (set, _get) => async (groupId: string, callBackError: ()=> void) => {
  try {
    set((state: IMemberQuestionsState) => {
      state.loading = true;
      state.isOpen = true;
    }, 'getQuestions');
    const response = await groupApi.getMembershipQuestions(groupId);
    if (response?.data?.length > 0) {
      const newIds = response.data.map((item) => item.id);
      const newItems = response.data.reduce(
        (accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: currentItem,
        }),
        {},
      );

      const defaultAnswers = response.data.reduce(
        (accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: {
            questionId: currentItem.id,
            answer: null,
          },
        }),
        {},
      );

      set((state: IMemberQuestionsState) => {
        state.loading = false;
        state.questions = newItems;
        state.answers = defaultAnswers;
        state.ids = newIds;
      }, 'getQuestionsSuccess');
      return;
    }

    setTimeout(
      () => {
        set((state: IMemberQuestionsState) => {
          state.loading = false;
          state.questions = {};
          state.ids = [];
          state.isOpen = false;
        }, 'getMembershipQuestionsErrorNotFound');
        callBackError();
      }, 1000,
    );
  } catch (error) {
    console.error('\x1b[31m🐣️ action getTerms error: ', error, '\x1b[0m');
    set((state: IMemberQuestionsState) => {
      state.loading = false;
      state.questions = {};
      state.ids = [];
      state.isOpen = false;
    }, 'getMembershipQuestionsError');
    showToastError(error);
  }
};
export default getQuestions;
