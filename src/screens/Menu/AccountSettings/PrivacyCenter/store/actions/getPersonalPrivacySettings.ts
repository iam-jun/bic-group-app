import showToastError from '~/store/helper/showToastError';
import userApi from '~/api/UserApi';
import { IPersonalInfoVisibilityState } from '../index';
import { INVITATION_PRIVACY_TYPE, PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';

const getPersonalPrivacySettings = (set, _get) => async () => {
  try {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = true;
    }, 'getPersonalPrivacySettingsLoading');
    const response = await userApi.getPersonalPrivacySettings();
    const { data } = response;
    set((state: IPersonalInfoVisibilityState) => {
      state.visibilityPrivacy = data?.visibilityPrivacy || PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE;
      state.invitationPrivacy = data?.invitationPrivacy || INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT;
      state.loading = false;
    }, 'getPersonalPrivacySettingsSuccess');
  } catch (e) {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = false;
    }, 'getPersonalPrivacySettingsError');
    console.error('\x1b[35m🐣️ get personal privacy settings error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getPersonalPrivacySettings;
