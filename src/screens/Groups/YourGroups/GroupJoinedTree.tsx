import React, {FC, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import ListView from '~/beinComponents/list/ListView';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import {IGroup} from '~/interfaces/IGroup';

export interface GroupJoinedTreeProps {
  communityId: number;
}

const GroupJoinedTree: FC<GroupJoinedTreeProps> = ({
  communityId,
}: GroupJoinedTreeProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const data = useKeySelector(groupsKeySelector.yourGroupsTreeData);
  const {list, loading} = data || {};

  const getData = () => {
    dispatch(groupsActions.getYourGroupsTree(communityId));
  };

  useEffect(() => {
    getData();
    return () => {
      dispatch(groupsActions.setYourGroupsTree({loading: true, list: []}));
    };
  }, []);

  const renderEmpty = () => {
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_groups:title"
        description="communities:empty_groups:description"
      />
    );
  };

  const onToggle = (group: IGroup, isCollapse: boolean) => {
    console.log(
      `\x1b[34m🐣️ GroupJoinedTree onToggle`,
      `${JSON.stringify(
        {communityId, groupId: group.id, status: isCollapse},
        undefined,
        2,
      )}\x1b[0m`,
    );
  };

  const renderItem = ({item}: any) => {
    return (
      <FlatGroupItem
        showPrivacy
        showPrivacyName={false}
        onToggle={onToggle}
        {...item}
      />
    );
  };

  return (
    <View testID={'group_joined_tree'} style={styles.container}>
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

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    dataList: {
      flex: 1,
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
  });
};

export default GroupJoinedTree;
