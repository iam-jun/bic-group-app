import React, {
  FC,
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import spacing from '~/theme/spacing';
import RecentSearchKeyword from './RecentSearchKeyword';
import useSearchStore from '../../store';

export type SearchSuggestionProps = {
  searchScreenKey: string;
}

const SearchSuggestion: FC<SearchSuggestionProps> = ({
  searchScreenKey,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const searchText = useSearchStore((state) => state.search[searchScreenKey]?.searchText);

  const ctaText = t('search:text_cta_see_result_for_search_text', { searchText });

  const onPressSearch = () => {
    Keyboard.dismiss();
    actionsSearchStore.updateSearchDataByScreenKey(searchScreenKey, {
      isSuggestion: false,
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });
  };

  return (
    <ScrollView testID="search_suggestion" keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        {searchText?.trim().length > 0 ? (
          <TouchableOpacity
            testID="search_suggestion.btn_text_search"
            style={styles.ctaContainer}
            onPress={onPressSearch}
          >
            <Text.BodyMMedium testID="search_suggestion.text_search" style={styles.ctaText}>{ctaText}</Text.BodyMMedium>
          </TouchableOpacity>
        ) : (
          <RecentSearchKeyword
            searchScreenKey={searchScreenKey}
          />
        )}
      </View>
      <KeyboardSpacer iosOnly />
    </ScrollView>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    ctaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    ctaText: {
      flex: 1,
      color: colors.blue50,
    },
  });
};

export default SearchSuggestion;
