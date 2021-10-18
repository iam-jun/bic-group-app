import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ITabTypes} from '~/interfaces/IRouter';
import i18n from '~/localization';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import NotificationBottomSheet from './components/NotificationBottomSheet';
import notificationsActions from './redux/actions';
import notificationSelector from './redux/selector';

const Notification = () => {
  const listRef = useRef<any>();
  const menuSheetRef = useRef<any>();

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const isFocused = useIsFocused();
  const dimensions = useWindowDimensions();
  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();

  const isLoadingMore = useKeySelector(notificationSelector.isLoadingMore);
  const loadingNotifications = useKeySelector(notificationSelector.isLoading);
  const notificationList = useKeySelector(notificationSelector.notifications);
  const noMoreNotification = useKeySelector(
    notificationSelector.noMoreNotification,
  );

  const showNoNotification = notificationList.length === 0;
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  useEffect(() => {
    if (isFocused && streamClient) {
      dispatch(
        notificationsActions.markAsSeenAll({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  }, [isFocused]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'notification') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const refreshListNotification = () => {
    if (streamClient?.currentUser?.token) {
      dispatch(
        notificationsActions.getNotifications({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  };

  const onPressMenu = (e: any) => {
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const _onItemPress = (item?: any) => {
    // note: item is a notification group
    // get first activity in notification group
    // for now make the navigation to be simple by redirect to post detail screen
    // for feature, check notification type to implement more complex requirements
    const act = item.activities[0];
    try {
      if (act.notificationType !== undefined) {
        switch (act.notificationType) {
          case NOTIFICATION_TYPE.MENTION: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              noti_id: item.id,
            });
            break;
          }
          // notification type 18, 8, 22, 17
          // TODO, this need to be updated for forcusing comment
          // for now can not focus comment if the comment hasn't loaded in list yet
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_YOUR_COMMENT:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_REPLIED: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              focus_comment: true,
              noti_id: item.id,
            });
            break;
          }
          // notification type 7, 19, 20, 21
          // TODO, this need to be updated for forcusing comment
          // for now can not focus comment if the comment hasn't loaded in list yet
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_YOUR_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_A_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              focus_comment: true,
              noti_id: item.id,
            });
            break;
          }
          // notification type 9, this is ok
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_POST: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              noti_id: item.id,
            });
            break;
          }
          // notification type 10
          // TODO, this need to be updated for forcusing comment
          // for now can not focus comment if the comment hasn't loaded in list yet
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_COMMENT: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              focus_comment: true,
              noti_id: item.id,
            });
            break;
          }
          // noti type 16
          case NOTIFICATION_TYPE.MENTION_YOU_IN_COMMENT: {
            const postAct = act.object;
            rootNavigation.navigate(homeStack.postDetail, {
              post_id: postAct?.id,
              focus_comment: true,
              noti_id: item.id,
            });
            break;
          }
          default:
            console.log(
              `Notification type ${act.notificationType} have not implemented yet`,
            );
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
        act,
        '\x1b[0m',
      );
    }

    // finally mark the notification as read
    if (streamClient) {
      dispatch(
        notificationsActions.markAsRead({
          userId: userId,
          activityId: item.id,
          streamClient: streamClient,
        }),
      );
    }
  };

  // load more notification handler
  const loadMoreNotifications = () => {
    if (streamClient && !noMoreNotification && !isLoadingMore) {
      dispatch(
        notificationsActions.loadmore({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  };

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderListFooter = () => {
    return (
      <View style={styles.listFooter}>
        {!noMoreNotification && isLoadingMore && (
          <ActivityIndicator color={theme.colors.bgFocus} />
        )}
        {noMoreNotification && (
          <Text.Subtitle color={theme.colors.textSecondary}>
            {i18n.t('notification:no_more_notification')}
          </Text.Subtitle>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header
        title="tabs:notification"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={isLaptop}
        hideBack
        onPressMenu={onPressMenu}
      />
      {showNoNotification && <NoNotificationFound />}
      {!showNoNotification && (
        <ListView
          listRef={listRef}
          style={styles.list}
          type="notification"
          isFullView
          renderItemSeparator={() => <ViewSpacing height={2} />}
          data={notificationList}
          onItemPress={_onItemPress}
          onRefresh={refreshListNotification}
          refreshing={loadingNotifications}
          onLoadMore={() => loadMoreNotifications()}
          ListFooterComponent={renderListFooter}
        />
      )}
      <NotificationBottomSheet modalizeRef={menuSheetRef} />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {},
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default Notification;
