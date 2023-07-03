import { isEmpty } from 'lodash';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import usePostsContainingVideoInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useUserBadge from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';
import { parseSafe } from '~/utils/common';

const handleNotiBackground = (_set, _get) => (remoteMessage: any) => {
  const extraData = remoteMessage?.data?.extraData || {};
  const newExtraData = typeof extraData === 'string' ? parseSafe(extraData) : {};

  if (!isEmpty(newExtraData)) {
    const { type } = newExtraData;
    if (type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
      || type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL) {
      usePostsContainingVideoInProgressStore.getState().actions.updatePosts(newExtraData);
    }
    if (type === NOTIFICATION_TYPE.CHANGE_USER_BADGE_COLLECTION) {
      useUserBadge.getState().actions.getOwnedBadges();
    }
  }
};

export default handleNotiBackground;
