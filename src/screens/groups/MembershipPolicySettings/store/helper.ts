import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { IPayloadPreviewSettings } from '~/interfaces/IGroup';
import useMembershipPolicySettingsStore from '.';

export const previewSettings = async (payload: IPayloadPreviewSettings) => {
  try {
    const response = await groupApi.previewSettings(payload);

    useMembershipPolicySettingsStore.setState((state) => {
      state.effectedInnerGroups = response?.data?.effectedInnerGroups || [];
      return state;
    });

    if (response?.data?.effectedInnerGroups?.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('previewSettings', error);
    showToastError(error);
    throw new Error(error);
  }
};
