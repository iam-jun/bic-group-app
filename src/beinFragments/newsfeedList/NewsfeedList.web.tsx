import React, {useEffect, useState, useRef, FC} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import PostItem from '~/beinComponents/list/items/PostItem';

import ListView from '~/beinComponents/list/ListView';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {useTabPressListener} from '~/hooks/navigation';
import {deviceDimensions, scaleSize} from '~/theme/dimension';

import {ITheme} from '~/theme/interfaces';
import {ITabTypes} from '~/interfaces/IRouter';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';

let newsfeedPostCount = 0;
const itemLeftToGetMore = 10;

export interface NewsfeedListProps {
  style?: StyleProp<ViewStyle>;
  data?: any;
  refreshing?: boolean;
  canLoadMore?: boolean;
  onEndReach?: () => void;
  onRefresh?: () => void;
  HeaderComponent?: any;
}

const _NewsfeedList: FC<NewsfeedListProps> = ({
  data,
  refreshing = false,
  canLoadMore,
  onEndReach,
  onRefresh,
  HeaderComponent,
}: NewsfeedListProps) => {
  const listRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const [newsfeedWidth, setNewsfeedWidth] = useState<number>(
    deviceDimensions.phone,
  );
  const styles = createStyle(theme, newsfeedWidth);

  const renderItem = ({item}: any) => {
    return (
      <PostItem
        postData={item}
        testID="newsfeed_list.post.item"
        btnReactTestID="newsfeed_list.post.btn_react"
        btnCommentTestID="newsfeed_list.post.btn_comment"
      />
    );
  };

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const renderFooter = () => {
    console.log(
      `\x1b[36m🐣️ NewsfeedList.web renderFooter ${canLoadMore} \x1b[0m`,
    );
    return (
      <View style={styles.listFooter}>
        {canLoadMore && !refreshing && (
          <ActivityIndicator color={theme.colors.bgFocus} />
        )}
        {!refreshing && !canLoadMore && (
          <>
            <Image
              resizeMode={'contain'}
              style={styles.imgEmpty}
              source={
                data?.length === 0
                  ? images.img_empty_no_post
                  : images.img_empty_cant_load_more
              }
            />
            <Text.H6 useI18n>{`post:newsfeed:${
              data?.length === 0
                ? 'title_empty_no_post'
                : 'title_empty_cant_load_more'
            }`}</Text.H6>
            <Text.Subtitle useI18n color={theme.colors.textSecondary}>
              {`post:newsfeed:${
                data?.length === 0
                  ? 'text_empty_no_post'
                  : 'text_empty_cant_load_more'
              }`}
            </Text.Subtitle>
          </>
        )}
      </View>
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <HeaderCreatePostPlaceholder
          style={styles.headerCreatePost}
          parentWidth={newsfeedWidth}
        />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
      </View>
    );
  };

  useEffect(() => {
    newsfeedPostCount = data?.length;
  }, [data?.length]);

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    const lastVisibleIndex = viewableItems?.[viewableItems?.length - 1]?.index;
    if (newsfeedPostCount - lastVisibleIndex < itemLeftToGetMore) {
      onEndReach?.();
    }
  }).current;

  return (
    <View
      style={styles.container}
      onLayout={event => setNewsfeedWidth(event.nativeEvent.layout.width)}>
      {data.length === 0 && refreshing ? (
        renderPlaceholder()
      ) : (
        <ListView
          listRef={listRef}
          isFullView
          containerStyle={styles.listContainer}
          data={data}
          refreshing={refreshing}
          onRefresh={() => onRefresh?.()}
          onEndReachedThreshold={1}
          onLoadMore={() => onEndReach?.()}
          disableVirtualization={Platform.OS === 'web'}
          renderItem={renderItem}
          onViewableItemsChanged={onViewableItemsChanged}
          ListHeaderComponent={HeaderComponent}
          ListFooterComponent={renderFooter}
          renderItemSeparator={() => (
            <ViewSpacing height={theme.spacing.margin.large} />
          )}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme, newsfeedWidth: number) => {
  const {colors, spacing, dimension} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    headerOnLaptop: {
      backgroundColor: colors.surface,
    },
    placeholder: {
      flex: 1,
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
        },
      }),
    },
    listContainer: {
      flex: 1,
    },
    listFooter: {
      minHeight: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: spacing.padding.large,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    importantCount: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.small,
    },
    imgEmpty: {
      width: scaleSize(240),
      height: scaleSize(160),
      maxWidth: 300,
      maxHeight: 200,
    },
  });
};

export default _NewsfeedList;
