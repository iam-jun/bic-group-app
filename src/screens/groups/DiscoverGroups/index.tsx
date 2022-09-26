import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import EmptyScreen from '~/components/EmptyScreen';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import images from '~/resources/images';
import useDiscoverGroupsStore from './store';
import IDiscoverGroupsState from './store/Interface';
import { useBaseHook } from '~/hooks';

const DiscoverGroups = ({ route }: any) => {
  const { communityId } = route.params;
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();

  const headerRef = useRef();

  const [searchText, setSearchText] = useState('');

  const doGetDiscoverGroups = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doGetDiscoverGroups);
  const joinNewGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doJoinNewGroup);
  const cancelJoinGroup = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.doCancelJoinGroup);
  const {
    ids, items, loading, canLoadMore, noGroupInCommuntity,
  } = useDiscoverGroupsStore();

  const communityDetail = useKeySelector(groupsKeySelector.communityDetail);

  const getDiscoverGroups = (isRefreshing?: boolean) => {
    doGetDiscoverGroups({ communityId, isRefreshing });
  };

  useEffect(
    () => {
      getDiscoverGroups(true); // refreshing whenever open
    }, [communityId],
  );

  const handleJoinGroup = (groupId: string) => {
    joinNewGroup(groupId);
  };

  const handleCancelJoinGroup = (groupId: string) => {
    cancelJoinGroup(groupId);
  };

  const onLoadMore = () => {
    canLoadMore && getDiscoverGroups();
  };

  const onRefresh = () => {
    getDiscoverGroups(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (headerRef.current) headerRef.current?.setSearchText?.('');
  };

  const onSearchText = debounce(
    (text: string) => {
      setSearchText(text);
      doGetDiscoverGroups({ isRefreshing: true, communityId, params: { key: text } });
    }, 500,
  );

  const renderItem = ({ item, index }: {item: number; index: number}) => {
    const currentItem = {
      ...items[item],
      community: { ...communityDetail },
    };
    return (
      <CommunityGroupCard
        item={currentItem}
        testID={`browse_groups_item_${index}`}
        shouldShowAlertJoinTheCommunityFirst
        isResetCommunityDetail={false}
        onJoin={handleJoinGroup}
        onCancel={handleCancelJoinGroup}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={images.img_empty_search_post}
        description={!!searchText ? 'common:text_search_no_results'
          : noGroupInCommuntity ? 'communities:browse_groups:no_groups'
            : 'communities:browse_groups:joined_all_groups'}
      />
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
        headerRef={headerRef}
        titleTextProps={{ useI18n: true }}
        title="communities:title_browse_groups"
        onSearchText={onSearchText}
        autoFocusSearch
        searchPlaceholder={t('input:search_group')}
      />
      <ViewSpacing height={12} />
      {ids?.length > 0
        ? (
          <FlatList
            testID="flatlist"
            data={ids}
            renderItem={renderItem}
            style={{ flex: 1 }}
            keyExtractor={(
              item, index,
            ) => `groups_${item}_${index}`}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
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
        ) : renderEmptyComponent()}
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
