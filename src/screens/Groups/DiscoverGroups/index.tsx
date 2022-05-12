import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import DiscoverItem from '../components/DiscoverItem';
import {ITheme} from '~/theme/interfaces';
import actions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import ListView from '~/beinComponents/list/ListView';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

const DiscoverGroups = ({route}: any) => {
  const {communityId} = route.params;
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {data, loading, canLoadMore} = useKeySelector(
    groupsKeySelector.discoverGroups,
  );

  const getDiscoverGroups = () => {
    dispatch(actions.getDiscoverGroups({communityId}));
  };

  useEffect(() => {
    getDiscoverGroups();
    return () => {
      dispatch(actions.resetDiscoverGroups());
    };
  }, [communityId]);

  const onLoadMore = () => {
    getDiscoverGroups();
  };

  const onRefresh = () => {
    dispatch(actions.resetDiscoverGroups());
    getDiscoverGroups();
  };

  const onPressGroup = (groupId: number) => {
    rootNavigation.navigate(groupStack.groupDetail, {groupId});
  };

  const onPressJoin = (groupId: number, groupName: string) => {
    dispatch(actions.joinNewGroup({groupId, groupName}));
  };

  const onPressCancel = (groupId: number, groupName: string) => {
    dispatch(actions.cancelJoinGroup({groupId, groupName}));
  };

  const onSearchText = (searchText: string) => {
    // TODO: Add search
  };

  const renderItem = ({item, index}: {item: number; index: number}) => {
    return (
      <DiscoverItem
        id={item}
        testID={`discover_groups_item_${index}`}
        onPressGroup={onPressGroup}
        onPressJoin={onPressJoin}
        onPressCancel={onPressCancel}
      />
    );
  };

  const renderEmptyComponent = () => {
    return (
      !loading && (
        <EmptyScreen
          source={'addUsers'}
          title="communities:empty_groups:title"
          description="communities:empty_groups:description"
        />
      )
    );
  };

  const renderListFooter = () => {
    return (
      !loading &&
      canLoadMore &&
      data.length > 0 && (
        <View style={styles.listFooter}>
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <ScreenWrapper isFullView>
      <Header
        titleTextProps={{useI18n: true}}
        title={'communities:title_discover_groups'}
        onSearchText={onSearchText}
      />
      <ListView
        data={data}
        isFullView
        renderItem={renderItem}
        onEndReached={onLoadMore}
        refreshing={loading}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderListFooter}
        renderItemSeparator={() => <Divider style={styles.divider} />}
      />
    </ScreenWrapper>
  );
};

export default DiscoverGroups;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      marginVertical: spacing.margin.tiny,
    },
  });
};
