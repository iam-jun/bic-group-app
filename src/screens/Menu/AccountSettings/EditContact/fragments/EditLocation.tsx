import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
import ViewSpacing from '~/beinComponents/ViewSpacing';

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
  const insets = useSafeAreaInsets();

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
    <BottomSheet
      modalizeRef={modalizeRef}
      modalStyle={styles.modalStyle}
      childrenStyle={styles.childrenStyle}
      ContentComponent={
        <KeyboardAvoidingView
          testID="edit_location.keyboard_avoiding_view"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={true}
          style={styles.contentComponent}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? 0 : Platform.OS === 'android' ? 60 : 0
          }>
          <Text.BodyS useI18n style={styles.titleSearch}>
            settings:title_choose_location
          </Text.BodyS>
          <SearchInput
            testID="edit_location.search"
            style={styles.searchInput}
            autoFocus
            placeholder={i18next.t('input:search_location')}
            onChangeText={onQueryChanged}
          />
          <Divider style={styles.divider} />
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={styles.listView}
            scrollEventThrottle={16}>
            {(searchQuery ? searchResult : data || []).map(
              (item: ILocation) => (
                <View key={item?.country + item?.type + item?.name}>
                  {renderItem({item})}
                </View>
              ),
            )}
            <ViewSpacing height={insets?.bottom || 0} />
          </ScrollView>
        </KeyboardAvoidingView>
      }
    />
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
      paddingHorizontal: spacing.margin.base,
      paddingBottom: spacing.margin.large,
    },
    contentComponent: {
      maxHeight: 0.8 * screenHeight,
      borderTopRightRadius: spacing.borderRadius.small,
      borderTopLeftRadius: spacing.borderRadius.small,
    },
    divider: {
      marginTop: spacing.margin.small,
    },
    modalStyle: {
      borderTopRightRadius: spacing.borderRadius.small,
      borderTopLeftRadius: spacing.borderRadius.small,
      maxHeight: 0.8 * screenHeight,
      paddingTop: 0,
    },
    titleSearch: {
      marginLeft: spacing.margin.large,
      marginTop: spacing.margin.extraLarge,
    },
    childrenStyle: {
      paddingBottom: 0,
    },
  });
};
