/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { FlashListProps } from '@shopify/flash-list/src/FlashListProps';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Divider from '~/beinComponents/Divider';
import NotificationItem from '~/beinComponents/list/items/NotificationItem';
import Text from '~/baseComponents/Text';
import i18n from '~/localization';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';

import spacing from '~/theme/spacing';
import INotificationsState from '../store/Interface';
import useNotificationStore from '../store';
import notiSelector from '../store/selectors';
import { useTabPressListener } from '~/hooks/navigation';
import { ITabTypes } from '~/interfaces/IRouter';

const { width: screenWidth } = Dimensions.get('window');
export interface Props {
  type: string;
  keyValue: string;
  activeIndex: boolean;
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  onRefresh: () => void;
}

const ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT = 100;

const AnimatedFlashList = Animated.createAnimatedComponent<
  React.ComponentType<FlashListProps<any>>
>(FlashList as any);

const NotificationList = ({
  type,
  keyValue,
  activeIndex,
  onItemPress,
  onPressItemOption,
  onRefresh,
}: Props) => {
  const listRef = useRef<any>();

  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);
  const notificationTab = useNotificationStore(notiSelector.getTabData(keyValue));
  const refreshing = useNotificationStore((state: INotificationsState) => state.refreshing);
  const {
    data: notificationList,
    isLoadingMore,
    loading: loadingNotifications,
    noMoreData: noMoreNotification,
  } = notificationTab;

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
      if ((notificationList?.length < 1 && activeIndex) || (activeIndex && type === 'UNREAD')) {
        // @ts-ignore
        notiActions.getTabData({ flag: type, keyValue });
      }
    }, [activeIndex],
  );

  const refreshListNotification = () => {
    onRefresh();
    // @ts-ignore
    notiActions.getTabData({ flag: type, keyValue, isRefresh: true });
  };

  // load more notification handler
  const loadMoreNotifications = () => {
    if (!noMoreNotification && !isLoadingMore) {
      // @ts-ignore
      notiActions.loadMore({ flag: type, keyValue });
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

  const renderEmpty = () => {
    if (loadingNotifications) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator color={theme.colors.gray20} />
        </View>
      );
    }
    return <NoNotificationFound />;
  };

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

  const renderItem = ({ item }: {item: any;}) => (
    <NotificationItem
      id={item}
      testID="notification_screen.item_wrapper"
      onPress={_onItemPress}
      onPressOption={_onPressItemOption}
    />
  );

  const keyExtractor = (item: any) => `noti_id_${item}`;

  const renderItemSeparatorComponent = () => <Divider size={1} color={theme.colors.neutral5} />;

  return (
    <View testID="notification_screen.container" style={styles.container}>
      {notificationList?.length > 0 ? (
        <AnimatedFlashList
          ref={listRef}
          // @ts-ignore
          testID="notification_list.list"
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT}
          refreshing
          refreshControl={(
            <RefreshControl
              testID="notification_list.refresh_control"
              refreshing={refreshing}
              onRefresh={refreshListNotification}
              tintColor={theme.colors.gray40}
            />
          )}
          showsHorizontalScrollIndicator={false}
          data={notificationList}
          onEndReached={loadMoreNotifications}
          ListFooterComponent={renderListFooter}
          ItemSeparatorComponent={renderItemSeparatorComponent}
          contentContainerStyle={styles.listContainer}
        />
      ) : renderEmpty() }
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      backgroundColor: colors.gray5,
      paddingTop: spacing.padding.large,
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
