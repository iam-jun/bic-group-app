import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../../../redux/keySelector';
import menuActions from '../../../redux/actions';
import appConfig from '~/configs/appConfig';
import {ILocation} from '~/interfaces/common';
import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';

interface EditLocationProps {
  modalizeRef: any;
  onItemPress: (item: any) => void;
}

const EditLocation = ({modalizeRef, onItemPress}: EditLocationProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme, screenHeight);
  const dispatch = useDispatch();

  const locationList = useKeySelector(menuKeySelector.locationList);
  const {data, searchResult} = locationList || {};

  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const renderItem = ({item}: {item: ILocation}) => {
    return (
      <PrimaryItem
        testID={'edit_location.item'}
        height={34}
        title={`${item.name}, ${item.country}`}
        onPress={() => onItemPress?.(item)}
      />
    );
  };

  return (
    <View>
      <BottomSheet
        modalizeRef={modalizeRef}
        modalStyle={styles.modalStyle}
        ContentComponent={
          <View style={styles.contentComponent}>
            <Text.Subtitle useI18n style={styles.titleSearch}>
              settings:title_choose_location
            </Text.Subtitle>
            <SearchInput
              testID="edit_location.search"
              style={styles.searchInput}
              autoFocus
              placeholder={i18next.t('input:search_location')}
              onChangeText={onQueryChanged}
            />
            <Divider style={styles.divider} />
            <ScrollView
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="always"
              style={styles.listView}>
              {(searchQuery ? searchResult : data || []).map(
                (item: ILocation) => renderItem({item}),
              )}
            </ScrollView>
          </View>
        }
      />
    </View>
  );
};

export default EditLocation;

const createStyles = (theme: ITheme, screenHeight: number) => {
  const {spacing} = theme;

  return StyleSheet.create({
    searchInput: {
      margin: spacing.margin.base,
    },
    listView: {
      marginHorizontal: spacing.margin.base,
      marginBottom: spacing.margin.large,
    },
    contentComponent: {
      minHeight: 0.6 * screenHeight,
      ...Platform.select({
        web: {
          maxHeight: 0.55 * screenHeight,
        },
      }),
    },
    divider: {
      marginTop: spacing.margin.small,
    },
    modalStyle: {
      borderTopRightRadius: spacing.borderRadius.small,
      borderTopLeftRadius: spacing.borderRadius.small,
      maxHeight: 0.8 * screenHeight,
    },
    titleSearch: {
      marginLeft: spacing.margin.large,
    },
  });
};
