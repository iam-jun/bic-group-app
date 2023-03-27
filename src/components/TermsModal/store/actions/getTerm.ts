import { ITermState } from '../index';
import groupApi from '~/api/GroupApi';

const getTerms = (set, get) => async (groupId: string) => {
  try {
    const { actions } = get();
    set((state: ITermState) => {
      state.loading = true;
    }, 'getTerms');

    const response = await groupApi.getGroupTerms(groupId);
    set((state: ITermState) => {
      state.loading = false;
      state.termContent = response?.data?.content || '';
    }, 'getTerms Success');
    actions.setIsOpen(true);
  } catch (e) {
    console.error('\x1b[31m🐣️ action getTerms error: ', e, '\x1b[0m');
    set((state: ITermState) => {
      state.loading = false;
      state.termContent = '';
    }, 'getTerms Error');
  }
};

export default getTerms;
