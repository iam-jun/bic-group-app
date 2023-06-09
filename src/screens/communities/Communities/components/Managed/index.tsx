import React, { FC, useEffect } from 'react';
import {
  SectionList,
  SectionListRenderItem,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/components/EmptyScreen';
import useManagedStore from './store';

type GroupItemProps = {
  id: string;
  section: string;
};

type SectionTitleProps = {
  title: string;
};

type ListEmptyProps = {
  type: 'owner' | 'manage';
};

const GroupItem: FC<GroupItemProps> = ({ id, section }) => {
  const { owner, manage } = useManagedStore();

  const item
    = section === 'communities:community_menu:owner'
      ? owner.items[id]
      : manage.items[id];
  const testID
    = section === 'communities:community_menu:owner'
      ? `managed_owner_item_${id}`
      : `managed_manage_item_${id}`;

  return <CommunityGroupCard item={item} testID={testID} />;
};

const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.titleSectionContainer}>
      <Text.H5 useI18n>{title}</Text.H5>
    </View>
  );
};

const ListEmpty: FC<ListEmptyProps> = ({ type }) => {
  const { manage, owner } = useManagedStore();
  const { hasNextPage: hasNextPageManage } = manage;
  const { hasNextPage: hasNextPageOwner } = owner;
  const canLoadMoreItem
    = type === 'owner' ? hasNextPageOwner : hasNextPageManage;
  const testID = type === 'owner' ? 'list_empty_owner' : 'list_empty_manage';
  const description
    = type === 'owner'
      ? 'communities:community_menu:you_have_not_owner_community'
      : 'communities:community_menu:you_have_not_manage_communiy_or_group';

  if (canLoadMoreItem) {
    return null;
  }

  return (
    <View testID={testID}>
      <EmptyScreen icon="searchUsers" description={description} />
    </View>
  );
};

const ListEmptyAll = () => (
  <View>
    <EmptyScreen
      icon="searchUsers"
      description="communities:community_menu:you_dont_have_any_community_group"
    />
  </View>
);

const Managed = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {
    refreshing, owner, manage, actions,
  } = useManagedStore();
  const { ids: idsOwner } = owner;
  const { ids: idsManage, hasNextPage, loading } = manage;
  const data = hasNextPage || idsOwner.length !== 0 || idsManage.length !== 0 ? [
    {
      title: 'communities:community_menu:managed_groups',
      data: idsManage,
    },
  ] : [];

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getManagedCommunityAndGroup();
    }
  };

  const onRefresh = () => {
    actions.getManaged(true);
  };

  const renderItem: SectionListRenderItem<
    string,
    { title: string; data: string[] }
  > = ({ item, section }) => <GroupItem id={item} section={section.title} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <SectionTitle title={title} />
  );

  const renderSectionFooter = ({ section: { title, data } }) => {
    if (data.length !== 0) return null;

    return (
      <ListEmpty
        type={title === 'communities:community_menu:owner' ? 'owner' : 'manage'}
      />
    );
  };

  const keyExtractor = (item) => `managed-${item}`;

  const renderListFooter = () => {
    if (!loading) return <View style={styles.listFooter} />;

    return (
      <View
        style={styles.listFooter}
        testID="your_groups.loading_more_indicator"
      >
        <ActivityIndicator />
      </View>
    );
  };

  useEffect(() => {
    actions.getManaged(true);
  }, []);

  const renderItemSeparatorComponent = () => <Divider color="transparent" size={spacing.padding.large} />;

  const renderListEmptyComponent = <ListEmptyAll />;

  return (
    <SectionList
      sections={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ItemSeparatorComponent={renderItemSeparatorComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
      ListEmptyComponent={renderListEmptyComponent}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    titleSectionContainer: {
      padding: spacing.padding.large,
      backgroundColor: colors.gray5,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default Managed;
