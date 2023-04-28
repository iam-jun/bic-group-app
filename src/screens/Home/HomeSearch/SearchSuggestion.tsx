import React, {
  ForwardRefRenderFunction, useEffect, useState,
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import NFSRecentSearchKeyword from '~/screens/Home/HomeSearch/RecentSearchKeyword';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import spacing from '~/theme/spacing';
import useFeedSearchStore from './store';

export interface NFSSuggestionProps {
  onSelectKeyword?: (keyword: string) => void;
}

const SearchSuggestion: ForwardRefRenderFunction<any, NFSSuggestionProps> = ({
  onSelectKeyword,
}, ref: any) => {
  const [lossInternet, setLossInternet] = useState(false);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const listRecentKeywords = useFeedSearchStore((state) => state.newsfeedSearchRecentKeyword.data);
  const searchText = useFeedSearchStore((state) => state.newsfeedSearch.searchText);
  const actions = useFeedSearchStore((state) => state.actions);

  const ctaText = t('home:newsfeed_search:text_cta_see_result_for_search_text').replace(
    '%SEARCH_TEXT%', searchText,
  );

  useEffect(
    () => {
      if (isInternetReachable) {
        if (
          lossInternet
        && (!listRecentKeywords || listRecentKeywords?.length === 0)
        ) {
          setLossInternet(false);
          actions.getRecentSearchKeywords({
            target: 'post',
            order: 'DESC',
            limit: 10,
            showLoading: true,
          });
        }
      } else {
        setLossInternet(true);
      }
    }, [isInternetReachable],
  );

  useEffect(
    () => {
    // timeout wait animation of header finish to avoid lagging
      setTimeout(
        () => {
          actions.getRecentSearchKeywords({
            target: 'post',
            order: 'DESC',
            limit: 10,
            showLoading: true,
          });
        }, 500,
      );
    }, [],
  );

  const onPressSearch = () => {
    ref?.current?.blur?.();
    actions.setNewsfeedSearch({ isSuggestion: false });
  };

  const onDeleteKeyword = (id: string) => {
    actions.deleteRecentSearchById(id);
  };

  const onClearAllKeyword = () => {
    actions.deleteRecentSearchAll('post');
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        {searchText ? (
          <TouchableOpacity
            testID="search_suggestion.btn_search"
            style={styles.ctaContainer}
            onPress={onPressSearch}
          >
            <Text.BodyMMedium testID="text_search" style={styles.ctaText}>{ctaText}</Text.BodyMMedium>
          </TouchableOpacity>
        ) : (
          <NFSRecentSearchKeyword
            onSelectKeyword={onSelectKeyword}
            onDeleteKeyword={onDeleteKeyword}
            onClearAllKeyword={onClearAllKeyword}
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

export default React.forwardRef(SearchSuggestion);
