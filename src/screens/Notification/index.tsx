import { useIsFocused } from '@react-navigation/native';

import i18next from 'i18next';
import React, {
  FC,
  useCallback, useEffect, useRef, useState,
} from 'react';
import { StyleSheet } from 'react-native';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { BottomListItemProps } from '~/components/BottomList/BottomListItem';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { useRootNavigation } from '~/hooks/navigation';
import { TargetType } from '~/interfaces/IPost';
import commonStack from '~/router/navigator/commonStack/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import mainStack from '~/router/navigator/MainStack/stack';
import { notificationMenuData } from '~/screens/Notification/constants';
import { MEMBER_TABS } from '../communities/CommunityMembers';
import { MEMBER_TAB_TYPES } from '../communities/constants';
import ScrollableTabBar from './components/ScrollableTabBar';
import useNotificationStore from './store';
import INotificationsState from './store/Interface';
import spacing from '~/theme/spacing';
import useModalStore from '~/store/modal';
import { ContentType, InvitationTargetType } from '~/interfaces/INotification';
import { useUserIdAuth } from '~/hooks/auth';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import { USER_TABS } from '../Menu/UserProfile';
import { USER_TABS_TYPES } from '../Menu/UserProfile/constants';
import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';
import useGroupSetInvitationsStore from '~/components/InvitationGroupSet/store';
import InvitationGroupSet from '~/components/InvitationGroupSet';

const NOT_SHOW_DELETE_OPTION_LIST = [
  NOTIFICATION_TYPE.SCHEDULED_MAINTENANCE_DOWNTIME,
  NOTIFICATION_TYPE.CHANGE_LOGS,
];

export interface NotificationProps {
  route?: {
    params?: {
      notificationData?: any;
    };
  };
}

