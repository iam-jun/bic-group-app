import React, { FC, useEffect } from 'react';
import {
  ActivityIndicator, FlatList, RefreshControl, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/components/EmptyScreen';
import BlockedUserItem from './components/BlockedUserItem';
import { IBlockingUser } from '~/interfaces/IBlocking';
import useBlockingStore from '~/store/blocking';
import { IRouteParams } from '~/interfaces/IRouter';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';

const Blocking:FC<IRouteParams> = (props) => {
  const { popScreen = 0 } = props?.route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const { rootNavigation } = useRootNavigation();

  const {
    list, loading, refreshing, hasNextPage, actions, reset,
  } = useBlockingStore();

  useEffect(() => {
    actions.getListBlockingUsers(true);
    return () => {
      reset();
    };
  }, []);

  const handleBack = () => {
    if (popScreen) {
      rootNavigation.pop(popScreen);
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(handleBack);

  const renderListEmptyComponent = () => {
    if (hasNextPage) {
      return null;
    }
    return (
      <EmptyScreen
        icon="blockedUsersNotFound"
        size={100}
        iconStyle={styles.iconStyle}
        description="settings:title_blocked_users_list_empty"
      />
    );
  };

  const renderListHeaderComponent = () => {
    if (list.length === 0) {
      return null;
    }
    return (
      <View style={styles.headerContainer}>
        <Text.SubtitleL>
          {t('settings:text_blocked_users_list')}
          {' '}
          ·
          {' '}
          {list?.length}
        </Text.SubtitleL>
        <Text.BodyM style={styles.headerContent} useI18n>
          settings:text_content_blocked_users_list
        </Text.BodyM>
      </View>
    );
  };

  const renderItem = ({ item }: { item: IBlockingUser }) => <BlockedUserItem item={item} />;

  const renderListFooterComponent = () => {
    if (!loading) return <Divider color="transparent" size={spacing.padding.big} />;

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderItemSeparatorComponent = () => <Divider color="transparent" size={spacing.padding.large} />;

  const renderRefreshControl = () => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.gray40} />
  );

  const onRefresh = () => {
    actions.getListBlockingUsers(true);
  };

  return (
    <ScreenWrapper testID="blocking" isFullView>
      <Header title={t('settings:title_blocking')} onPressBack={handleBack} />
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => `blocking_${item}_${index}`}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={renderListHeaderComponent}
        refreshControl={renderRefreshControl()}
      />
    </ScreenWrapper>
  );
};

export default Blocking;

const styles = StyleSheet.create({
  firstMenuGroup: {
    marginTop: spacing.margin.base,
  },
  divider: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.small,
  },
  headerContainer: {
    paddingVertical: spacing.margin.extraLarge,
    paddingHorizontal: spacing.padding.large,
  },
  headerContent: {
    marginTop: spacing.margin.small,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    marginBottom: spacing.margin.large,
  },
});
