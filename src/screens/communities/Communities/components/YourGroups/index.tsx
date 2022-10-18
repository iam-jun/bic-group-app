import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/components/EmptyScreen';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import useYourGroupsStore from './store';

type GroupItemProps = {
  id: string;
};

const GroupItem: FC<GroupItemProps> = ({ id }) => {
  const {
    items,
  } = useYourGroupsStore();

  return (
    <CommunityGroupCard
      item={items[id]}
      testID={`your_groups_item_${id}`}
    />
  );
};

const renderEmptyComponent = () => {
  const {
    hasNextPage,
  } = useYourGroupsStore();

  if (hasNextPage) {
    return null;
  }

  return (
    <EmptyScreen
      icon="addUsers"
      title="communities:empty_groups:title"
      description="communities:empty_groups:description"
    />
  );
};

const renderListFooter = () => {
  const {
    loading,
  } = useYourGroupsStore();

  if (!loading) return <Separator />;

  return (
    <View style={styles.listFooter} testID="your_groups.loading_more_indicator">
      <ActivityIndicator />
    </View>
  );
};

const Separator = () => (
  <Divider color="transparent" size={spacing.padding.large} />
);

const renderItem: ListRenderItem<string> = ({ item }) => (
  <GroupItem id={item} />
);

const keyExtractor = (item) => `yourgroups_${item}`;

const YourGroups = () => {
  const theme: ExtendedTheme = useTheme();

  const {
    refreshing, hasNextPage, ids, actions,
  } = useYourGroupsStore();

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getYourGroups();
    }
  };

  const onRefresh = () => {
    actions.getYourGroups(true);
  };

  useEffect(() => {
    if (ids.length === 0) {
      actions.getYourGroups();
    }
  }, []);

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={Separator}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YourGroups;
