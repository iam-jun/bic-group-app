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
  }, []);

  const renderEmpty = () => {
    return (
      !loading && (
        <EmptyScreen
          source={'addUsers'}
          title="groups:text_this_place_looks_lonely"
          description="groups:text_join_community_get_updated"
        />
      )
    );
  };

  const renderItem = ({item}: any) => {
    return <FlatGroupItem {...item} />;
  };

  return (
    <View style={styles.container}>
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
