import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import NotificationItem from '~/beinComponents/list/items/NotificationItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import {useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ITabTypes} from '~/interfaces/IRouter';
import i18n from '~/localization';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import {ITheme} from '~/theme/interfaces';
import notificationsActions from './redux/actions';
import notificationSelector from './redux/selector';

export interface Props {
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  type: string;
}

const NotificationList = ({onItemPress, type, onPressItemOption}: Props) => {
  const listRef = useRef<any>();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const notificationData = useKeySelector(
    notificationSelector.notificationByType(type),
  );
  const isLoadingMore = notificationData?.isLoadingMore;
  const loadingNotifications = notificationData?.loading;
  const noMoreNotification = notificationData?.noMoreData;
  const notificationList = notificationData?.data || [];
  const showNoNotification = notificationList.length === 0;

  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (!isFocused) setCurrentPath('');

    if (isFocused) {
      dispatch(notificationsActions.markAsSeenAll());
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
    //@ts-ignore
    dispatch(notificationsActions.getNotifications({flag: type}));
  };

  // load more notification handler
  const loadMoreNotifications = () => {
    if (!noMoreNotification && !isLoadingMore) {
      //@ts-ignore
      dispatch(notificationsActions.loadMore({flag: type}));
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

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <NotificationItem
        {...item}
        testID={`list_view.item_wrapper.${index}`}
        onPress={() => {
          onItemPress?.(item);
        }}
        onPressOption={(e: any) => {
          onPressItemOption({item, e});
        }}
      />
    );
  };

  const renderUnReadNotificationsEmpty = () => {
    return (
      <View style={styles.unReadNotifications}>
        <Icon icon="CheckCircle" size={40} tintColor={theme.colors.success} />
        <Text.Subtitle useI18n style={{marginTop: theme.spacing.margin.base}}>
          notification:seen_all_notifications
        </Text.Subtitle>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {!loadingNotifications &&
      showNoNotification &&
      noMoreNotification &&
      type === 'UNREAD' ? (
        renderUnReadNotificationsEmpty()
      ) : showNoNotification && !loadingNotifications ? (
        <NoNotificationFound />
      ) : loadingNotifications ? (
        <ActivityIndicator color={theme.colors.bgFocus} />
      ) : null}
      {!showNoNotification && !loadingNotifications && (
        <ListView
          listRef={listRef}
          style={styles.list}
          containerStyle={styles.listContainer}
          isFullView
          renderItem={renderItem}
          renderItemSeparator={() => (
            <Divider size={1} color={theme.colors.borderDivider} />
          )}
          data={notificationList}
          onRefresh={refreshListNotification}
          refreshing={loadingNotifications}
          onLoadMore={() => loadMoreNotifications()}
          ListFooterComponent={renderListFooter}
          currentPath={currentPath}
        />
      )}
    </View>
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
    unReadNotifications: {
      alignItems: 'center',
      marginTop: (spacing.margin.extraLarge || 24) * 2,
    },
  });
};

export default NotificationList;
