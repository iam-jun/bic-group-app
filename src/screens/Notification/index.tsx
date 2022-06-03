import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {notificationMenuData} from '~/constants/notificationMenuData';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import NotificationBottomSheet from './components/NotificationBottomSheet';
import NotificationOptionBottomSheet from './components/NotificationOptionBottomSheet';
import notificationsActions from './redux/actions';
import ScrollableTabBar from './ScrollableTabBar';

const Notification = () => {
  const menuSheetRef = useRef<any>();
  const notificationOptionRef = useRef<any>();

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const isFocused = useIsFocused();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedNotification, setSelectedNotification] = useState({});

  useEffect(() => {
    if (isFocused) {
      dispatch(notificationsActions.markAsSeenAll());
    }
  }, [isFocused]);

  const onPressFilterItem = (index: number) => {
    setSelectedIndex(index);
  };

  const onPressItemOption = ({item, e}: {item: any; e: any}) => {
    setSelectedNotification(item);
    notificationOptionRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const onPressMenu = (e: any) => {
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const onItemPress = (item?: any) => {
    const type = item?.extra?.type || undefined;
    const act = item?.activities?.[0];
    try {
      if (type !== undefined) {
        switch (type) {
          case NOTIFICATION_TYPE.POST.CREATED_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.CREATED_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.MENTION_IN_ONE_GROUP:
          case NOTIFICATION_TYPE.POST.MENTION_IN_MULTIPLE_GROUPS:
          case NOTIFICATION_TYPE.POST.VIDEO.PROCESSING:
          case NOTIFICATION_TYPE.POST.VIDEO.PUBLISHED:
          case NOTIFICATION_TYPE.REACT.POST_CREATOR:
          case NOTIFICATION_TYPE.REACT.POST_CREATOR_AGGREGATED: {
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: act?.id,
              noti_id: item.id,
            });
            break;
          }
          case NOTIFICATION_TYPE.POST.VIDEO.FAILED: {
            rootNavigation.navigate(homeStack.draftPost);
            break;
          }
          case NOTIFICATION_TYPE.COMMENT.POST_CREATOR:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_POST:
          case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST:
          case NOTIFICATION_TYPE.COMMENT.POST_CREATOR_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_POST_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST_AGGREGATED: {
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: act?.id,
              noti_id: item.id,
              focus_comment: true,
            });
            break;
          }

          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_COMMENT:
          case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR:
          case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR_AGGREGATED: {
            rootNavigation.navigate(homeStack.commentDetail, {
              postId: act?.id,
              commentId: act?.comment?.id,
            });
            break;
          }
          case NOTIFICATION_TYPE.COMMENT.CREATOR_OF_THE_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .CREATOR_OF_THE_PARENT_COMMENT_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT
            .USER_REPLIED_TO_THE_SAME_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .USER_REPLIED_TO_THE_SAME_PARENT_COMMENT_AGGREGATED:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_REPLIED_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_REPLIED_COMMENT:
          case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PARENT_COMMENT:
          case NOTIFICATION_TYPE.COMMENT
            .USER_MENTIONED_IN_PARENT_COMMENT_AGGREGATED: {
            rootNavigation.navigate(homeStack.commentDetail, {
              postId: act?.id,
              commentId: act?.comment?.child?.id,
              parentId: act?.comment?.id,
            });
            break;
          }
          default:
            console.log(`Notification type ${type} have not implemented yet`);
            break;
        }
      } else {
        // default, render it as "create post" notification
        rootNavigation.navigate(homeStack.postDetail, {
          post_id: act?.id,
          noti_id: item.id,
        });
      }
    } catch (error) {
      console.log(
        '\x1b[33m',
        'Navigation for this activity has error',
        type,
        '\x1b[0m',
      );
    }

    // finally mark the notification as read
    dispatch(
      notificationsActions.markAsRead({
        id: item.id,
        flag: notificationMenuData[selectedIndex]?.type || 'ALL',
      }),
    );
  };

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header
        title="tabs:notification"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={false}
        hideBack
        onPressMenu={onPressMenu}
      />
      <ScrollableTabBar
        data={notificationMenuData}
        onItemPress={onItemPress}
        onPressItemOption={onPressItemOption}
        onChangeTab={onPressFilterItem}
      />
      <NotificationBottomSheet
        modalizeRef={menuSheetRef}
        flag={notificationMenuData[selectedIndex]?.type || 'ALL'}
      />
      <NotificationOptionBottomSheet
        modalizeRef={notificationOptionRef}
        data={selectedNotification}
        flag={notificationMenuData[selectedIndex]?.type || 'ALL'}
      />
    </ScreenWrapper>
  );
};

export default Notification;
