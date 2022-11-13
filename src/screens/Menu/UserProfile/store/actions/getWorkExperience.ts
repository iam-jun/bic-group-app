import groupApi from '~/api/GroupApi';
import { mapWorkExperience } from '../../../store/helpler';
import { IUserProfileState } from '../../store';

const getWorkExperience = (set) => async (payload: string) => {
  try {
    const response = await groupApi.getWorkExperience(payload);
    set((state: IUserProfileState) => {
      state.userWorkExperience = mapWorkExperience(response.data);
    }, 'getWorkExperienceSuccess');
  } catch (err) {
    console.error('getWorkExperience error: ', err);
  }
};

export default getWorkExperience;
