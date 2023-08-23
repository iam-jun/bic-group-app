import { IMembershipPolicySettingsState } from '../index';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';

const getSettings = (set, _get) => async (groupId: string) => {
  try {
    const response = await groupApi.getSettings(groupId);

    set((state: IMembershipPolicySettingsState) => {
      state.data = response?.data;
    }, 'getSettings success');
  } catch (e) {
    console.error('\x1b[31m🐣️ action getSettings error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getSettings;
