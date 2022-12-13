import groupApi from '~/api/GroupApi';
import { mapWorkExperience } from '../../../store/helpler';
import showError from '~/store/helper/showError';
import { IUserProfileState } from '../../store';

const deleteWorkExperience = (set, get) => async (
  id: string,
  callback?: () => void,
) => {
  try {
    const userProfileStore: IUserProfileState = get();
    const response = await groupApi.deleteWorkExperience(id);

    if (response?.data) {
      set((state: IUserProfileState) => {
        state.userWorkExperience = mapWorkExperience(response.data);
      }, 'deleteWorkExperienceSuccess');
      const userId = userProfileStore.data?.id;
      userProfileStore.actions.getUserProfile({ userId, silentLoading: true });
    }

    callback && callback();
  } catch (err) {
    console.error('deleteWorkExperience error: ', err);
    showError(err);
  }
};

export default deleteWorkExperience;
