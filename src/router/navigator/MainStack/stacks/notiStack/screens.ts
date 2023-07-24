import Notification from '~/screens/Notification';
import ScheduledMaintenance from '~/screens/Notification/ScheduledMaintenance';
import ChangeLogs from '~/screens/Notification/ChangeLogs';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import NotificationSettings from '~/screens/Notification/NotiSettings';
import NotiSettingDetail from '~/screens/Notification/NotiSettings/NotiSettingDetail';

const notiScreens = {
  notification: Notification,
  'not-select-notification': NoNotificationFound,
  'noti-maintenance-page': ScheduledMaintenance,
  'noti-change-logs-page': ChangeLogs,
  'noti-settings': NotificationSettings,
  'noti-setting-detail': NotiSettingDetail,
};

export default notiScreens;
