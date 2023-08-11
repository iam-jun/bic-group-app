import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import {
  ActivityIndicator, FlatList, StyleSheet, View,
} from 'react-native';
import { spacing } from '~/theme';
import { IInvitedPeople } from '~/interfaces/IGroup';
import Invitee from './components/Invitee';
import NoOneIsInvited from './components/NoOneIsInvited';
import Text from '~/baseComponents/Text';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import { ITypeGroup } from '~/interfaces/common';

export interface CommunityInvitedPeopleProps {
  groupId: string;
  type: ITypeGroup;
}

const CommunityInvitedPeople = ({ groupId, type }: CommunityInvitedPeopleProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const invitedPeople = useGroupJoinableUsersStore((state) => state.invitedPeople);
  const {
    data, canLoadMore, isLoading, isRefreshing,
  } = invitedPeople;
  const { getInvitations, clearInvitedPeople } = useGroupJoinableUsersStore((state) => state.actions);

  useEffect(() => {
    (async () => {
      await getData();
    })();
    return () => {
      clearInvitedPeople();
    };
  }, []);

  const getData = async (isRefresh?: boolean) => {
    await getInvitations(groupId, isRefresh);
  };

  const onRefresh = async () => {
    await getData(true);
  };

  const onLoadMore = async () => {
    if (!canLoadMore) return;
    await getData();
  };

  const renderItem = ({ item }: { item: IInvitedPeople }) => <Invitee item={item} />;

  const renderEmptyComponent = () => {
    if (isLoading) {
      return renderLoading();
    }
    return <NoOneIsInvited type={type} groupId={groupId} />;
  };

  const renderFooterComponent = () => {
    if (data.length === 0) {
      return null;
    }
    if (!canLoadMore && data.length > 0) {
      return (
        <Text.BodyM
          testID="flatlist.text_you_have_seen_it_all"
          style={styles.footerContainer}
          color={colors.neutral30}
          useI18n
        >
          common:text_you_have_seen_it_all
        </Text.BodyM>
      );
    }
    return renderLoading();
  };

  const renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator />
    </View>
  );

  const renderItemSeparatorComponent = () => <View style={styles.separator} />;

  const keyExtractor = (item, index) => `community_invited_people_${item}_${index}`;

  return (
    <FlatList
      testID="flatlist"
      data={data}
      renderItem={renderItem}
      initialNumToRender={15}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.gray40} />
      }
      ItemSeparatorComponent={renderItemSeparatorComponent}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    listFooter: {
      marginBottom: spacing.margin.large,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loading: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.big,
    },
    separator: {
      height: 1,
      backgroundColor: colors.neutral5,
    },
    footerContainer: {
      alignSelf: 'center',
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default CommunityInvitedPeople;
