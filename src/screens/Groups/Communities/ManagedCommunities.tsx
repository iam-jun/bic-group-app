import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import CommunityItem from '../components/CommunityItem';
import {ITheme} from '~/theme/interfaces';
import actions from '~/screens/Groups/redux/actions';

interface ManagedCommunitiesProps {
  onPressCommunities?: (communityId: number) => void;
  onPressMenu?: (community?: any) => void;
}

const ManagedCommunities = ({
  onPressCommunities,
  onPressMenu,
}: ManagedCommunitiesProps) => {
  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const {loading, data, items, canLoadMore} = useKeySelector(
    groupsKeySelector.managedCommunities,
  );

  const getManagedCommunities = () => {
    dispatch(actions.getManagedCommunities());
  };

  useEffect(() => {
    getManagedCommunities();
    return () => {
      dispatch(actions.resetManagedCommunities());
    };
  }, []);

  const onLoadMore = () => {
    getManagedCommunities();
  };

  const onRefresh = () => {
    dispatch(actions.resetManagedCommunities());
    getManagedCommunities();
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_communities:title"
        description="communities:empty_communities:manage_description"
      />
    );
  };

  const renderItem = ({item}: {item: number}) => {
    const currentItem = items[item];

    return (
      <CommunityItem
        item={currentItem}
        onPressMenu={onPressMenu}
        onPressCommunities={onPressCommunities}
      />
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && data.length > 0)
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator testID="managed_communites.loading_more" />
        </View>
      );

    return null;
  };

  return (
    <FlatList
      testID="flatlist"
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_item_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={theme.colors.borderDisable}
        />
      }
      ItemSeparatorComponent={() => (
        <Divider
          style={{
            marginVertical: spacing.margin.tiny,
            marginHorizontal: spacing.margin.large,
          }}
        />
      )}
    />
  );
};

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default ManagedCommunities;
