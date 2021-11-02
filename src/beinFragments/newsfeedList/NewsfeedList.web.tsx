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
import {deviceDimensions} from '~/theme/dimension';

import {ITheme} from '~/theme/interfaces';
import {ITabTypes} from '~/interfaces/IRouter';

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
    return <PostItem postData={item} />;
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
    return (
      <View style={styles.listFooter}>
        {canLoadMore && !refreshing && (
          <ActivityIndicator color={theme.colors.bgFocus} />
        )}
        {!refreshing && !canLoadMore && (
          <Text.Subtitle color={theme.colors.textSecondary}>
            No more homeposts
          </Text.Subtitle>
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
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
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
  });
};

export default _NewsfeedList;
