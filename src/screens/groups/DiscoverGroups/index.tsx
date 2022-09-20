import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import EmptyScreen from '~/components/EmptyScreen';

import actions from '../../../storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import images from '~/resources/images';

const DiscoverGroups = ({ route }: any) => {
  const { communityId } = route.params;
  const theme: ExtendedTheme = useTheme();
  const dispatch = useDispatch();

  const {
    ids, items, loading, canLoadMore,
  } = useKeySelector(groupsKeySelector.discoverGroups);
  const communityDetail = useKeySelector(groupsKeySelector.communityDetail);

  const getDiscoverGroups = (isRefreshing?: boolean) => {
    dispatch(actions.getDiscoverGroups({ communityId, isRefreshing }));
  };

  useEffect(
    () => {
      getDiscoverGroups(true); // refreshing whenever open
    }, [communityId],
  );

  const onLoadMore = () => {
    canLoadMore && getDiscoverGroups();
  };

  const onRefresh = () => {
    getDiscoverGroups(true);
  };

  const onSearchText = debounce(
    (searchText: string) => {
      console.log('searchText', searchText);

      // communityId && dispatch(groupsActions.getYourGroupsSearch({ communityId, key: searchText }));
    }, 300,
  );

  const renderItem = ({ item, index }: {item: number; index: number}) => {
    const currentItem = {
      ...items[item],
      community: { name: communityDetail?.name, id: communityDetail?.id },
    };
    return (
      <CommunityGroupCard item={currentItem} testID={`browse_groups_item_${index}`} />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
        <EmptyScreen
          source={images.img_empty_search_post}
          description="communities:empty_groups:description"
        />
      </View>
    );
  };

  const renderListFooter = () => (
    !loading
      && canLoadMore
      && ids.length > 0 && (
      <View style={styles.listFooter}>
        <ActivityIndicator />
      </View>
    )
  );

  return (
    <ScreenWrapper isFullView style={{ backgroundColor: theme.colors.gray5 }}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="communities:title_browse_groups"
        onSearchText={onSearchText}
      />
      <ViewSpacing height={12} />

      <FlatList
        testID="flatlist"
        data={ids}
        renderItem={renderItem}
        keyExtractor={(
          item, index,
        ) => `groups_${item}_${index}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={() => <ViewSpacing height={16} />}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default DiscoverGroups;

const styles = StyleSheet.create({
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
