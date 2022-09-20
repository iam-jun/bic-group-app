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
import { useDispatch } from 'react-redux';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/components/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard';

type GroupItemProps = {
  id: string;
};

const GroupItem: FC<GroupItemProps> = ({ id }) => {
  const joinedAllGroups = useKeySelector(groupsKeySelector.joinedAllGroups);
  const { items } = joinedAllGroups;

  return (
    <CommunityGroupCard item={items[id]} testID={`your_groups_item_${id}`} />
  );
};

const renderEmptyComponent = () => {
  const joinedAllGroups = useKeySelector(groupsKeySelector.joinedAllGroups);
  const { canLoadMore } = joinedAllGroups;

  if (canLoadMore) {
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
  const joinedAllGroups = useKeySelector(groupsKeySelector.joinedAllGroups);
  const { isLoading, canLoadMore } = joinedAllGroups;

  if (!isLoading || !canLoadMore) return null;

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
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const joinedAllGroups = useKeySelector(groupsKeySelector.joinedAllGroups);
  const { isRefresh, canLoadMore, ids } = joinedAllGroups;

  const onLoadMore = () => {
    if (canLoadMore) {
      dispatch(groupsActions.getJoinedAllGroups());
    }
  };

  const onRefresh = () => {
    dispatch(groupsActions.getJoinedAllGroups({ isRefresh: true }));
  };

  useEffect(() => {
    if (ids.length === 0) {
      dispatch(groupsActions.getJoinedAllGroups());
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
          refreshing={isRefresh}
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
