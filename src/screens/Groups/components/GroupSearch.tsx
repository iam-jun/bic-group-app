import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';

import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import {useKeySelector} from '~/hooks/selector';
import GroupItemPlaceholder from '~/screens/Groups/components/GroupItemPlaceholder';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {ITheme} from '~/theme/interfaces';

const GroupSearch = () => {
  const [_isShow, _setIsShow] = useState(false);
  const showValue = useSharedValue(0);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const {isShow, loading, searchKey, result} =
    useKeySelector(groupsKeySelector.groupSearch) || {};

  const containerStyle = useAnimatedStyle(() => ({
    opacity: showValue.value,
  }));

  const show = () => {
    _setIsShow(true);
    showValue.value = withSpring(1);
  };

  const hide = () => {
    const onHideDone = () => {
      _setIsShow(false);
    };
    showValue.value = withSpring(0, undefined, isFinished => {
      if (isFinished) {
        runOnJS(onHideDone)();
      }
    });
  };

  useEffect(() => {
    console.log(`\x1b[36m🐣️ GroupSearch \x1b[0m`);
    if (isShow) {
      dispatch(groupsActions.getGroupSearch(searchKey));
    }
  }, [searchKey]);

  useEffect(() => {
    if (isShow) {
      dispatch(groupsActions.getGroupSearch(''));
      show();
    } else {
      hide();
    }
  }, [isShow]);

  if (!_isShow) {
    return null;
  }

  const renderItem = ({item}: any) => {
    return (
      <FlatGroupItem
        {...item}
        groupItemTestID="group_search.item"
        initShowTree={false}
        hidePath={false}
        showSmallestChild
        style={styles.item}
      />
    );
  };

  const renderHeader = () => {
    return (
      <Text.H6 useI18n style={styles.labelHeader}>
        common:text_search_results
      </Text.H6>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View>
          {Array.from(Array(10).keys()).map(item => (
            <GroupItemPlaceholder key={'group_search_placeholder_' + item} />
          ))}
        </View>
      );
    }
    return <NoSearchResult title={'error:no_group_found_title'} />;
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {renderHeader()}
      <FlatList
        scrollEnabled={!loading}
        style={styles.list}
        data={loading ? [] : result}
        keyExtractor={(item, index) =>
          item?.unique || `group_search_${item}_${index}`
        }
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => (
          <ViewSpacing height={spacing.margin.small} />
        )}
      />
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.bgSecondary,
    },
    list: {},
    item: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing?.padding.large,
    },
    labelHeader: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
    },
  });
};

export default GroupSearch;
