import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import CommunityItem from '../components/CommunityItem';

import actions from '~/screens/Groups/redux/actions';
import spacing from '~/theme/spacing';

interface ManagedCommunitiesProps {
  onPressCommunities?: (communityId: string) => void;
  onPressMenu?: (community?: any) => void;
}

const ManagedCommunities = ({
  onPressCommunities,
  onPressMenu,
}: ManagedCommunitiesProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const {
    loading, ids, items, canLoadMore,
  } = useKeySelector(
    groupsKeySelector.managedCommunities,
  );

  const getManagedCommunities = (params?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => {
    const { isRefreshing, refreshNoLoading } = params || {};
    dispatch(actions.getManagedCommunities({ isRefreshing, refreshNoLoading }));
  };

  useEffect(() => {
    getManagedCommunities({ refreshNoLoading: true });
  }, []);

  const onLoadMore = () => {
    canLoadMore && getManagedCommunities();
  };

  const onRefresh = () => {
    getManagedCommunities({ isRefreshing: true });
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:manage_description"
      />
    );
  };

  const renderItem = ({ item }: {item: number}) => {
    const currentItem = items[item];

    return (
      <CommunityItem
        item={currentItem}
        onPressMenu={onPressMenu}
        onPressCommunities={onPressCommunities}
      />
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && ids.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="managed_communites.loading_more" />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_item_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
      ItemSeparatorComponent={() => (
        <Divider
          style={{
            marginVertical: spacing.margin.tiny,
            marginHorizontal: spacing.margin.large,
          }}
        />
      )}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManagedCommunities;
