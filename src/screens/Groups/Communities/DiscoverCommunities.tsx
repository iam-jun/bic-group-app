import React, { FC, useEffect } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  RefreshControl,
  FlatList,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { scaleSize } from '~/theme/dimension';
import DiscoverItem from '../components/DiscoverItem';
import spacing from '~/theme/spacing';

const screenWidth = Dimensions.get('window').width;

export interface DiscoverCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (communityId: string) => void;
  onPressDiscover?: () => void;
}

const DiscoverCommunities: FC<DiscoverCommunitiesProps> = ({
  onPressCommunities,
}: DiscoverCommunitiesProps) => {
  const data = useKeySelector(groupsKeySelector.discoverCommunitiesData);
  const {
    ids, items, loading, canLoadMore,
  } = data || {};

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  useEffect(() => {
    getData({ refreshNoLoading: true });
  }, []);

  const getData = (params?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => {
    const { isRefreshing, refreshNoLoading } = params || {};
    dispatch(
      groupsActions.getDiscoverCommunities({ isRefreshing, refreshNoLoading }),
    );
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData({ isRefreshing: true });
  };

  const onPressJoin = (communityId: string, communityName: string) => {
    dispatch(groupsActions.joinCommunity({ communityId, communityName }));
  };

  const onPressCancel = (communityId: string, communityName: string) => {
    dispatch(groupsActions.cancelJoinCommunity({ communityId, communityName }));
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return null;
    }
    return (
      <EmptyScreen
        source="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderItem = ({ item, index }: {item: number; index: number}) => {
    const currentItem = items[item];
    return (
      <DiscoverItem
        item={currentItem}
        testID={`discover_communities_item_${index}`}
        onPressView={onPressCommunities}
        onPressJoin={onPressJoin}
        onPressCancel={onPressCancel}
      />
    );
  };

  const renderListFooter = () => {
    if (loading) return null;

    return (
      canLoadMore
      && ids.length > 0 && (
        <View
          style={styles.listFooter}
          testID="discover_communities.loading_more_indicator"
        >
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={<DiscoverHeader list={ids} />}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const DiscoverHeader = ({ list }: any) => {
  const width = screenWidth;
  const height = scaleSize(144);
  if (list?.length > 0) {
    return (
      <Image
        testID="discover_communities.header"
        source={images.img_banner_discover_communities}
        style={{ width, height }}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {},
  item: {
    height: '100%',
    flex: 1,
    paddingVertical: spacing.padding.small,
  },
  iconSmall: {
    marginRight: spacing.margin.tiny,
    height: 16,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  divider: {
    marginVertical: spacing.margin.tiny,
    marginHorizontal: spacing.margin.large,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiscoverCommunities;
