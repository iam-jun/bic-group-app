import APIErrorCode from '~/constants/apiErrorCode';
import { ITermState } from '../index';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';

const getTerms = (set, _get) => async (groupId: string, callBackError: ()=> void) => {
  try {
    set((state: ITermState) => {
      state.loading = true;
      state.isOpen = true;
    }, 'getTerms');

    const response = await groupApi.getGroupTerms(groupId);
    set((state: ITermState) => {
      state.loading = false;
      state.isOpen = true;
      state.termContent = response?.data?.content || '';
    }, 'getTerms Success');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getTerms error: ', error, '\x1b[0m');
    if (error?.code === APIErrorCode.Group.TERMS_NOT_FOUND) {
      setTimeout(
        () => {
          set((state: ITermState) => {
            state.loading = false;
            state.termContent = '';
            state.isOpen = false;
          }, 'getTerms Error');
          callBackError();
        }, 1000,
      );
      return;
    }
    set((state: ITermState) => {
      state.loading = false;
      state.termContent = '';
      state.isOpen = false;
    }, 'getTerms Error');
    showToastError(error);
  }
};

export default getTerms;
