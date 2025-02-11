import showToastError from '~/store/helper/showToastError';
import userApi from '~/api/UserApi';
import { IPersonalInfoVisibilityState } from '../index';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';
import { trackEvent } from '~/services/tracking';
import { TrackingEvent } from '~/services/tracking/constants';

const editPersonalInfoVisibility = (set, _get) => async (type: PERSONAL_INFORMATION_VISIBILITY_TYPE) => {
  try {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = true;
    }, 'editPersonalInfoVisibilityLoading');
    const params = {
      visibilityPrivacy: type,
    };
    set((state: IPersonalInfoVisibilityState) => {
      state.visibilityPrivacy = type;
      state.loading = false;
    }, 'editPersonalInfoVisibilitySuccess');
    await userApi.editPersonalInfoSettings(params);
    trackEvent({
      event: TrackingEvent.PERSONAL_PRIVACY_CHANGED,
      properties: { option: type },
      sendWithUserId: true,
    });
  } catch (e) {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = false;
    }, 'editPersonalInfoVisibilityError');
    console.error('\x1b[35m🐣️ edit personal information visibility error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default editPersonalInfoVisibility;
