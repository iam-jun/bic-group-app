import groupApi from '~/api/GroupApi';
import IUserProfileState from '../Interface';

const getCountry = (set) => async () => {
  try {
    const response = await groupApi.getCountry();
    set((state: IUserProfileState) => {
      state.country = response.data;
    }, 'getCountrySuccess');
  } catch (e) {
    console.error('getCountry error:', e);
  }
};

export default getCountry;
