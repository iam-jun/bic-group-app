import groupApi from '~/api/GroupApi';
import IUserProfileState from '../Interface';

const getCity = (set) => async () => {
  try {
    const response = await groupApi.getCity();
    set((state: IUserProfileState) => {
      state.city = response.data;
    }, 'getCitySuccess');
  } catch (e) {
    console.error('getCity error:', e);
  }
};

export default getCity;
