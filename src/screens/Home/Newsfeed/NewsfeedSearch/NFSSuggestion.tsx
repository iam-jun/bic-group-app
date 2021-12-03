import React, {FC, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import {useBaseHook} from '~/hooks';
import Icon from '~/beinComponents/Icon';
import {useDispatch} from 'react-redux';
import homeActions from '~/screens/Home/redux/actions';
import NFSRecentSearchKeyword from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSRecentSearchKeyword';

export interface NFSSuggestionProps {
  onSelectKeyword?: (keyword: string) => void;
}

const NFSSuggestion: FC<NFSSuggestionProps> = ({
  onSelectKeyword,
}: NFSSuggestionProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const searchText = useKeySelector(homeKeySelector.newsfeedSearch.searchText);
  const searchInputRef = useKeySelector(
    homeKeySelector.newsfeedSearch.searchInputRef,
  );

  const ctaText = t(
    'home:newsfeed_search:text_cta_see_result_for_search_text',
  ).replace('%SEARCH_TEXT%', searchText);

  useEffect(() => {
    //timeout wait animation of header finish to avoid lagging
    setTimeout(() => {
      dispatch(
        homeActions.getRecentSearchKeywords({
          target: 'post',
          sort: 'desc',
          limit: 10,
          showLoading: false,
        }),
      );
    }, 500);
  }, []);

  const onPressCtaSearch = () => {
    searchInputRef?.current?.blur?.();
    dispatch(homeActions.setNewsfeedSearch({isSuggestion: false}));
  };

  const onDeleteKeyword = (id: string, keyword: string) => {
    dispatch(homeActions.deleteRecentSearchById(id));
  };

  const onClearAllKeyword = () => {
    dispatch(homeActions.deleteClearRecentSearch('post'));
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'always'}>
      <View style={styles.container}>
        {!!searchText ? (
          <TouchableOpacity
            style={styles.ctaContainer}
            onPress={onPressCtaSearch}>
            <Icon icon={'search'} tintColor={colors.primary6} />
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
    </ScrollView>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
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
      color: colors.primary6,
    },
  });
};

export default NFSSuggestion;
