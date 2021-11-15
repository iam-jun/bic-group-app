import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import {IPayloadGetSearchPosts} from '~/interfaces/IHome';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import homeActions from '~/screens/Home/redux/actions';

import PostView from '~/screens/Post/components/PostView';

const NewsfeedSearchResult = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {
    loadingResult = false,
    searchResults = [],
    searchText = '',
  } = useKeySelector(homeKeySelector.newsfeedSearchState) || {};

  const renderItem = ({item, index}: any) => {
    return <PostView postId={item?.id} />;
  };

  const getData = () => {
    const payload: IPayloadGetSearchPosts = {searchText};
    dispatch(homeActions.getSearchPosts(payload));
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
        data={searchResults || []}
        renderItem={renderItem}
        keyExtractor={item => `newsfeed_item_${item?.id}`}
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
