import { mapWorkExperience } from '../../../store/helpler';
import { IUserProfileState } from '../../store';
import userApi from '~/api/UserApi';

const getWorkExperience = (set) => async (payload: string) => {
  try {
    const response = await userApi.getWorkExperience(payload);
    set((state: IUserProfileState) => {
      state.userWorkExperience = mapWorkExperience(response.data);
    }, 'getWorkExperienceSuccess');
  } catch (err) {
    console.error('getWorkExperience error: ', err);
  }
};

export default getWorkExperience;
