import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import useScoreboardStore from '../../store';
import UserParticipantItem from './UserParticipantItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

interface UsersParticipantsProps {
  contentId: string;
}

const UsersParticipants: React.FC<UsersParticipantsProps> = ({ contentId }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  
  const {
    data,
    hasNextPage,
    loading,
    refreshing,
  } = useScoreboardStore((state) => state.userParticipants);
  const actions = useScoreboardStore((state) => state.actions);

  const onRefresh = () => {
    actions.getUsersParticipants({ contentId })
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      actions.getUsersParticipants({ contentId, isRefresh: false })
    }
  };

  const renderItem = ({ item }) => <UserParticipantItem data={item} />;

  const renderFooter = () => {
    if (!loading) return <ViewSpacing height={spacing.padding.big} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const keyExtractor = (item) => `quiz-users_participants-${item?.id}`;

  return (
    <FlatList
      testID="users_participants.list"
      // style={styles.container}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gray40}
          // progressViewOffset={HeaderFilterHeight}
        />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UsersParticipants;
