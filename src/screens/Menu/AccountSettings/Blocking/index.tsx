import React, { useEffect } from 'react';
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
import useBlockingStore from './store';
import EmptyScreen from '~/components/EmptyScreen';
import BlockedUserItem from './components/BlockedUserItem';
import { IBlockingUser } from '~/interfaces/IBlocking';

const Blocking = () => {
  const theme: ExtendedTheme = useTheme();

  const {
    list, loading, refreshing, hasNextPage, actions, reset,
  } = useBlockingStore();

  useEffect(() => {
    actions.getListBlockingUsers();
    return () => {
      reset();
    };
  }, []);

  const renderListEmptyComponent = () => {
    if (hasNextPage) {
      return null;
    }
    return (
      <EmptyScreen
        icon="searchUsers"
        title="settings:title_blocked_users_list_empty"
        description="settings:text_blocked_users_list_empty"
      />
    );
  };

  const renderListHeaderComponent = () => {
    if (list.length === 0) {
      return null;
    }
    return (
      <View style={styles.headerContainer}>
        <Text.H3 useI18n>settings:text_blocked_users_list</Text.H3>
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
      <Header title={t('settings:title_blocking')} />
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
});
