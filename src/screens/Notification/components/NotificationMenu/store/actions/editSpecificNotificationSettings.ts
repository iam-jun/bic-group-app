import notificationApi from '~/api/NotificationApi';
import { INotificationItemMenuStore } from '../index';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { IParamUpdateSpecificNotificationSettings, SpecificNotificationType } from '~/interfaces/INotification';
import useMenuStore from '~/store/entities/menus';

const editNotificationSettings = (set, get) => async (
  targetId: string,
  enable: boolean,
  contentTargetType?: SpecificNotificationType,
) => {
  try {
    const { targetType }: INotificationItemMenuStore = get();
    set((state: INotificationItemMenuStore) => {
      state.enableNotificationSettings = enable;
    }, 'editNotificationSettingsLoading');

    const data: IParamUpdateSpecificNotificationSettings = {
      enable,
      contentType: targetType,
    };
    const response = await notificationApi.editSpecificNotificationSettings(targetId, data);

    if (contentTargetType !== SpecificNotificationType.group) {
      const menu = useMenuStore.getState().menus?.[targetId]?.data || {};
      const newMenu = {
        ...menu,
        isEnableNotifications: enable,
      };
      useMenuStore.getState().actions.addOrUpdateMenus(targetId, newMenu);
    }

    if (response?.meta?.message) {
      showToast({ content: response.meta.message });
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'edit specific noti settings error', err, '\x1b[0m',
    );
    showToast({ content: 'common:text_please_try_again', type: ToastType.ERROR });
  }
};

export default editNotificationSettings;
