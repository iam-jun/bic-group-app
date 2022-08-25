/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Icon from '~/baseComponents/Icon';
import NotificationItem from '~/beinComponents/list/items/NotificationItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import { useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import i18n from '~/localization';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';

import spacing from '~/theme/spacing';
import notificationsActions from '../../../storeRedux/notification/actions';
import notificationSelector from '../../../storeRedux/notification/selector';

const { width: screenWidth } = Dimensions.get('window');
export interface Props {
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  type: string;
  keyValue: string;
  activeIndex: boolean;
}

const _NotificationList = ({
  onItemPress,
  type,
  keyValue,
  onPressItemOption,
  activeIndex,
}: Props) => {
  const listRef = useRef<any>();

  const dispatch = useDispatch();

  const notificationList = useKeySelector(notificationSelector.notificationByType(keyValue));
  const isLoadingMore = useKeySelector(notificationSelector.isLoadingMore(keyValue));
  const loadingNotifications = useKeySelector(notificationSelector.isLoading(keyValue));
  const noMoreNotification = useKeySelector(notificationSelector.noMoreNotification(keyValue));

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'notification') {
        listRef?.current?.scrollToOffset?.({ animated: true, offset: 0 });
      }
    },
    [listRef],
  );

  useEffect(
    () => {
      if (notificationList?.length < 1 && activeIndex) {
      // @ts-ignore
        dispatch(notificationsActions.getNotifications({ flag: type, keyValue }));
      }
    }, [activeIndex],
  );

  const refreshListNotification = () => {
    dispatch(notificationsActions.getNotifications({
      // @ts-ignore
      flag: type,
      keyValue,
      isRefresh: true,
    }));
  };

  // load more notification handler
  const loadMoreNotifications = () => {
    if (!noMoreNotification && !isLoadingMore) {
      // @ts-ignore
      dispatch(notificationsActions.loadMore({ flag: type, keyValue }));
    }
  };

  const _onItemPress = useCallback(
    (item: any) => {
      onItemPress?.(item);
    },
    [onItemPress],
  );

  const _onPressItemOption = useCallback(
    ({ item, e }: any) => {
      onPressItemOption?.({ item, e });
    },
    [onPressItemOption],
  );

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const renderListFooter = () => {
    if (notificationList?.length > 0) {
      return (
        <View style={styles.listFooter}>
          {!noMoreNotification && isLoadingMore && (
            <ActivityIndicator color={theme.colors.gray20} />
          )}
          {noMoreNotification && (
            <Text.BodyS color={theme.colors.gray50}>
              {i18n.t('notification:no_more_notification')}
            </Text.BodyS>
          )}
        </View>
      );
    }
    return null;
  };

  const renderItem = ({ item, index }: {item: any; index: number}) => (
    <NotificationItem
      id={item}
      testID={`list_view.item_wrapper.${index}`}
      onPress={(data: any) => {
        _onItemPress(data);
      }}
      onPressOption={(data: any) => {
        _onPressItemOption(data);
      }}
    />
  );

  const renderUnReadNotificationsEmpty = () => {
    if (type === 'UNREAD' && noMoreNotification) {
      return (
        <View style={styles.unReadNotifications}>
          <Icon icon="CircleCheck" size={40} tintColor={theme.colors.success} />
          <Text.BodyS useI18n style={{ marginTop: spacing.margin.base }}>
            notification:seen_all_notifications
          </Text.BodyS>
        </View>
      );
    }
    return <NoNotificationFound />;
  };

  const _notificationList = React.useMemo(
    () => {
      if (
        notificationList !== undefined
      && !isEqual(
        JSON.stringify(notificationList),
        JSON.stringify(_notificationList),
      )
      ) {
        return notificationList;
      }
    }, [notificationList],
  );

  const keyExtractor = (item: any) => JSON.stringify(item);

  return (
    <View style={{ flex: 1, width: screenWidth }}>
      {!loadingNotifications ? (
        <ListView
          listRef={listRef}
          style={styles.list}
          containerStyle={styles.listContainer}
          isFullView
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderItemSeparator={() => (
            <Divider size={1} color={theme.colors.neutral5} />
          )}
          data={_notificationList}
          onRefresh={refreshListNotification}
          refreshing={loadingNotifications}
          ListEmptyComponent={renderUnReadNotificationsEmpty()}
          onLoadMore={() => loadMoreNotifications()}
          ListFooterComponent={renderListFooter}
        />
      ) : (
        <ActivityIndicator color={theme.colors.gray20} />
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.white,
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

const NotificationList = React.memo(_NotificationList);
NotificationList.whyDidYouRender = true;
export default NotificationList;
