import React, { FC } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import GroupItem from '~/beinComponents/list/items/GroupItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import spacing from '~/theme/spacing';

import useCommunityJoinedGroupTreeStore from './store';

export interface JoinedGroupSearchProps {
  onPressItem?: (item) => void;
}

const JoinedGroupSearch: FC<JoinedGroupSearchProps> = ({ onPressItem }: JoinedGroupSearchProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const loading = useCommunityJoinedGroupTreeStore((state) => state.loading);
  const searchKey = useCommunityJoinedGroupTreeStore((state) => state.searchKey);
  const searchResult = useCommunityJoinedGroupTreeStore((state) => state.searchResult);

  const renderItem = ({ item }: any) => (
    <GroupItem
      {...item}
      showPrivacyAvatar
      showInfo={false}
      onPressGroup={onPressItem}
      groupStyle={styles.itemGroupSearch}
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
        description="communities:text_your_groups_search_empty"
      />
    );
  };

  if (!searchKey) {
    return null;
  }

  return (
    <View style={styles.searchResultContainer}>
      <FlatList
        keyExtractor={(item) => `joined_group_search_${item?.id}`}
        data={searchResult || []}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
    </View>
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
