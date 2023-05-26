import Notification from '~/screens/Notification';
import ScheduledMaintenance from '~/screens/Notification/ScheduledMaintenance';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';

const notiScreens = {
  notification: Notification,
  'not-select-notification': NoNotificationFound,
  'noti-maintenance-page': ScheduledMaintenance,
};

export default notiScreens;
