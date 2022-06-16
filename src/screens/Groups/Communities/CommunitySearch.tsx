import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import CommunityItem from '../components/CommunityItem';
import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import groupsActions from '../redux/actions';

const CommunitySearch = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const {showSearch, loading, key, ids, items, canLoadMore} = useKeySelector(
    groupsKeySelector.communitySearch,
  );

  if (!showSearch) return null;

  const onPressCommunity = (communityId: number) => {
    rootNavigation.navigate(groupStack.communityDetail, {communityId});
  };

  const onLoadMore = () => {
    dispatch(groupsActions.getCommunitySearch({key, isLoadMore: true}));
  };

  const renderListHeader = () => {
    if (ids?.length > 0) {
      return (
        <Text.H5 style={styles.headerText} useI18n>
          groups:search_results
        </Text.H5>
      );
    }
    return null;
  };

  const renderItem = ({item}: {item: number}) => {
    const currentItem = items[item];
    return (
      <CommunityItem item={currentItem} onPressCommunities={onPressCommunity} />
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderListFooter = () => {
    if (!loading && canLoadMore && ids.length > 0) return renderLoading();
    return null;
  };

  const renderEmptyScreen = () => {
    if (loading) return null;

    const desc = !key?.trim?.()
      ? 'communities:text_your_groups_search_input'
      : 'communities:text_your_groups_search_empty';

    return <EmptyScreen description={desc} />;
  };

  return (
    <View style={styles.container}>
      {loading && renderLoading()}

      <FlatList
        testID="flatlist"
        data={ids}
        renderItem={renderItem}
        keyExtractor={(item, index) => `search_item_${item?.id}_${index}`}
        style={styles.dataList}
        ListEmptyComponent={renderEmptyScreen}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: colors.background,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
    },
    dataList: {
      flex: 1,
    },
    headerText: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
    loading: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
    },
  });
};

export default CommunitySearch;
