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
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Divider from '~/beinComponents/Divider';
import NotificationItem from '~/beinComponents/list/items/NotificationItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import { useTabPressListener } from '~/hooks/navigation';
import { ITabTypes } from '~/interfaces/IRouter';
import i18n from '~/localization';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';

import spacing from '~/theme/spacing';
import INotificationsState from '../store/Interface';
import useNotificationStore from '../store';
import notiSelector from '../store/selectors';

const { width: screenWidth } = Dimensions.get('window');
export interface Props {
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  type: string;
  keyValue: string;
  activeIndex: boolean;
}

const NotificationList = ({
  onItemPress,
  type,
  keyValue,
  onPressItemOption,
  activeIndex,
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
      if (notificationList?.length < 1 && activeIndex) {
        // @ts-ignore
        notiActions.getTabData({ flag: type, keyValue });
      }
    }, [activeIndex],
  );

  const refreshListNotification = () => {
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
      onPress={_onItemPress}
      onPressOption={_onPressItemOption}
    />
  );

  const renderUnReadNotificationsEmpty = () => <NoNotificationFound />;

  const keyExtractor = (item: any) => item?.id;

  return (
    <View style={styles.container}>
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
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshListNotification}
              tintColor={theme.colors.gray40}
            />
      )}
          data={notificationList}
          ListEmptyComponent={renderUnReadNotificationsEmpty}
          onLoadMore={loadMoreNotifications}
          ListFooterComponent={renderListFooter}
        />
      ) : (
        <ActivityIndicator color={theme.colors.gray20} />
      )}
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
