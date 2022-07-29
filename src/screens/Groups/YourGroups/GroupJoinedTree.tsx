import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import groupsActions from '~/screens/Groups/redux/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import ListView from '~/beinComponents/list/ListView';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';

export interface GroupJoinedTreeProps {
  communityId: string;
}

const GroupJoinedTree: FC<GroupJoinedTreeProps> = ({
  communityId,
}: GroupJoinedTreeProps) => {
  const dispatch = useDispatch();

  const data = useKeySelector(groupsKeySelector.yourGroupsTreeData);
  const { list, loading } = data || {};

  const getData = () => {
    dispatch(groupsActions.getYourGroupsTree(communityId));
  };

  useEffect(
    () => {
      getData();
      return () => {
        dispatch(groupsActions.setYourGroupsTree({ loading: true, list: [] }));
      };
    }, [],
  );

  const renderEmpty = () => (
    <EmptyScreen
      source="addUsers"
      title="communities:empty_groups:title"
      description="communities:empty_groups:description"
    />
  );

  const onToggle = debounce(
    (
      group: IGroup, isCollapse: boolean,
    ) => {
      dispatch(groupsActions.putGroupStructureCollapseStatus({
        communityId,
        groupId: group.id,
        isCollapse,
      }));
    }, 200,
  );

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      showPrivacy
      showPrivacyName={false}
      onToggle={onToggle}
      {...item}
    />
  );

  return (
    <View testID="group_joined_tree" style={styles.container}>
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
    marginLeft: spacing.margin.base,
    marginRight: spacing.margin.large,
  },
});

export default GroupJoinedTree;
