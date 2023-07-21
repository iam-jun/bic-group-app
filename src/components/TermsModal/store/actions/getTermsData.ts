import { ITermState } from '../index';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';

const getTermsData = (set, _get) => async (groupId: string) => {
  try {
    const response = await groupApi.getGroupTerms(groupId);
    set((state: ITermState) => {
      state.data[groupId] = { content: response?.data?.content || '' };
    }, 'getTermsData Success');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getTermsData error: ', error, '\x1b[0m');
    showToastError(error);
  }
};

export default getTermsData;
