import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Text from '~/baseComponents/Text';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunitiesStore, {
  ICommunitiesState,
} from '~/store/entities/communities';
import useTagsStore from '~/store/entities/tags';
import spacing from '~/theme/spacing';
import useTagsControllerStore from '../../store';
import TagItem from './TagItem';

type ListTagsProps = {
  communityId: string;
};

const ListTags: FC<ListTagsProps> = ({ communityId }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const community = useCommunitiesStore(
    useCallback(
      (state: ICommunitiesState) => state.data[communityId] || ({} as ICommunity),
      [communityId],
    ),
  );

  const actions = useTagsControllerStore((state) => state.actions);
  const communityTags = useTagsControllerStore(
    (state) => state.communityTags[communityId],
  );

  const {
    ids, refreshing, loading, hasNextPage,
  } = communityTags || {};

  const { joinStatus, name } = community;

  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const tags = useTagsStore((state) => state.tags);
  console.log('communityName', name);

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <TagItem
      isMember={isMember}
      item={tags[item]}
      communityId={communityId}
      communityName={name}
    />
  );

  const keyExtractor = (item: string) => `tag-${item}`;

  useEffect(() => {
    if (!ids || ids.length === 0) {
      actions.getCommunityTags(communityId);
    }
  }, []);

  const onRefresh = () => {
    actions.getCommunityTags(communityId, true);
  };

  const renderListFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getCommunityTags(communityId);
    }
  };

  const renderEmptyComponent = () => {
    if (hasNextPage) {
      return null;
    }

    return (
      <View style={styles.emptyList}>
        <Text.BodyM useI18n color={colors.neutral60}>tags:empty_list_tags</Text.BodyM>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeaderListTags}>
        <Text.H4 useI18n color={colors.neutral80}>
          tags:title_header_list_tags
        </Text.H4>
      </View>
      <FlatList
        data={ids}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gray40}
          />
        )}
        ListFooterComponent={renderListFooter}
        onEndReached={onLoadMore}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
    },
    viewHeaderListTags: {
      paddingBottom: spacing.padding.tiny,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    listFooter: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyList: {
      paddingVertical: spacing.padding.large,
      alignItems: 'center',
    },
  });
};

export default ListTags;
