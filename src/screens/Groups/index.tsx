import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';
import i18next from 'i18next';

import groupsActions from '~/screens/Groups/redux/actions';
import ListView from '~/beinComponents/list/ListView';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';

import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from './redux/keySelector';
import {scaleSize} from '~/theme/dimension';
import appConfig from '~/configs/appConfig';
import {deviceDimensions} from '~/theme/dimension';
import NoSearchResult from '~/beinFragments/NoSearchResult';

const Groups: React.FC = () => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const loadingJoinedGroups = useKeySelector(
    groupsKeySelector.loadingJoinedGroups,
  );
  const joinedGroups = useKeySelector(groupsKeySelector.joinedGroups);

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    dispatch(groupsActions.getJoinedGroups());
  }, []);

  const searchGroups = (searchQuery: string) => {
    setSearchText(searchQuery);
    dispatch(groupsActions.getJoinedGroups({params: {key: searchQuery}}));
  };

  const searchHandler = useCallback(
    debounce(searchGroups, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (searchQuery: string) => {
    searchHandler(searchQuery);
  };

  const renderEmpty = () => {
    if (!searchText) return null;
    return !loadingJoinedGroups && <NoSearchResult />;
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBar}>
        <SearchInput
          style={styles.searchInput}
          onChangeText={onQueryChanged}
          placeholder={i18next.t('input:search_group')}
        />
      </View>
    );
  };

  const renderDataList = () => {
    return (
      <ListView
        style={styles.dataList}
        type={'flatGroups'}
        loading={loadingJoinedGroups}
        data={joinedGroups}
        isFullView
        ListHeaderComponent={
          loadingJoinedGroups ? null : (
            <Text.H5 useI18n>
              {searchText ? 'groups:search_results' : null}
            </Text.H5>
          )
        }
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
      />
      {renderSearchBar()}
      {renderDataList()}
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
