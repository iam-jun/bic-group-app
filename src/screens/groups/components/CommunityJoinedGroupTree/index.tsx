import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { SearchInput } from '~/baseComponents/Input';
import JoinedGroupSearch from '~/screens/groups/components/CommunityJoinedGroupTree/JoinedGroupSearch';
import useCommunityJoinedGroupTreeStore from './store';
import modalActions from '~/storeRedux/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroup } from '~/interfaces/IGroup';
import { useRootNavigation } from '~/hooks/navigation';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import GroupList from '~/components/groups/GroupList';

export interface CommunityJoinedGroupsProps {
  communityId?: string;
  teamName?: string;
}

const CommunityJoinedGroupTree: FC<CommunityJoinedGroupsProps> = (
  { communityId, teamName = 'bein' }: CommunityJoinedGroupsProps,
) => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const id = communityId || teamName;

  const resetStore = useCommunityJoinedGroupTreeStore((state) => state.reset);
  const actions = useCommunityJoinedGroupTreeStore((state) => state.actions);
  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const joinedGroups = useCommunityJoinedGroupTreeStore(useCallback((state) => state.data?.[id], [id]));

  useEffect(() => () => {
    resetStore();
  }, []);

  useEffect(() => {
    actions.getJoinedGroupTree(communityId);
  }, [communityId]);

  const onPressGroup = useCallback((group: IGroup) => {
    dispatch(modalActions.hideModal());
    const isGroup = group?.level > 0;
    if (group.communityId && !isGroup) {
      rootNavigation.navigate(mainStack.communityDetail, {
        communityId: group.communityId,
      });
    } else {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId: group.id,
          communityId: group?.communityId || communityId,
        },
      );
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
