import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import useScoreboardStore from '../../store';
import UserParticipantItem from './UserParticipantItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

interface UsersParticipantsProps {
  contentId: string;
}

const UsersParticipants: React.FC<UsersParticipantsProps> = ({ contentId }) => {
  const {
    data,
    hasNextPage,
    loading,
  } = useScoreboardStore((state) => state.userParticipants);
  const actions = useScoreboardStore((state) => state.actions);

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
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
    />
  );
};

const styles = StyleSheet.create({
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UsersParticipants;
