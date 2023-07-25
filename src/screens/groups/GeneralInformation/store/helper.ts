import groupApi from '~/api/GroupApi';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import { IPayloadPreviewPrivacy } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import useGeneralInformationStore, { TypePrivacyImpact } from '.';

export const previewPrivacy = async (payload: IPayloadPreviewPrivacy) => {
  try {
    const { privacy } = payload?.data || {};

    if (privacy === GroupPrivacyType.OPEN || privacy === GroupPrivacyType.CLOSED) return false;

    const response = await groupApi.previewPrivacy(payload);

    const { affectedInnerGroupsMembershipApproval, badge, defaultGroupSet } = response?.data || {};

    let typePrivacyImpact = null;
    if (privacy === GroupPrivacyType.PRIVATE) {
      if (defaultGroupSet && affectedInnerGroupsMembershipApproval?.length > 0) {
        typePrivacyImpact = TypePrivacyImpact.DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL;
      } else if (affectedInnerGroupsMembershipApproval?.length > 0) {
        typePrivacyImpact = TypePrivacyImpact.MEMBERSHIP_APPROVAL;
      } else if (defaultGroupSet) {
        typePrivacyImpact = TypePrivacyImpact.DEFAULT_GROUP_SET;
      }
    } else if (privacy === GroupPrivacyType.SECRET) {
      if (defaultGroupSet && badge) {
        typePrivacyImpact = TypePrivacyImpact.DEFAULT_GROUP_SET_AND_BADGE;
      } else if (defaultGroupSet) {
        typePrivacyImpact = TypePrivacyImpact.DEFAULT_GROUP_SET;
      } else if (badge) {
        typePrivacyImpact = TypePrivacyImpact.BADGE;
      }
    }

    useGeneralInformationStore.setState((state) => {
      state.typePrivacyImpact = typePrivacyImpact;
      state.affectedInnerGroupsMembershipApproval = affectedInnerGroupsMembershipApproval || [];
      state.badge = badge || null;
      state.defaultGroupSet = defaultGroupSet || null;
      return state;
    });

    if (!typePrivacyImpact) return false;
    return true;
  } catch (error) {
    console.error('previewPrivacy', error);
    showToastError(error);
    throw new Error(error);
  }
};
