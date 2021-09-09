import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useNotifications from '~/hooks/notifications';
import NotificationBottomSheet from './components/NotificationBottomSheet';
import {useIsFocused} from '@react-navigation/native';
import notificationsActions from './redux/actions';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import notificationSelector from './redux/selector';
import {useKeySelector} from '~/hooks/selector';
import Text from '~/beinComponents/Text';
import i18n from '~/localization';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import {deviceDimensions} from '~/theme/dimension';

const Notification = () => {
  const menuSheetRef = useRef<any>();

  const notificationData = useNotifications();
  const {loadingNotifications, notificationList} = notificationData;
  const showNoNotification = notificationList.length === 0;

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  const noMoreNotification = useKeySelector(
    notificationSelector.noMoreNotification,
  );
  const isLoadingMore = useKeySelector(notificationSelector.isLoadingMore);

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
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail);
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
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
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
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
            break;
          }
          // notification type 9, this is ok
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_POST: {
            const postAct = act.object;
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail);
            break;
          }
          // notification type 10
          // TODO, this need to be updated for forcusing comment
          // for now can not focus comment if the comment hasn't loaded in list yet
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_COMMENT: {
            const postAct = act.object;
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
            break;
          }
          // noti type 16
          case NOTIFICATION_TYPE.MENTION_YOU_IN_COMMENT: {
            const postAct = act.object;
            dispatch(postActions.setPostDetail(postAct));
            rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
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
        dispatch(postActions.setPostDetail(act));
        rootNavigation.navigate(homeStack.postDetail);
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
          style={styles.list}
          type="notification"
          loading={loadingNotifications}
          isFullView
          renderItemSeparator={() => <ViewSpacing height={2} />}
          data={notificationList}
          onItemPress={_onItemPress}
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
