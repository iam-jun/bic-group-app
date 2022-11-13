import groupApi from '~/api/GroupApi';
import { mapWorkExperience } from '../../../store/helpler';
import { IAccountSettingsState } from '../../store';

const getMyWorkExperience = (set) => async () => {
  try {
    const response = await groupApi.getMyWorkExperience();
    set((state: IAccountSettingsState) => {
      state.myWorkExperience = mapWorkExperience(response.data);
    }, 'getMyWorkExperienceSuccess');
  } catch (err) {
    console.error('getMyWorkExperience error:', err);
  }
};

export default getMyWorkExperience;
