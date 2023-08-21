import { ITermState } from '../index';
import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import showToastError from '~/store/helper/showToastError';

const getTermsData = (set, _get) => async (groupId: string) => {
  try {
    const response = await groupApi.getGroupTerms(groupId);
    set((state: ITermState) => {
      state.data[groupId] = { content: response?.data?.content || '' };
    }, 'getTermsData Success');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getTermsData error: ', error, '\x1b[0m');
    if (error?.code === APIErrorCode.Group.TERMS_NOT_FOUND) {
      set((state: ITermState) => {
        state.data[groupId] = { content: '' };
      }, 'getTermsData Error');
      return;
    }
    showToastError(error);
  }
};

export default getTermsData;
