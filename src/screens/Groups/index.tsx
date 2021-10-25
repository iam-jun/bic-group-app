import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import ListView from '~/beinComponents/list/ListView';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from './redux/keySelector';
import {deviceDimensions} from '~/theme/dimension';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import {useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import GroupSearch from '~/screens/Groups/components/GroupSearch';

const Groups: React.FC = () => {
  const listRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const loadingJoinedGroups = useKeySelector(
    groupsKeySelector.loadingJoinedGroups,
  );
  const joinedGroups = useKeySelector(groupsKeySelector.joinedGroups);

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  useEffect(() => {
    getData();
  }, []);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'groups') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const getData = () => {
    dispatch(groupsActions.getJoinedGroups());
  };

  const onShowSearch = (isShow: boolean) => {
    dispatch(
      groupsActions.setGroupSearch({
        isShow: isShow,
        loading: false,
        searchKey: '',
        result: [],
      }),
    );
  };

  const onSearchText = (searchText: string) =>
    dispatch(groupsActions.setGroupSearch({searchKey: searchText}));

  const renderEmpty = () => {
    return !loadingJoinedGroups && <NoSearchResult />;
  };

  const renderDataList = () => {
    return (
      <ListView
        listRef={listRef}
        style={styles.dataList}
        type={'flatGroups'}
        data={joinedGroups}
        onRefresh={getData}
        refreshing={loadingJoinedGroups}
        isFullView
        ListEmptyComponent={renderEmpty}
      />
    );
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        hideBack
        title="tabs:groups"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={isLaptop}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
      />
      <View style={{flex: 1}}>
        {renderDataList()}
        <GroupSearch />
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    containerScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    groupContainer: {
      flex: 1,
    },
    searchInput: {
      flex: 1,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: spacing.margin.large,
    },
    dataList: {
      marginHorizontal: spacing.margin.large,
    },
  });
};

export default Groups;
