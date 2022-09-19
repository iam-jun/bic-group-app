import React, { FC, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { SearchInput } from '~/baseComponents/Input';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import useCommunityJoinedGroupTreeStore from './store';
import modalActions from '~/storeRedux/modal/actions';
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

  const actions = useCommunityJoinedGroupTreeStore((state) => state.actions);
  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const data = useCommunityJoinedGroupTreeStore((state) => state.data);
  const searchKey = useCommunityJoinedGroupTreeStore((state) => state.searchKey);
  const searchResult = useCommunityJoinedGroupTreeStore((state) => state.searchResult);
  const joinedGroups: IGroup[] = data?.[id] || [];

  useEffect(() => {
    actions.getJoinedGroupTree(communityId);
  }, [communityId]);

  const onPressGroup = (group: IGroup) => {
    dispatch(modalActions.hideModal());
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
  };

  const onChangeText = (text: string) => {
    actions.setSearchKey(text);
  };

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      showPrivacyAvatar
      showInfo={false}
      onPressGroup={onPressGroup}
      groupStyle={{ paddingVertical: spacing.padding.small }}
      style={{ marginHorizontal: spacing.padding.large }}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text.SubtitleS color={colors.neutral40}>{t('error:no_group_found_title')}</Text.SubtitleS>
      </View>
    );
  };

  const renderSearchResult = () => {
    if (!searchKey) {
      return null;
    }
    console.log(
      '\x1b[34m🐣️ index CommunityJoinedGroupTree',
      `${JSON.stringify(searchResult, undefined, 2)}\x1b[0m`,
    );
    return (
      <View style={styles.searchResultContainer} />
    );
  };

  return (
    <View style={styles.container}>
      <SearchInput
        style={styles.searchInput}
        placeholder={t('input:search_group')}
        onChangeText={onChangeText}
      />
      <View style={styles.contentContainer}>
        <FlatList
          keyExtractor={(item) => `joined_group_${item?.id}`}
          data={joinedGroups || []}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
        />
        {renderSearchResult()}
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
    searchResultContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.neutral,
    },
  });
};

export default CommunityJoinedGroupTree;
