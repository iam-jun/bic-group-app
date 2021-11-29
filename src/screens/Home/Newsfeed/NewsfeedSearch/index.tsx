import React, {FC} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import NFSSuggestion from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSSuggestion';
import NFSResult from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSResult';
import {useDispatch} from 'react-redux';
import homeActions from '~/screens/Home/redux/actions';

export interface NewsfeedSearchProps {
  headerRef?: any;
}

const NewsfeedSearch: FC<NewsfeedSearchProps> = ({
  headerRef,
}: NewsfeedSearchProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

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

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
    },
  });
};

export default NewsfeedSearch;
