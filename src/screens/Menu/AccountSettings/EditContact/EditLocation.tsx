import React, {useState, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../redux/keySelector';
import menuActions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import appConfig from '~/configs/appConfig';
import {ILocation} from '~/interfaces/common';

const EditLocation = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {id} = myProfile || {};
  const locationList = useKeySelector(menuKeySelector.locationList);
  const {data, searchResult} = locationList || {};

  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateBack = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.editContact);
    }
  };

  const doSearch = (searchQuery: string) => {
    searchQuery && dispatch(menuActions.searchLocation(searchQuery));
  };

  const searchHandler = useCallback(
    debounce(doSearch, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    searchHandler(text);
  };

  const onSelectLocation = (item: ILocation) => {
    dispatch(
      menuActions.editMyProfile(
        {id, country: item.country, city: item.name},
        i18next.t('settings:title_location'),
        navigateBack,
      ),
    );
  };

  const renderItem = ({item}: {item: ILocation}) => {
    return (
      <PrimaryItem
        testID={'edit_location.item'}
        height={34}
        title={`${item.name}, ${item.country}`}
        onPress={() => onSelectLocation(item)}
      />
    );
  };

  return (
    <ScreenWrapper testID="EditLocation" isFullView>
      <Header
        title={'settings:title_choose_location'}
        titleTextProps={{useI18n: true}}
        onPressBack={navigateBack}
      />

      <SearchInput
        testID="edit_location.search"
        style={styles.searchInput}
        autoFocus
        placeholder={i18next.t('input:search_location')}
        onChangeText={onQueryChanged}
      />

      <ListView
        data={searchQuery ? searchResult : data}
        removeClippedSubviews={true}
        style={styles.listView}
        isFullView
        keyboardShouldPersistTaps="always"
        renderItem={renderItem}
        initialNumToRender={appConfig.recordsPerPage}
      />
    </ScreenWrapper>
  );
};

export default EditLocation;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    searchInput: {
      margin: spacing.margin.base,
    },
    listView: {
      marginHorizontal: spacing.margin.base,
      marginBottom: spacing.margin.large,
    },
  });
};
