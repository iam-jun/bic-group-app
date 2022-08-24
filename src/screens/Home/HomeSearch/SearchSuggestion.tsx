import React, { FC, useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/storeRedux/home/keySelector';
import { useBaseHook } from '~/hooks';
import Icon from '~/baseComponents/Icon';
import homeActions from '~/storeRedux/home/actions';
import NFSRecentSearchKeyword from '~/screens/Home/HomeSearch/RecentSearchKeyword';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import spacing from '~/theme/spacing';

export interface NFSSuggestionProps {
  onSelectKeyword?: (keyword: string) => void;
}

const SearchSuggestion: FC<NFSSuggestionProps> = ({
  onSelectKeyword,
}: NFSSuggestionProps) => {
  const [lossInternet, setLossInternet] = useState(false);

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const { data: listRecentKeywords } = useKeySelector(homeKeySelector.newsfeedSearchRecentKeyword) || {};

  const searchText = useKeySelector(homeKeySelector.newsfeedSearch.searchText);
  const searchViewRef = useKeySelector(homeKeySelector.newsfeedSearch.searchViewRef);

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
          dispatch(homeActions.getRecentSearchKeywords({
            target: 'post',
            order: 'DESC',
            limit: 10,
            showLoading: true,
          }));
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
          dispatch(homeActions.getRecentSearchKeywords({
            target: 'post',
            order: 'DESC',
            limit: 10,
            showLoading: false,
          }));
        }, 500,
      );
    }, [],
  );

  const onPressCtaSearch = () => {
    searchViewRef?.current?.blur?.();
    dispatch(homeActions.setNewsfeedSearch({ isSuggestion: false }));
  };

  const onDeleteKeyword = (id: string) => {
    dispatch(homeActions.deleteRecentSearchById(id));
  };

  const onClearAllKeyword = () => {
    dispatch(homeActions.deleteClearRecentSearch('post'));
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        {searchText ? (
          <TouchableOpacity
            style={styles.ctaContainer}
            onPress={onPressCtaSearch}
          >
            <Icon icon="search" tintColor={colors.purple50} />
            <Text style={styles.ctaText}>{ctaText}</Text>
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
      marginLeft: spacing.margin.large,
      color: colors.purple50,
    },
  });
};

export default SearchSuggestion;
