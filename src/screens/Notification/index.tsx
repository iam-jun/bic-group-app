import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useNotifications from '~/hooks/notifications';
import NotificationTopBar from './components/NotificationTopBar';
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

const Notfitication = () => {
  const menuSheetRef = useRef<any>();

  const notificationData = useNotifications();
  const {loadingNotifications, notificationList} = notificationData;

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
    if (isFocused) {
      dispatch(
        notificationsActions.markAsSeenAll({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  }, [isFocused]);

  const onPressMenu = () => {
    menuSheetRef.current?.open?.();
  };

  const _onItemPress = (item?: any) => {
    // note: item is a notification group
    // get first activity in notification group
    // for now make the navigation to be simple by redirect to post detail screen
    // for feature, check notification type to implement more complex requirements
    const act = item.activities[0];
    const verb = item.verb;
    const post = act.object;
    if (post && post.collection && post.collection === 'post') {
      if (verb === 'comment') {
        dispatch(postActions.setPostDetail(act));
        rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
      } else {
        dispatch(postActions.setPostDetail(act));
        rootNavigation.navigate(homeStack.postDetail);
      }
    } else {
      console.log(
        '\x1b[33m',
        'this notication not relate to a post',
        act,
        '\x1b[0m',
      );
    }

    // finally mark the notification as read
    dispatch(
      notificationsActions.markAsRead({
        userId: userId,
        activityId: item.id,
        streamClient: streamClient,
      }),
    );
  };

  // loadmore notification handler
  const loadmoreNoti = () => {
    if (streamClient && !noMoreNotification && !isLoadingMore) {
      dispatch(
        notificationsActions.loadmore({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  };

  const theme: ITheme = useTheme();
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
      <View style={styles.screenContainer}>
        <Header>
          <NotificationTopBar onPressMenu={onPressMenu} />
        </Header>
        <ListView
          style={styles.list}
          type="notification"
          loading={loadingNotifications}
          isFullView
          renderItemSeparator={() => <ViewSpacing height={2} />}
          data={notificationList}
          onItemPress={_onItemPress}
          onLoadMore={() => loadmoreNoti()}
          ListFooterComponent={renderListFooter}
        />
        <NotificationBottomSheet modalizeRef={menuSheetRef} />
      </View>
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

export default Notfitication;
