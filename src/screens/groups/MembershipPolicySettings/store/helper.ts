import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { IPayloadPreviewSettings } from '~/interfaces/IGroup';
import useMembershipPolicySettingsStore from '.';

export const previewSettings = async (payload: IPayloadPreviewSettings) => {
  try {
    const response = await groupApi.previewSettings(payload);

    useMembershipPolicySettingsStore.setState((state) => {
      state.affectedInnerGroups = response?.data?.affectedInnerGroups || [];
      return state;
    });

    if (response?.data?.affectedInnerGroups?.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('previewSettings', error);
    showToastError(error);
    throw new Error(error);
  }
};
