import React, { FC } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import NFSSuggestion from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSSuggestion';
import NFSResult from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSResult';
import homeActions from '~/screens/Home/redux/actions';
import dimension from '~/theme/dimension';

export interface NewsfeedSearchProps {
  headerRef?: any;
}

const NewsfeedSearch: FC<NewsfeedSearchProps> = ({
  headerRef,
}: NewsfeedSearchProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const isShow = useKeySelector(homeKeySelector.newsfeedSearch.isShow);
  const isSuggestion = useKeySelector(
    homeKeySelector.newsfeedSearch.isSuggestion,
  );

  const onSelectKeyword = (keyword: string) => {
    headerRef?.current?.setSearchText?.(keyword);
    dispatch(
      homeActions.setNewsfeedSearch({
        isSuggestion: false,
        searchResults: [],
        searchText: keyword,
      }),
    );
    Keyboard.dismiss();
  };

  if (!isShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isSuggestion ? (
        <NFSSuggestion onSelectKeyword={onSelectKeyword} />
      ) : (
        <NFSResult />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top + dimension.headerHeight,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.white,
    },
  });
};

export default NewsfeedSearch;
