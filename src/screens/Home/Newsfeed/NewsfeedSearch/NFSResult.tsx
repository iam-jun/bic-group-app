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
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/beinComponents/Text';
import {scaleSize} from '~/theme/dimension';
import NFSFilterToolbar from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterToolbar';

const NFSResult = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {
    loadingResult = false,
    searchResults = [],
    searchText = '',
  } = useKeySelector(homeKeySelector.newsfeedSearchState) || {};
  const filterCreatedBy = useKeySelector(
    homeKeySelector.newsfeedSearchFilterCreatedBy,
  );
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);

  const renderItem = ({item, index}: any) => {
    return (
      <PostView
        style={styles.itemContainer}
        postId={item?.id}
        isLite
        pressNavigateToDetail
      />
    );
  };

  const getData = (isLoadMore = false) => {
    if (searchText) {
      const payload: IPayloadGetSearchPosts = {
        searchText,
        actors: filterCreatedBy?.id,
        startDate: filterDate?.startDate,
        endDate: filterDate?.endDate,
        isLoadMore,
      };
      dispatch(homeActions.getSearchPosts(payload));
    }
  };

  useEffect(() => {
    getData();
  }, [searchText, filterCreatedBy, filterDate?.startDate, filterDate?.endDate]);

  const onRefresh = () => {
    console.log(`\x1b[36m🐣️ NewsfeedSearchResult onRefresh\x1b[0m`);
  };

  const onEndReached = () => {
    getData(true);
  };

  const renderEmpty = () => {
    if (loadingResult) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Image
          resizeMode={'contain'}
          style={styles.imgEmpty}
          source={images.img_empty_search_post}
        />
        <Text useI18n style={styles.textEmpty}>
          post:newsfeed:text_empty_search_post
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer}></View>;
  };

  return (
    <View style={styles.container}>
      <NFSFilterToolbar />
      <FlatList
        style={styles.flex1}
        data={searchResults || []}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={renderFooter()}
        keyExtractor={item => `newsfeed_item_${item?.id}`}
        onEndReached={onEndReached}
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
    flex1: {flex: 1},
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    itemContainer: {
      marginTop: spacing.margin.small,
    },
    imgEmpty: {
      width: scaleSize(240),
      height: scaleSize(160),
      maxWidth: 240,
      maxHeight: 160,
    },
    emptyContainer: {
      alignItems: 'center',
      marginTop: spacing.margin.extraLarge,
    },
    textEmpty: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
    footer: {
      marginBottom: spacing.margin.base,
    },
  });
};

export default NFSResult;
