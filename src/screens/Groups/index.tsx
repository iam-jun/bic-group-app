import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, useWindowDimensions, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import ListView from '~/beinComponents/list/ListView';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from './redux/keySelector';
import {deviceDimensions} from '~/theme/dimension';
import {useBackPressListener, useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import GroupSearch from '~/screens/Groups/components/GroupSearch';
import appActions from '~/store/app/actions';
import {debounce} from 'lodash';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import images from '~/resources/images';

const Groups: React.FC = (props: any) => {
  const {communityId} = props?.route?.params || {};

  const listRef = useRef<any>();
  const headerRef = useRef<any>();

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

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const getData = () => {
    !!communityId &&
      dispatch(groupsActions.getCommunityGroups({id: communityId}));
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

  const onSearchText = debounce((searchText: string) => {
    dispatch(groupsActions.setGroupSearch({searchKey: searchText}));
  }, 300);

  const renderEmpty = () => {
    return (
      !loadingJoinedGroups && (
        <EmptyScreen
          source={'addUsers'}
          title="groups:text_this_place_looks_lonely"
          description="groups:text_join_community_get_updated"
        />
      )
    );
  };

  const renderDataList = () => {
    return (
      <ListView
        listRef={listRef}
        containerStyle={styles.dataList}
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
        headerRef={headerRef}
        title="tabs:groups"
        titleTextProps={{useI18n: true}}
        searchInputTestID="groups.search_input"
        searchIconTestID="groups.search_icon"
        removeBorderAndShadow={isLaptop}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
        avatar={images.logo_bein}
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
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
  });
};

export default Groups;
