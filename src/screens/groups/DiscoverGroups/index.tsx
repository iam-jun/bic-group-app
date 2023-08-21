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

import CommunityGroupCard from '~/components/CommunityGroupCard';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import images from '~/resources/images';
import useDiscoverGroupsStore from './store';
import IDiscoverGroupsState from './store/Interface';
import { useBaseHook } from '~/hooks';
import useCommunitiesStore from '~/store/entities/communities';
import useTermStore, { TermsInfo } from '~/components/TermsModal/store';
import TermsView from '~/components/TermsModal';
import MemberQuestionsModal from '~/components/MemberQuestionsModal';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '~/components/MemberQuestionsModal/store';
import PreviewJoinableGroup from '~/components/PreviewJoinableGroup';
import useModalStore from '~/store/modal';
import { ITypeGroup } from '~/interfaces/common';
import { getPreviewJoinableGroup } from '~/components/PreviewJoinableGroup/store/helper';

type HandleJoinGroupData = {
  isActiveGroupTerms: boolean;
  isActiveMembershipQuestions: boolean;
  groupId: string;
};

const DiscoverGroups = ({ route }: any) => {
  const { communityId } = route.params;
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();

  const headerRef = useRef();

  const [searchText, setSearchText] = useState('');

  const actions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);
  const {
    ids, items, loading, canLoadMore, noGroupInCommuntity,
  } = useDiscoverGroupsStore();

  const communityDetail = useCommunitiesStore((state) => state.data[communityId]);

  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);

  const getDiscoverGroups = (isRefreshing?: boolean) => {
    actions.getDiscoverGroups({ communityId, isRefreshing });
  };

  const { showModal } = useModalStore((state) => state.actions);

  useEffect(
    () => {
      getDiscoverGroups(true); // refreshing whenever open
    }, [communityId],
  );

  const handleJoinGroup = async ({ isActiveGroupTerms, groupId, isActiveMembershipQuestions }: HandleJoinGroupData) => {
    try {
      const isShowModalPreviewJoinableGroup = await getPreviewJoinableGroup(groupId);
      if (isShowModalPreviewJoinableGroup) {
        showModal({
          isOpen: true,
          ContentComponent: <PreviewJoinableGroup group={items[groupId]} />,
        });
        return;
      }

      const {
        name, icon, privacy, userCount,
      } = items[groupId];

      if (isActiveMembershipQuestions) {
        const payload: MembershipQuestionsInfo = {
          groupId,
          name,
          icon,
          privacy,
          userCount,
          rootGroupId: groupId,
          type: ITypeGroup.GROUP,
          isActive: true,
          isActiveGroupTerms,
        };
        membershipQuestionActions.setMembershipQuestionsInfo(payload);
        return;
      }

      if (isActiveGroupTerms) {
        const payload = {
          groupId,
          rootGroupId: groupId,
          name,
          icon,
          privacy,
          userCount,
          type: ITypeGroup.GROUP,
          isActive: true,
        } as TermsInfo;
        termsActions.setTermInfo(payload);
        return;
      }
      actions.joinNewGroup(groupId);
    } catch (error) {
      return null;
    }
  };

  const handleCancelJoinGroup = (groupId: string) => {
    actions.cancelJoinGroup(groupId);
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
      actions.getDiscoverGroups({ isRefreshing: true, communityId, params: { key: text } });
    }, 500,
  );

  const renderItem = ({ item }: {item: string;}) => {
    const currentItem = {
      ...items[item],
      community: { ...communityDetail },
    };

    const isActiveGroupTerms = currentItem?.affectedSettings?.isActiveGroupTerms || false;
    const isActiveMembershipQuestions = currentItem?.affectedSettings?.isActiveMembershipQuestions || false;

    const data: HandleJoinGroupData = { isActiveGroupTerms, groupId: item, isActiveMembershipQuestions };

    return (
      <CommunityGroupCard
        item={currentItem}
        testID="discover_groups.items"
        type={ITypeGroup.GROUP}
        shouldShowAlertJoinTheCommunityFirst
        onJoin={() => { handleJoinGroup(data); }}
        onCancel={handleCancelJoinGroup}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return <ActivityIndicator testID="discover_groups.loading" />;
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
            testID="discover_groups.list_group"
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
      <MemberQuestionsModal />
      <TermsView />
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
