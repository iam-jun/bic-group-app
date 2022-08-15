import React, { useEffect, useState } from 'react';
import {
  FlatList, StyleSheet, RefreshControl, ListRenderItem,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard'

const Index = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const [refreshing, setRefreshing] = useState(false);

  const renderEmptyComponent = () => (
    <EmptyScreen
      source="addUsers"
      title="communities:empty_communities:title"
      description="communities:empty_communities:description"

    />
  );

  const getData = () => {
    dispatch(groupsActions.getMyCommunities({
      callback: () => {
        setRefreshing(false);
      },
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const renderItem: ListRenderItem<number> = ({ item, index }) => (
    <CommunityGroupCard
      item={item}
      testID={`your_communities_item_${index}`}
    />
  );

  useEffect(
    () => {
      getData();
    }, [],
  );

  return (
    <FlatList
      testID="flatlist"
      data={myCommunities}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      ListHeaderComponent={() => <Divider color="transparent" size={spacing.padding.large} />}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: spacing.margin.large,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;
