import React, { FC, useEffect } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  RefreshControl,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/components/EmptyScreen';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import CommunityItem from '../../../groups/components/CommunityItem';
import spacing from '~/theme/spacing';

export interface JoinedCommunitiesProps {
  style?: StyleProp<ViewStyle>;
  onPressCommunities?: (communityId: string) => void;
  onPressDiscover?: () => void;
}

const JoinedCommunities: FC<JoinedCommunitiesProps> = ({
  onPressCommunities,
  onPressDiscover,
}: JoinedCommunitiesProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const {
    loading, ids, items, canLoadMore,
  } = useKeySelector(groupsKeySelector.joinedCommunities);

  useEffect(() => {
    getData({ refreshNoLoading: true });
  }, []);

  const getData = (params?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
  }) => {
    const { isRefreshing, refreshNoLoading } = params || {};
    dispatch(groupsActions.getMyCommunities({ isRefreshing, refreshNoLoading }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData({ isRefreshing: true });
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        icon="addUsers"
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
        ButtonComponent={(
          <ButtonWrapper
            testID="empty_screen.button"
            onPress={onPressDiscover}
            style={styles.buttonWrapper}
          >
            <Text.ButtonM useI18n color={theme.colors.purple50}>
              communities:empty_communities:button_text
            </Text.ButtonM>
          </ButtonWrapper>
        )}
      />
    );
  };

  const renderItem = ({ item }: {item: number}) => {
    const currentItem = items[item];

    return (
      <CommunityItem item={currentItem} onPressCommunities={onPressCommunities} />
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && ids.length > 0) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="joined_communites.loading_more" />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={ids}
      renderItem={renderItem}
      keyExtractor={(
        item, index,
      ) => `community_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: spacing.margin.large,
  },
  listFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDivider: {
    marginVertical: spacing.margin.tiny,
    marginHorizontal: spacing.margin.large,
  },
});

export default JoinedCommunities;
