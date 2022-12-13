import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, ScrollView, useWindowDimensions,
} from 'react-native';
import i18next from 'i18next';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import appConfig from '~/configs/appConfig';
import BottomSheet from '~/baseComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import spacing from '~/theme/spacing';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import { ICityResponseItem } from '~/interfaces/IAuth';
import { searchText } from '~/utils/common';

interface EditLocationProps {
  modalizeRef: any;
  onItemPress: (item: any) => void;
}

const EditLocation = ({ modalizeRef, onItemPress }: EditLocationProps) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, screenHeight,
  );
  const insets = useSafeAreaInsets();

  const city = useUserProfileStore((state) => state.city);

  const [lstResultSearch, setLstResultSearch] = useState<ICityResponseItem[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const doSearch = (searchQuery: string) => {
    if (searchQuery) {
      const resultSearch = city.filter((item) => searchText(
        searchQuery, item.name,
      ));
      setLstResultSearch(resultSearch);
    }
  };

  const searchHandler = useCallback(
    debounce(
      doSearch, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    searchHandler(text);
  };

  const resetSearchText = () => {
    setSearchQuery('');
  };

  const renderItem = ({ item }: { item: ICityResponseItem }) => (
    <PrimaryItem
      testID="edit_location.item"
      title={`${item.name}`}
      onPress={() => onItemPress?.(item)}
    />
  );
  const keyboard = useKeyboard();

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      childrenStyle={styles.childrenStyle}
      onClosed={resetSearchText}
      handlePosition="inside"
      closeSnapPointStraightEnabled={false}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        keyboardDismissMode: 'interactive',
        contentContainerStyle: {
          height: '100%',
        },
      }}
      ContentComponent={(
        <View style={styles.contentComponent}>
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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.listView}
            scrollEventThrottle={16}
          >
            {(searchQuery ? lstResultSearch : city).map((item) => (
              <View key={`${item?.name}-${item?.countryCode}`}>
                {renderItem({ item })}
              </View>
            ))}
            <ViewSpacing height={insets.bottom + 100} />
            <View style={{ height: keyboard?.keyboardHeight || 0 }} />
          </ScrollView>
        </View>
      )}
    />
  );
};

export default EditLocation;

const createStyles = (
  theme: ExtendedTheme, screenHeight: number,
) => StyleSheet.create({
  searchInput: {
    margin: spacing.margin.base,
  },
  listView: {
    paddingHorizontal: spacing.margin.base,
    paddingBottom: spacing.margin.large,
  },
  contentComponent: {
    height: 0.8 * screenHeight,
    borderTopRightRadius: spacing.borderRadius.small,
    borderTopLeftRadius: spacing.borderRadius.small,
    paddingBottom: spacing.margin.large,
  },
  divider: {
    marginTop: spacing.margin.small,
  },
  titleSearch: {
    marginLeft: spacing.margin.large,
    marginTop: spacing.margin.extraLarge,
  },
  childrenStyle: {
    paddingBottom: 0,
    maxHeight: 0.8 * screenHeight,
  },
});