const Notification: FC<NotificationProps> = ({ route }: NotificationProps) => {
  const notificationData = route?.params?.notificationData || {};

  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);
  const { showToast, clearToast } = useModalStore((state) => state.actions);

  const { rootNavigation } = useRootNavigation();
  const isFocused = useIsFocused();
  const userId = useUserIdAuth();
  const { t } = useBaseHook();
  const timeOutRef = useRef<any>();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const modalActions = useModalStore((state) => state.actions);
  const groupSetActions = useGroupSetInvitationsStore((state) => state.actions);

  useEffect(
    () => {
      if (isFocused) {
        notiActions.markAsSeenAll();
      }
    }, [isFocused],
  );

  useEffect(() => {
    if (notificationData?.type) {
      switch (notificationData.type) {
        case NOTIFICATION_TYPE.GROUP_INVITATION_FEEDBACK: {
          const { invitationId, target } = notificationData || {};
          const targetType = target?.type;
          if (targetType === InvitationTargetType.GROUP_SET
                 || targetType === InvitationTargetType.GROUP_SET_DEFAULT) {
            groupSetActions.getGroups(invitationId);
            modalActions.showModal({
              isOpen: true,
              isFullScreen: true,
              headerFullScreenProps: { title: t('common:btn_go_back') },
              ContentComponent: <InvitationGroupSet
                isFullScreen
                isHideInviter
                inviter={undefined}
                invitaionId={invitationId}
              />,
            });
          }
          break;
        }

        default:
          break;
      }
    }
  }, [notificationData]);

  const onPressFilterItem = (index: number) => {
    setActiveIndex(index);
  };

  const handleMarkNotification = (data: any) => {
    if (!data?.isRead) {
      notiActions.markAsRead(data?.id);
    } else {
      notiActions.markAsUnRead(data?.id);
    }
    modalActions.hideBottomList();
  };

  const clearToastDeleteNoti = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    clearToast();
  };

  const onRefresh = () => {
    clearToastDeleteNoti();
    notiActions.deleteAllWaitingNotification();
  };

  const onPressUndo = (id: string) => {
    clearToastDeleteNoti();
    notiActions.undoDeleteNotificationLocal(id);
  };

  const onPressDelete = (id: string) => {
    notiActions.deleteNotification(id);
  };

  const handleRemoveNotification = (id: string) => {
    notiActions.deleteNotificationLocal(id);
    const toastMessage: IToastMessage = {
      content: t('notification:text_remove_notification_success'),
      buttonText: t('common:text_undo'),
      onButtonPress: () => { onPressUndo(id); },
      duration: 3000,
      onClose: () => { onPressDelete(id); },
    };
    showToast(toastMessage);

    timeOutRef.current = setTimeout(
      () => {
        onPressDelete(id);
      }, 3500,
    );

    modalActions.hideBottomList();
  };

  const checkShowDeleteOption = (type: string) => {
    if (!type) return false;
    const index = NOT_SHOW_DELETE_OPTION_LIST.findIndex((item) => item === type);
    return !(index === -1);
  };

  const onPressItemOption = ({ item }: {item: any}) => {
    clearToastDeleteNoti();
    notiActions.deleteAllWaitingNotification();

    const type = item?.extra?.type || undefined;
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
      testID: 'notifications.remove_notification',
      leftIcon: 'TrashCan',
      title: i18next.t('notification:text_remove_notification'),
      requireIsActor: true,
      onPress: () => { handleRemoveNotification(item?.id); },
    }];
    if (checkShowDeleteOption(type)) {
      menuData.splice(1, 1);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    modalActions.showBottomList({ data: menuData } as BottomListItemProps);
  };

  const handleMarkAllAsRead = () => {
    modalActions.hideBottomList();
    notiActions.markAsReadAll('ALL');
  };

  const goToNotiSettings = () => {
    modalActions.hideBottomList();
    rootNavigation.navigate(notiStack.notiSettings);
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
      title: i18next.t('notification:notification_settings:title'),
      requireIsActor: true,
      onPress: goToNotiSettings,
    }];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    modalActions.showBottomList({ data: menuData } as BottomListItemProps);
  };

  const onItemPress = useCallback(
    (item?: any) => {
      const type = item?.extra?.type || undefined;
      const act = item?.activities?.[0];
      const target = item?.target;
      const invitationData = act?.invitation?.target || {};
      clearToastDeleteNoti();

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
            case NOTIFICATION_TYPE.REACTION_TO_POST_CREATOR_AGGREGATED:
            case NOTIFICATION_TYPE.ADD_POST_TO_USER:
            case NOTIFICATION_TYPE.ADD_CONTENT_TO_USER:
            case NOTIFICATION_TYPE.ADD_CONTENT_TO_USER_IN_MULTIPLE_GROUPS:
            {
              if (target === TargetType.ARTICLE) {
                rootNavigation.navigate(articleStack.articleDetail, { articleId: act.id });
              } else if (target === TargetType.SERIES) {
                rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: act.id });
              } else {
                rootNavigation.navigate(
                  homeStack.postDetail, {
                    post_id: act?.id,
                    noti_id: item.id,
                  },
                );
              }
              break;
            }
            case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL: {
              rootNavigation.navigate(menuStack.yourContent, { initTab: 0 });
              break;
            }
            case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR:
            case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR_AGGREGATED:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST:
            case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
            case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST:
            case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED: {
              if (target === TargetType.ARTICLE) {
                rootNavigation.navigate(articleStack.articleDetail, {
                  articleId: act.id,
                  commentId: act?.comment?.id,
                });
              } else {
                rootNavigation.navigate(homeStack.postDetail, {
                  post_id: act?.id,
                  noti_id: item.id,
                  comment_id: act?.comment?.id,
                });
              }
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
                  commentId: act?.comment?.child?.id || act?.comment?.id,
                  parentId: act?.comment?.id,
                  notiId: item.id,
                  target: act?.contentType || '',
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
                  target: act?.contentType || '',
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
                /**
                 * Do community (root group) members đã đổi các endpoints
                 * từ "communities" -> "groups" nên event noti đã chuyển sang phía group,
                 * do đó cần check thêm isCommunity để navigate tới đúng screen
                 */
                const { isCommunity } = act.group;
                if (isCommunity) {
                  rootNavigation.navigate(
                    groupStack.communityMembers, {
                      communityId: act.group.communityId,
                      isMember: true,
                    },
                  );
                } else {
                  rootNavigation.navigate(
                    groupStack.groupMembers, {
                      groupId: act.group.id,
                      isMember: true,
                    },
                  );
                }
              }
              break;
            case NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP:
            case NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER:
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
            case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
            case NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.LEAVE_COMMUNITY_TO_USER:
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
            case NOTIFICATION_TYPE.POST_SERIES_TO_USER_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_SERIES_TO_USER_IN_MULTIPLE_GROUPS:
            case NOTIFICATION_TYPE.ADD_ARTICLE_TO_USER: {
              rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: act.id });
              break;
            }
            case NOTIFICATION_TYPE.POST_ARTICLE_TO_USER_IN_ONE_GROUP:
            case NOTIFICATION_TYPE.POST_ARTICLE_TO_USER_IN_MULTIPLE_GROUPS: {
              rootNavigation.navigate(articleStack.articleDetail, { articleId: act.id });
              break;
            }
            case NOTIFICATION_TYPE.REPORT_USER_TO_USER:
            case NOTIFICATION_TYPE.REPORT_USER_TO_USER_AGGREGATED:
            case NOTIFICATION_TYPE.CONTENT_REPORT_TO_USER:
            case NOTIFICATION_TYPE.CONTENT_REPORT_TO_USER_AGGREGATED: {
              rootNavigation.navigate(commonStack.unsupportFeature);
              break;
            }
            case NOTIFICATION_TYPE.CONTENT_HIDE_TO_USER: {
              const targetType = act?.report?.targetType;
              const targetId = act?.report?.targetId;

              if (targetType === TargetType.POST) {
                rootNavigation.navigate(
                  homeStack.postDetail, {
                    post_id: targetId,
                    noti_id: item.id,
                    is_reported: true,
                  },
                );
              } else if (targetType === TargetType.ARTICLE) {
                rootNavigation.navigate(articleStack.articleContentDetail, {
                  articleId: targetId,
                  is_reported: true,
                  noti_id: item.id,
                });
              } else {
                rootNavigation.navigate(
                  homeStack.commentDetail, {
                    commentId: targetId,
                    notiId: item.id,
                    isReported: true,
                    target: act?.contentType || '',
                  },
                );
              }
              break;
            }
            case NOTIFICATION_TYPE.LEAVE_GROUP_TO_USER:
              if (!!act?.group?.[0]?.id) {
                rootNavigation.navigate(
                  groupStack.groupDetail, {
                    groupId: act.group[0].id,
                    communityId: act?.group?.[0]?.communityId,
                  },
                );
              }
              break;
            case NOTIFICATION_TYPE.REMOVE_ARTICLE_TO_USER:
            case NOTIFICATION_TYPE.REMOVE_ARTICLE_TO_CREATOR:
              if (act?.item?.id) {
                rootNavigation.navigate(articleStack.articleDetail, { articleId: act.item.id });
              }
              break;
            case NOTIFICATION_TYPE.REMOVE_POST_TO_USER:
            case NOTIFICATION_TYPE.REMOVE_POST_TO_CREATOR:
              rootNavigation.navigate(
                homeStack.postDetail, {
                  post_id: act?.item?.id,
                  noti_id: item.id,
                },
              );
              break;
            case NOTIFICATION_TYPE.DELETE_SERIES_TO_USER:
              // eslint-disable-next-line no-case-declarations
              const items = act?.items || [];
              if (items?.length > 0) {
                const content = items.find((item) => item?.actor?.id === userId);
                if (content?.contentType === ContentType.post) {
                  rootNavigation.navigate(
                    homeStack.postDetail, {
                      post_id: content.id,
                      noti_id: item.id,
                    },
                  );
                }
                if (content?.contentType === ContentType.article) {
                  rootNavigation.navigate(articleStack.articleDetail, { articleId: content.id });
                }
              }
              break;
            case NOTIFICATION_TYPE.APPROVED_KYC:
              rootNavigation.navigate(mainStack.userProfile, { userId });
              break;

            case NOTIFICATION_TYPE.SCHEDULED_MAINTENANCE_DOWNTIME:
              rootNavigation.navigate(notiStack.notiMaintenancePage, { maintenanceInfo: act?.maintenanceInfo });
              break;
            case NOTIFICATION_TYPE.SERIES_POST_ITEM_CHANGED:
            case NOTIFICATION_TYPE.SERIES_ARTICLE_ITEM_CHANGED:
              // eslint-disable-next-line no-case-declarations
              const seriesList = act?.items || [];
              if (seriesList?.length > 0) {
                const seriesInfo = seriesList.find((series) => series?.state === 'add');
                rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: seriesInfo.id });
              }
              break;

            case NOTIFICATION_TYPE.CHANGE_LOGS:
              notiActions.resetChangelogNoti();
              rootNavigation.navigate(notiStack.notiChangeLogsPage, { id: item.id });
              break;

            case NOTIFICATION_TYPE.CHANGE_USER_BADGE_COLLECTION: {
              const targetIndex = USER_TABS.findIndex(
                (item: { id: string; text: string }) => item.id === USER_TABS_TYPES.USER_BADGE_COLLECTION,
              );
              rootNavigation.navigate(mainStack.userProfile, { userId, targetIndex });
              break;
            }
            case NOTIFICATION_TYPE.GROUP_INVITATION: {
              const communityId = invitationData?.communityId || '';
              const groupId = invitationData?.id || '';
              const targetType = invitationData?.type || '';

              if (targetType === InvitationTargetType.COMMUNITY && !!communityId) {
                rootNavigation.navigate(groupStack.communityDetail, { communityId });
              }
              if (targetType === InvitationTargetType.GROUP && !!groupId && communityId) {
                rootNavigation.navigate(
                  groupStack.groupDetail, {
                    groupId,
                    communityId,
                  },
                );
              }
              break;
            }

            case NOTIFICATION_TYPE.GROUP_INVITATION_FEEDBACK: {
              const communityId = invitationData?.communityId || '';
              const groupId = invitationData?.id || '';
              const targetType = invitationData?.type || '';

              if (targetType === InvitationTargetType.COMMUNITY && !!communityId) {
                rootNavigation.navigate(groupStack.communityMembers, {
                  communityId,
                  isMember: true,
                });
              }

              if (targetType === InvitationTargetType.GROUP && !!groupId) {
                rootNavigation.navigate(groupStack.groupMembers, {
                  groupId,
                  isMember: true,
                });
              }

              if (targetType === InvitationTargetType.GROUP_SET
                 || targetType === InvitationTargetType.GROUP_SET_DEFAULT) {
                const invitationId = act?.invitation?.invitationId || '';
                groupSetActions.getGroups(invitationId);
                modalActions.showModal({
                  isOpen: true,
                  isFullScreen: true,
                  headerFullScreenProps: { title: t('common:btn_go_back') },
                  ContentComponent: <InvitationGroupSet
                    isFullScreen
                    isHideInviter
                    inviter={undefined}
                    invitaionId={invitationId}
                  />,
                });
              }
              break;
            }
            case NOTIFICATION_TYPE.GROUP_SET_INVITATION:
            case NOTIFICATION_TYPE.GROUP_SET_DEFAULT_INVITATION: {
              const invitationId = act?.invitation?.invitationId || '';
              const invitor = act?.invitation?.invitor || {};
              groupSetActions.getGroups(invitationId);
              modalActions.showModal({
                isOpen: true,
                isFullScreen: true,
                headerFullScreenProps: { title: t('common:btn_go_back') },
                ContentComponent: <InvitationGroupSet
                  isFullScreen
                  inviter={invitor}
                  invitaionId={invitationId}
                />,
              });
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
      notiActions.markAsRead(item.id);
    },
    [activeIndex],
  );

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header
        title="tabs:notification"
        titleTextProps={{ useI18n: true, style: styles.textHeader }}
        removeBorderAndShadow
        hideBack
        onPressMenu={onPressMenu}
      />
      <ScrollableTabBar
        data={notificationMenuData}
        activeIndex={activeIndex}
        onItemPress={onItemPress}
        onPressItemOption={onPressItemOption}
        onChangeTab={onPressFilterItem}
        onRefresh={onRefresh}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    marginLeft: spacing.margin.small,
  },
});

export default Notification;
