import { mapWorkExperience } from '../../../store/helpler';
import showToastError from '~/store/helper/showToastError';
import { IUserProfileState } from '../../store';
import userApi from '~/api/UserApi';

const deleteWorkExperience = (set, get) => async (
  id: string,
  callback?: () => void,
) => {
  try {
    const userProfileStore: IUserProfileState = get();
    const response = await userApi.deleteWorkExperience(id);

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
    showToastError(err);
  }
};

export default deleteWorkExperience;
