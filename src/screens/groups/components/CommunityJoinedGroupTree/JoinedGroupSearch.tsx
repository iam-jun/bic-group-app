import { debounce } from 'lodash';
import React, { FC, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import spacing from '~/theme/spacing';

import useCommunityJoinedGroupTreeStore from './store';
import GroupList from '~/components/groups/GroupList';
import { IGroup } from '~/interfaces/IGroup';

export interface JoinedGroupSearchProps {
  communityId: string;
  onPressItem: (item: IGroup) => void;
}

const JoinedGroupSearch: FC<JoinedGroupSearchProps> = ({ communityId, onPressItem }: JoinedGroupSearchProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actions = useCommunityJoinedGroupTreeStore((state) => state.actions);
  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const searchKey = useCommunityJoinedGroupTreeStore((state) => state.searchKey);
  const searchResult = useCommunityJoinedGroupTreeStore((state) => state.searchResult);
  const hasNextPage = useCommunityJoinedGroupTreeStore((state) => state.searchHasNextPage);

  const debounceEndReach = debounce(() => {
    if (hasNextPage) {
      actions.getJoinedGroupSearch(communityId, searchKey, true);
    }
  }, 200);

  const onEndReach = useCallback(() => {
    debounceEndReach();
  },
  [hasNextPage, searchKey]);

  const keyExtractor = useCallback((item: IGroup) => `joined_group_search_${item?.id}`, []);

  if (!searchKey) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={styles.searchResultContainer}
    >
      <GroupList
        mode="flat"
        data={searchResult}
        loading={loading}
        onEndReached={onEndReach}
        keyExtractor={keyExtractor}
        onPressItem={onPressItem}
      />
    </Animated.View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    searchResultContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.neutral,
    },
    itemGroupSearch: {
      paddingVertical: spacing.padding.small,
      marginHorizontal: spacing.padding.small,
    },
  });
};

export default JoinedGroupSearch;
