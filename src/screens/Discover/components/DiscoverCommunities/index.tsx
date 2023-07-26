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
import useTermStore, { TermsInfo } from '~/components/TermsModal/store';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '~/components/MemberQuestionsModal/store';
import { ITypeGroup } from '~/interfaces/common';

type HandleJoinCommunityData = {
  id: string;
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
  isActiveGroupTerms: boolean;
  isActiveMembershipQuestions: boolean;
  rootGroupId: string;
};

type ItemDiscoverCommunitiesProps = {
  id: string;
  handleJoin: (data: HandleJoinCommunityData) => void;
  handleCancel: (id: string, groupId: string) => void;
};

const ItemDiscoverCommunities: FC<ItemDiscoverCommunitiesProps> = ({
  id,
  handleJoin,
  handleCancel,
}) => {
  const item = useCommunitiesStore((state) => state.data[id]);
  const isActiveGroupTerms = item?.affectedSettings?.isActiveGroupTerms || false;
  const isActiveMembershipQuestions = item?.affectedSettings?.isActiveMembershipQuestions || false;

  const rootGroupId = item?.groupId || '';

  return (
    <CommunityGroupCard
      item={item}
      testID="discover_communities_item"
      onJoin={(payload) => {
        const {
          id, name, icon, privacy, userCount,
        } = payload || {};
        const data = {
          id,
          name,
          icon,
          privacy,
          userCount,
          isActiveGroupTerms,
          isActiveMembershipQuestions,
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
  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
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
    const {
      id, rootGroupId, name, icon, privacy, userCount, isActiveGroupTerms, isActiveMembershipQuestions,
    }
      = data || {};

    if (isActiveMembershipQuestions) {
      const payload: MembershipQuestionsInfo = {
        groupId: id,
        rootGroupId,
        name,
        icon,
        privacy,
        userCount,
        type: ITypeGroup.COMMUNITY,
        isActive: true,
        isActiveGroupTerms,
      };
      membershipQuestionActions.setMembershipQuestionsInfo(payload);
      return;
    }
    if (isActiveGroupTerms) {
      const payload = {
        groupId: id,
        rootGroupId,
        name,
        icon,
        privacy,
        userCount,
        type: ITypeGroup.COMMUNITY,
        isActive: true,
      } as TermsInfo;
      termsActions.setTermInfo(payload);
      return;
    }
    communityController.joinCommunity({
      rootGroupId,
      communityId: id,
      communityName: name,
    });
  };

  const handleCancel = (id: string, groupId: string) => {
    communityController.cancelJoinCommunity({ communityId: id, rootGroupId: groupId });
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
