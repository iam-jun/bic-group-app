import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { SearchInput } from '~/baseComponents/Input';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import JoinedGroupSearch from '~/screens/groups/components/CommunityJoinedGroupTree/JoinedGroupSearch';
import useCommunityJoinedGroupTreeStore from './store';
import modalActions from '~/storeRedux/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroup } from '~/interfaces/IGroup';
import { useRootNavigation } from '~/hooks/navigation';
import spacing from '~/theme/spacing';
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
  const styles = createStyle(theme);

  const id = communityId || teamName;

  const resetStore = useCommunityJoinedGroupTreeStore((state) => state.reset);
  const actions = useCommunityJoinedGroupTreeStore((state) => state.actions);
  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const data = useCommunityJoinedGroupTreeStore((state) => state.data);
  const joinedGroups: IGroup[] = data?.[id] || [];

  useEffect(() => () => {
    resetStore();
  }, []);

  useEffect(() => {
    actions.getJoinedGroupTree(communityId);
  }, [communityId]);

  const onPressGroup = useCallback((group: IGroup) => {
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
  }, []);

  const onChangeText = debounce((text: string) => {
    actions.setSearchKey(text);
    if (text) {
      actions.getJoinedGroupSearch(communityId, text);
    }
  }, 500);

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      showPrivacyAvatar
      showInfo={false}
      onPressGroup={onPressGroup}
      groupStyle={styles.itemGroup}
      style={styles.itemTreeGroup}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    return (
      <EmptyScreen
        size={100}
        source={images.img_empty_search_post}
        description="error:no_group_found_title"
      />
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
        <JoinedGroupSearch onPressItem={onPressGroup} />
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
