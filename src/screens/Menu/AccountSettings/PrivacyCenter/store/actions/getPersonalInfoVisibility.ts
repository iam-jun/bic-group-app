import showToastError from '~/store/helper/showToastError';
import userApi from '~/api/UserApi';
import { IPersonalInfoVisibilityState } from '../index';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';

const getPersonalInfoVisibility = (set, _get) => async () => {
  try {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = true;
    }, 'getPersonalInfoVisibilityLoading');
    const response = await userApi.getVisibilityPrivacy();
    const { data } = response;
    set((state: IPersonalInfoVisibilityState) => {
      state.visibilityPrivacy = data?.visibilityPrivacy || PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE;
      state.loading = false;
    }, 'getPersonalInfoVisibilitySuccess');
  } catch (e) {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = false;
    }, 'getPersonalInfoVisibilityError');
    console.error('\x1b[35m🐣️ get personal information visibility error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getPersonalInfoVisibility;
