import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Filter from '~/beinComponents/Filter';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {notificationMenuData} from '~/constants/notificationMenuData';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ITabTypes} from '~/interfaces/IRouter';
import i18n from '~/localization';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
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

  const isLoadingMore = useKeySelector(notificationSelector.isLoadingMore);
  const loadingNotifications = useKeySelector(notificationSelector.isLoading);
  const notificationList = useKeySelector(notificationSelector.notifications);
  const noMoreNotification = useKeySelector(
    notificationSelector.noMoreNotification,
  );

  const showNoNotification = notificationList.length === 0;

  const [currentPath, setCurrentPath] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (!isFocused) setCurrentPath('');

    if (isFocused || loadingNotifications) {
      dispatch(notificationsActions.markAsSeenAll());
    }
  }, [isFocused, loadingNotifications]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'notification') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const refreshListNotification = () => {
    dispatch(notificationsActions.getNotifications());
  };

  const onPressFilterItem = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const onPressMenu = (e: any) => {
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const _onItemPress = (item?: any) => {
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
          case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST: {
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
    dispatch(notificationsActions.markAsRead(item.id));
  };

  // load more notification handler
  const loadMoreNotifications = () => {
    if (!noMoreNotification && !isLoadingMore) {
      dispatch(notificationsActions.loadmore());
    }
  };

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderListHeader = () => {
    return (
      <Filter
        testID={'notification.filter'}
        itemTestID={'notification.filter.item'}
        // style={{paddingVertical: spacing.padding.small}}
        data={notificationMenuData}
        selectedIndex={selectedIndex}
        onPress={onPressFilterItem}
      />
    );
  };

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
        removeBorderAndShadow={false}
        hideBack
        onPressMenu={onPressMenu}
      />
      {showNoNotification && <NoNotificationFound />}
      {!showNoNotification && (
        <>
          {renderListHeader()}
          <ListView
            listRef={listRef}
            style={styles.list}
            containerStyle={styles.listContainer}
            type="notification"
            isFullView
            renderItemSeparator={() => (
              <Divider size={1} color={theme.colors.borderDivider} />
            )}
            data={notificationList}
            onItemPress={_onItemPress}
            onRefresh={refreshListNotification}
            refreshing={loadingNotifications}
            onLoadMore={() => loadMoreNotifications()}
            ListFooterComponent={renderListFooter}
            currentPath={currentPath}
          />
        </>
      )}
      <NotificationBottomSheet modalizeRef={menuSheetRef} />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors, spacing} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {},
    listContainer: {
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default Notification;
