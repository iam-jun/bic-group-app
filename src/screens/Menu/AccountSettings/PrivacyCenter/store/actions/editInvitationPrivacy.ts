import showToastError from '~/store/helper/showToastError';
import userApi from '~/api/UserApi';
import { IPersonalInfoVisibilityState } from '../index';
import { INVITATION_PRIVACY_TYPE } from '~/constants/privacyCenter';
import { TrackingEvent } from '~/services/tracking/constants';
import { trackEvent } from '~/services/tracking';

const editInvitationPrivacy = (set, _get) => async (type: INVITATION_PRIVACY_TYPE) => {
  try {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = true;
    }, 'editInvitationPrivacyLoading');
    const params = {
      invitationPrivacy: type,
    };
    set((state: IPersonalInfoVisibilityState) => {
      state.invitationPrivacy = type;
      state.loading = false;
    }, 'editInvitationPrivacySuccess');
    await userApi.editPersonalInfoSettings(params);
    trackEvent({
      event: TrackingEvent.INVITATION_PRIVACY_CHANGED,
      properties: { option: type },
      sendWithUserId: true,
    });
  } catch (e) {
    set((state: IPersonalInfoVisibilityState) => {
      state.loading = false;
    }, 'editInvitationPrivacyError');
    console.error('\x1b[35m🐣️ edit invitation privacy error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default editInvitationPrivacy;
