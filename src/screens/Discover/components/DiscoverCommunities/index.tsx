import React, { FC, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import EmptyScreen from '~/components/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import useDiscoverCommunitiesStore from './store';
import useCommunityController from '~/screens/communities/store';
import useCommunitiesStore from '~/store/entities/communities';
import useTermStore from '~/components/TermsModal/store';

type HandleJoinCommunityData = {
  id: string;
  name: string;
  isActiveGroupTerms: boolean;
  rootGroupId: string;
};

type ItemDiscoverCommunitiesProps = {
  id: string;
  handleJoin: (data: HandleJoinCommunityData) => void;
  handleCancel: (id: string, name: string) => void;
};

const ItemDiscoverCommunities: FC<ItemDiscoverCommunitiesProps> = ({
  id,
  handleJoin,
  handleCancel,
}) => {
  const item = useCommunitiesStore((state) => state.data[id]);
  const isActiveGroupTerms = item?.settings?.isActiveGroupTerms || false;
  const rootGroupId = item?.groupId || '';

  return (
    <CommunityGroupCard
      item={item}
      testID="discover_communities_item"
      onJoin={(id: string, name: string) => {
        const data = {
          id,
          name,
          isActiveGroupTerms,
          rootGroupId,
        } as any;
        handleJoin(data);
      }}
      onCancel={handleCancel}
    />
  );
};

const DiscoverCommunities = () => {
  const theme: ExtendedTheme = useTheme();

  const {
    ids, loading, refreshing, hasNextPage, actions,
  }
    = useDiscoverCommunitiesStore();

  const communityController = useCommunityController((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

  const renderEmptyComponent = () => {
    if (hasNextPage) {
      return null;
    }

    return (
      <EmptyScreen
        icon="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
      />
    );
  };

  const renderListFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={styles.listFooter}
        testID="discover_communities.loading_more_indicator"
      >
        <ActivityIndicator />
      </View>
    );
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getDiscoverCommunities();
    }
  };

  const onRefresh = () => {
    actions.getDiscoverCommunities(true);
  };

  const handleJoin = (data: HandleJoinCommunityData) => {
    if (!!data?.isActiveGroupTerms) {
      const payload = {
        groupId: data.id,
        rootGroupId: data.rootGroupId,
        name: data.name,
        type: 'community',
        isActive: true,
      } as any;
      termsActions.setTermInfo(payload);
      return;
    }
    communityController.joinCommunity(data.id, data.name);
  };

  const handleCancel = (id: string, name: string) => {
    communityController.cancelJoinCommunity(id, name);
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <ItemDiscoverCommunities
      id={item}
      handleJoin={handleJoin}
      handleCancel={handleCancel}
    />
  );

  useEffect(() => {
    if (ids.length === 0) {
      actions.getDiscoverCommunities();
    }
  }, []);

  return (
    <FlatList
      testID="discover_communities.list"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      ItemSeparatorComponent={() => (
        <Divider color="transparent" size={spacing.padding.large} />
      )}
      ListHeaderComponent={() => (
        <Divider color="transparent" size={spacing.padding.large} />
      )}
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

export default DiscoverCommunities;
