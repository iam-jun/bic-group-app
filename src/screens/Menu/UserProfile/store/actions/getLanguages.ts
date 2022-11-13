import groupApi from '~/api/GroupApi';
import { IUserProfileState } from '../../store';

const getLanguages = (set) => async () => {
  try {
    const response = await groupApi.getLanguages();
    set((state: IUserProfileState) => {
      state.languages = response.data;
    }, 'getLanguagesSuccess');
  } catch (e) {
    console.error('getLanguages error:', e);
  }
};

export default getLanguages;
