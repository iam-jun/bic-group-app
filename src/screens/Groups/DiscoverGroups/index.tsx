import React, {useEffect} from 'react';
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

const DiscoverGroups = ({route}: any) => {
  const {communityId} = route.params;
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

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

  const onPressGroup = () => {
    alert('Go to group');
  };

  const onPressJoin = () => {
    alert('Request Join');
  };

  const onPressCancel = () => {
    alert('Cancel Join');
  };

  const renderItem = ({item}: {item: number}) => {
    return (
      <DiscoverItem
        id={item}
        onPressGroup={onPressGroup}
        onPressJoin={onPressJoin}
        onPressCancel={onPressCancel}
      />
    );
  };

  const renderEmptyComponent = () => {
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_groups:title"
        description="communities:empty_groups:description"
      />
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
      />
      <ListView
        data={data}
        loading={loading}
        isFullView
        renderItem={renderItem}
        onEndReached={onLoadMore}
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
      marginHorizontal: spacing.margin.large,
    },
  });
};
