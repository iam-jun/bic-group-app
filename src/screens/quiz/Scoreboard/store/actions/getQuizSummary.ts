import streamApi from '~/api/StreamApi';
import { IScoreboardState } from '../index';
import showToastError from '~/store/helper/showToastError';

const getQuizSummary = (set) => async (contentId: string) => {
  try {
    const response = await streamApi.getQuizSummary(contentId);

    set((state: IScoreboardState) => {
      state.summaryDetail = response?.data;
    }, 'getQuizSummarySuccess');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getQuizSummary error: ', error, '\x1b[0m');
    showToastError(error);
  }
};

export default getQuizSummary;
