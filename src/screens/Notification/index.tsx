import { useIsFocused } from '@react-navigation/native';

import i18next from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { BottomListItemProps } from '~/components/BottomList/BottomListItem';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { notificationMenuData } from '~/screens/Notification/constants';
import modalActions from '~/storeRedux/modal/actions';
import notificationsActions from '../../storeRedux/notification/actions';
import { MEMBER_TABS } from '../communities/CommunityMembers';
import { MEMBER_TAB_TYPES } from '../communities/constants';
import ScrollableTabBar from './components/ScrollableTabBar';

const Notification = () => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const isFocused = useIsFocused();

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(
    () => {
      if (isFocused) {
        dispatch(notificationsActions.markAsSeenAll());
      }
    }, [isFocused],
  );

  const onPressFilterItem = (index: number) => {
    setActiveIndex(index);
  };

  const handleMarkNotification = (data: any) => {
    if (!data?.isRead) {
      dispatch(notificationsActions.markAsRead({ id: data?.id || '', keyValue: notificationMenuData[activeIndex]?.type || 'tabAll' }));
    } else {
      dispatch(notificationsActions.markAsUnRead(data));
    }
    dispatch(modalActions.hideBottomList());
  };

  const onPressItemOption = ({ item }: {item: any}) => {
    const menuData: any[] = [{
      id: 1,
      testID: 'notification.mark_notification_read_or_unread',
      leftIcon: 'MessageCheck',
      title: i18next.t(!item?.isRead
        ? 'notification:mark_as_read'
        : 'notification:mark_as_unread'),
      requireIsActor: true,
      onPress: () => { handleMarkNotification(item); },
    }, {
      id: 2,
      testID: 'notifications.turn_off_notification',
      leftIcon: 'BellSlash',
      title: i18next.t('notification:turn_off_notification'),
      requireIsActor: true,
      upcoming: true,
    }];
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modalActions.showBottomList({ isOpen: true, data: menuData } as BottomListItemProps),
    );
  };

  const handleMarkAllAsRead = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(notificationsActions.markAsReadAll('ALL'));
  };

  const onPressMenu = () => {
    const menuData: any[] = [{
      id: 1,
      testID: 'notifications.mark_all_as_read',
      leftIcon: 'MessageCheck',
      title: i18next.t('notification:mark_all_as_read'),
      requireIsActor: true,
      onPress: handleMarkAllAsRead,
    }, {
      id: 2,
      testID: 'notifications.notification_settings',
      leftIcon: 'Gear',
      title: i18next.t('notification:notification_settings'),
      requireIsActor: true,
      upcoming: true,
    }];
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modalActions.showBottomList({ isOpen: true, data: menuData } as BottomListItemProps),
    );
  };

  const onItemPress = useCallback(
    (item?: any) => {
      const type = item?.extra?.type || undefined;
      const act = item?.activities?.[0];

      try {
        if (type !== undefined) {
          switch (type) {
            case NOTIFICATION_TYPE.POST_TO_USER_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_TO_USER_IN_MULTIPLE_GROUPS:
            case NOTIFICATION_TYPE.POST_IMPORTANT_TO_USER_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_IMPORTANT_TO_USER_IN_MULTIPLE_GROUPS:
            case NOTIFICATION_TYPE.POST_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
            case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL:
            case NOTIFICATION_TYPE.POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
            case NOTIFICATION_TYPE.REACTION_TO_POST_CREATOR:
            case NOTIFICATION_TYPE.REACTION_TO_POST_CREATOR_AGGREGATED: {
              rootNavigation.navigate(
                homeStack.postDetail, {
                  post_id: act?.id,
                  noti_id: item.id,
                },
              );
              break;
            }
            case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL: {
              rootNavigation.navigate(homeStack.draftPost);
              break;
            }
            case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR:
            case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR_AGGREGATED:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
            case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST:
            case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED: {
              rootNavigation.navigate(
                homeStack.postDetail, {
                  post_id: act?.id,
                  noti_id: item.id,
                  focus_comment: true,
                },
              );
              break;
            }

            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_COMMENT:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT_AGGREGATED:
            case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR:
            case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR_AGGREGATED:
            case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR:
            case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR_AGGREGATED: {
              rootNavigation.navigate(
                homeStack.commentDetail, {
                  postId: act?.id,
                  commentId: act?.comment?.id,
                  notiId: item.id,
                },
              );
              break;
            }
            case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT:
            case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_PUSH:
            case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_AGGREGATED: {
              rootNavigation.navigate(
                homeStack.commentDetail, {
                  postId: act?.id,
                  commentId: act?.comment?.child?.id,
                  parentId: act?.comment?.id,
                  notiId: item.id,
                },
              );
              break;
            }
            case NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER:
            case NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER:
              if (act?.community?.id) {
                rootNavigation.navigate(
                  groupStack.communityMembers, {
                    communityId: act.community.id,
                    isMember: true,
                  },
                );
              }
              if (act?.group?.id) {
                rootNavigation.navigate(
                  groupStack.groupMembers, {
                    groupId: act.group.id,
                    isMember: true,
                  },
                );
              }
              break;
            case NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP:
            case NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER:
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
            case NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
              if (act?.community?.id) {
                rootNavigation.navigate(
                  groupStack.communityDetail, {
                    communityId: act.community.id,
                  },
                );
              }
              if (act?.group?.id) {
                rootNavigation.navigate(
                  groupStack.groupDetail, {
                    groupId: act.group.id,
                    communityId: act?.group?.communityId,
                  },
                );
              }
              break;
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN:
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED: {
              const targetIndex = MEMBER_TABS.findIndex(
                (item: {id: string, text: string}) => item.id === MEMBER_TAB_TYPES.MEMBER_REQUESTS,
              );
              if (act?.community?.id) {
                rootNavigation.navigate(
                  groupStack.communityMembers, {
                    communityId: act.community.id,
                    targetIndex,
                    isMember: true,
                  },
                );
              }
              if (act?.group?.id) {
                rootNavigation.navigate(
                  groupStack.groupMembers, {
                    groupId: act.group.id,
                    targetIndex,
                    isMember: true,
                  },
                );
              }
              break;
            }
            default:
              console.warn(`Notification type ${type} have not implemented yet`);
              break;
          }
        } else {
        // default, render it as "create post" notification
          rootNavigation.navigate(
            homeStack.postDetail, {
              post_id: act?.id,
              noti_id: item.id,
            },
          );
        }
      } catch (error) {
        console.error(
          '\x1b[33m',
          'Navigation for this activity has error',
          type,
          '\x1b[0m',
        );
      }

      // finally mark the notification as read
      dispatch(notificationsActions.markAsRead({
        id: item.id,
        keyValue: notificationMenuData[activeIndex]?.key || 'tabAll',
      }));
    },
    [activeIndex],
  );

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header
        title="tabs:notification"
        titleTextProps={{ useI18n: true }}
        removeBorderAndShadow
        hideBack
        onPressMenu={onPressMenu}
      />
      <ScrollableTabBar
        data={notificationMenuData}
        onItemPress={onItemPress}
        onPressItemOption={onPressItemOption}
        onChangeTab={onPressFilterItem}
        activeIndex={activeIndex}
      />
    </ScreenWrapper>
  );
};

export default Notification;
