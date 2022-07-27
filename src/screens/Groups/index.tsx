import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import groupsActions from '~/screens/Groups/redux/actions';

import EmptyScreen from '~/beinFragments/EmptyScreen';
import { useBackPressListener, useTabPressListener } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { ITabTypes } from '~/interfaces/IRouter';
import images from '~/resources/images';
import GroupSearch from '~/screens/Groups/components/GroupSearch';
import spacing from '~/theme/spacing';
import groupsKeySelector from './redux/keySelector';

const Groups: React.FC = (props: any) => {
  const { communityId } = props?.route?.params || {};

  const listRef = useRef<any>();
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const loadingJoinedGroups = useKeySelector(groupsKeySelector.loadingJoinedGroups);
  const joinedGroups = useKeySelector(groupsKeySelector.joinedGroups);

  useEffect(
    () => {
      getData();
    }, [],
  );

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'groups') {
        listRef?.current?.scrollToOffset?.({ animated: true, offset: 0 });
      }
    },
    [listRef],
  );

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const getData = () => {
    !!communityId
      && dispatch(groupsActions.getCommunityGroups({ id: communityId }));
  };

  const onShowSearch = (isShow: boolean) => {
    dispatch(groupsActions.setGroupSearch({
      isShow,
      loading: false,
      searchKey: '',
      result: [],
    }));
  };

  const onSearchText = debounce(
    (searchText: string) => {
      dispatch(groupsActions.setGroupSearch({ searchKey: searchText }));
    }, 300,
  );

  const renderEmpty = () => (
    !loadingJoinedGroups && (
    <EmptyScreen
      source="addUsers"
      title="groups:text_this_place_looks_lonely"
      description="groups:text_join_community_get_updated"
    />
    )
  );

  const renderDataList = () => (
    <ListView
      listRef={listRef}
      containerStyle={styles.dataList}
      type="flatGroups"
      data={joinedGroups}
      onRefresh={getData}
      refreshing={loadingJoinedGroups}
      isFullView
      ListEmptyComponent={renderEmpty}
    />
  );

  return (
    <View style={styles.containerScreen}>
      <Header
        headerRef={headerRef}
        title="tabs:groups"
        titleTextProps={{ useI18n: true }}
        searchInputTestID="groups.search_input"
        searchIconTestID="groups.search_icon"
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
        avatar={images.logo_bein}
      />
      <View style={{ flex: 1 }}>
        {renderDataList()}
        <GroupSearch />
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    containerScreen: {
      flex: 1,
      backgroundColor: colors.white,
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
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
  });
};

export default Groups;
