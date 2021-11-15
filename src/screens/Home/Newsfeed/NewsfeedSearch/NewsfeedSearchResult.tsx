import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import homeActions from '~/screens/Home/redux/actions';
import {useDispatch} from 'react-redux';

const NewsfeedSearchResult = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {loadingResult = false, searchResults = []} =
    useKeySelector(homeKeySelector.newsfeedSearchState) || {};

  const renderItem = () => {
    return <Text>item here</Text>;
  };

  const getData = () => {
    dispatch(homeActions.setNewsfeedSearch({loadingResult: true}));
  };

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = () => {
    console.log(`\x1b[36m🐣️ NewsfeedSearchResult onRefresh\x1b[0m`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loadingResult}
            onRefresh={onRefresh}
            tintColor={colors.primary6}
            colors={[colors.primary6 || 'grey']}
          />
        }
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
  });
};

export default NewsfeedSearchResult;
