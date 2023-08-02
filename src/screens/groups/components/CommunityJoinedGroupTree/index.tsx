import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { SearchInput } from '~/baseComponents/Input';
import JoinedGroupSearch from '~/screens/groups/components/CommunityJoinedGroupTree/JoinedGroupSearch';
import useCommunityJoinedGroupTreeStore from './store';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import GroupList from '~/components/groups/GroupList';
import useModalStore from '~/store/modal';
import { isGroup } from '~/helpers/groups';
import { navigateToCommunityDetail, navigateToGroupDetail } from '~/helpers/common';

export interface CommunityJoinedGroupsProps {
  communityId?: string;
  teamName?: string;
}

const CommunityJoinedGroupTree: FC<CommunityJoinedGroupsProps> = (
  { communityId, teamName = 'bein' }: CommunityJoinedGroupsProps,
) => {
  const { t } = useBaseHook();

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const id = communityId || teamName;

  const resetStore = useCommunityJoinedGroupTreeStore((state) => state.reset);
  const actions = useCommunityJoinedGroupTreeStore((state) => state.actions);
  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const joinedGroups = useCommunityJoinedGroupTreeStore(useCallback((state) => state.data?.[id], [id]));
  const modalActions = useModalStore((state) => state.actions);

  useEffect(() => () => {
    resetStore();
  }, []);

  useEffect(() => {
    actions.getJoinedGroupTree(communityId);
  }, [communityId]);

  const onPressGroup = useCallback((group: IGroup) => {
    modalActions.hideModal();
    if (group.communityId && !isGroup(group)) {
      navigateToCommunityDetail({ communityId: group.communityId });
    } else {
      navigateToGroupDetail({ groupId: group.id, communityId: group?.communityId || communityId });
    }
  }, []);

  const onToggle = debounce((group: IGroup, isCollapsed: boolean) => {
    actions.updateCollapseStatus(
      communityId,
      group.id,
      isCollapsed,
    );
  }, 200);

  const onChangeText = debounce((text: string) => {
    actions.setSearchKey(text);
    if (text) {
      actions.getJoinedGroupSearch(communityId, text);
    }
  }, 500);

  return (
    <View style={styles.container}>
      <SearchInput
        style={styles.searchInput}
        placeholder={t('input:search_group')}
        onChangeText={onChangeText}
      />
      <View style={styles.contentContainer}>
        <GroupList
          mode="tree"
          resetOnHide={false}
          data={joinedGroups}
          loading={loading}
          onToggle={onToggle}
          onPressItem={onPressGroup}
        />
        <JoinedGroupSearch
          communityId={communityId}
          onPressItem={onPressGroup}
        />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: colors.gray5,
    },
    contentContainer: { flex: 1 },
    emptyContainer: {
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.neutral,
    },
    searchInput: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    itemTreeGroup: { marginHorizontal: spacing.padding.large },
    itemGroup: { paddingVertical: spacing.padding.small },
  });
};

export default CommunityJoinedGroupTree;
