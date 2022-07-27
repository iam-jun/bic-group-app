import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import ListView from '~/beinComponents/list/ListView';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import GroupItem from '~/beinComponents/list/items/GroupItem';
import spacing from '~/theme/spacing';

export interface GroupJoinedListProps {
  communityId: string;
}

const GroupJoinedList: FC<GroupJoinedListProps> = ({
  communityId,
}: GroupJoinedListProps) => {
  const dispatch = useDispatch();

  const data = useKeySelector(groupsKeySelector.yourGroupsListData);
  const { list, loading } = data || {};

  const getData = () => {
    dispatch(groupsActions.getYourGroupsList(communityId));
  };

  useEffect(() => {
    getData();
    return () => {
      dispatch(groupsActions.setYourGroupsList({ loading: true, list: [] }));
    };
  }, []);

  const renderEmpty = () => (
    <EmptyScreen
      source="addUsers"
      title="communities:empty_groups:title"
      description="communities:empty_groups:description"
    />
  );

  const renderItem = ({ item }: any) => <GroupItem showPrivacy showPrivacyName={false} {...item} />;

  return (
    <View testID="group_joined_list" style={styles.container}>
      <ListView
        containerStyle={styles.dataList}
        data={list || []}
        onRefresh={getData}
        refreshing={loading}
        isFullView
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        showItemSeparator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dataList: {
    flex: 1,
    marginLeft: spacing.margin.large,
    marginRight: spacing.margin.large,
  },
});

export default GroupJoinedList;
