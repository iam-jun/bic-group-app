import React, { FC, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import useJoinedGroupTreeStore from '~/store/communities/joinedGroupTree';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import modalActions from '~/store/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroup } from '~/interfaces/IGroup';
import { useRootNavigation } from '~/hooks/navigation';
import spacing from '~/theme/spacing';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';

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
  const { colors } = theme;
  const styles = createStyle(theme);

  const id = communityId || teamName;

  const joinedGroups = useJoinedGroupTreeStore((state) => get(state, `data.${id}`))
  const loading = useJoinedGroupTreeStore((state) => get(state, 'loading'))
  const getJoinedGroupTree = useJoinedGroupTreeStore((state) => get(state, 'getJoinedGroupTree'))

  useEffect(() => {
    getJoinedGroupTree(communityId)
  }, [communityId])

  const onPressGroup = (group: IGroup) => {
    dispatch(modalActions.hideModal())
    if (group.communityId) {
      rootNavigation.navigate(mainStack.communityDetail, {
        communityId: group.communityId,
      });
    } else {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId: group.id,
          initial: true,
        },
      );
    }
  }

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      showPrivacyAvatar
      showInfo={false}
      onPressGroup={onPressGroup}
      groupStyle={{ paddingVertical: spacing.padding.small }}
      style={{ marginHorizontal: spacing.padding.large }}
    />
  )

  const renderEmpty = () => {
    if (loading) {
      return <LoadingIndicator />
    }
    return (
      <View style={styles.emptyContainer}>
        <Text.SubtitleS color={colors.neutral40}>{t('error:no_group_found_title')}</Text.SubtitleS>
      </View>
    );
  }

  return (
    <FlatList
      keyExtractor={(item) => `joined_group_${item?.id}`}
      data={joinedGroups || []}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    emptyContainer: {
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.neutral,
    },
  });
};

export default CommunityJoinedGroupTree;
