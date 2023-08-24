import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { ContentType, SpecificNotificationType } from '~/interfaces/INotification';

const NOT_SHOW_DELETE_OPTION_LIST = [
  NOTIFICATION_TYPE.SCHEDULED_MAINTENANCE_DOWNTIME,
  NOTIFICATION_TYPE.CHANGE_LOGS,
];

const NOT_IS_SPECIFIC_NOTIFICATION = [
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL,
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL,
  NOTIFICATION_TYPE.QUIZ_GENERATE_SUCCESSFUL,
  NOTIFICATION_TYPE.QUIZ_GENERATE_UNSUCCESSFUL,
];

export const checkHideDeleteOption = (type: string) => {
  if (!type) return false;
  const index = NOT_SHOW_DELETE_OPTION_LIST.findIndex((item) => item === type);
  return !(index === -1);
};

export const checkIsSpecificNotification = (notiTarget: string, type: string) => {
  const _notiTarget = notiTarget?.toLowerCase?.() || '';
  const isNotSpecific = NOT_IS_SPECIFIC_NOTIFICATION.findIndex((item) => item === type);
  const isSpecificContent = _notiTarget === ContentType.post
   || _notiTarget === ContentType.article || _notiTarget === ContentType.comment
   || _notiTarget === ContentType.childComment;

  return (isNotSpecific === -1) && isSpecificContent;
};

export const getTextFromSpecificNotificationTargetType = (
  type: SpecificNotificationType, enable: boolean,
) => {
  switch (type) {
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
