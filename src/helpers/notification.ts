import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { SpecificNotificationType } from '~/interfaces/INotification';

const NOT_SHOW_DELETE_OPTION_LIST = [
  NOTIFICATION_TYPE.SCHEDULED_MAINTENANCE_DOWNTIME,
  NOTIFICATION_TYPE.CHANGE_LOGS,
];

export const checkHideDeleteOption = (type: string) => {
  if (!type) return false;
  const index = NOT_SHOW_DELETE_OPTION_LIST.findIndex((item) => item === type);
  return !(index === -1);
};

export const getTextFromSpecificNotificationTargetType = (
  type: SpecificNotificationType, enable: boolean,
) => {
  switch (type) {
    case SpecificNotificationType.community:
      return !enable ? 'notification:text_turn_on_noti_for_community'
        : 'notification:text_turn_off_noti_for_community';
    case SpecificNotificationType.group:
      return !enable ? 'notification:text_turn_on_noti_for_group'
        : 'notification:text_turn_off_noti_for_group';
    case SpecificNotificationType.post:
      return !enable ? 'notification:text_turn_on_noti_for_post'
        : 'notification:text_turn_off_noti_for_post';
    case SpecificNotificationType.article:
      return !enable ? 'notification:text_turn_on_noti_for_article'
        : 'notification:text_turn_off_noti_for_article';
    default:
      return '';
  }
};
