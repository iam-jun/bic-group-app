import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import ListView from '~/beinComponents/list/ListView';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import GroupItem from '~/beinComponents/list/items/GroupItem';
import Text from '~/beinComponents/Text';

const YourGroupsSearch = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {showSearch, loading, key, list} = useKeySelector(
    groupsKeySelector.yourGroupsSearchData,
  );

  const containerStyle = useAnimatedStyle(() => ({}));

  if (!showSearch) {
    return null;
  }

  const renderEmpty = () => {
    const desc = !key?.trim?.()
      ? 'communities:text_your_groups_search_input'
      : 'communities:text_your_groups_search_empty';
    return !loading && <EmptyScreen description={desc} />;
  };

  const renderItem = ({item}: any) => {
    return <GroupItem showPrivacy {...item} />;
  };

  const renderHeader = () => {
    if (list?.length > 0) {
      return (
        <Text.H5 style={styles.headerText} useI18n>
          groups:search_results
        </Text.H5>
      );
    }
    return null;
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <ListView
        containerStyle={styles.dataList}
        data={list || []}
        refreshing={loading}
        isFullView
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        showItemSeparator={false}
      />
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
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
      marginLeft: spacing.margin.large,
      marginRight: spacing.margin.large,
    },
    headerText: {
      marginTop: spacing.margin.base,
      marginBottom: spacing.margin.base,
    },
  });
};

export default YourGroupsSearch;
