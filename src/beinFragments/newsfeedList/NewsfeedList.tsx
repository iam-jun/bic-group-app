import React, {FC, memo, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {debounce} from 'lodash';
import {useTheme} from 'react-native-paper';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';

import {ITheme} from '~/theme/interfaces';
import {deviceDimensions, scaleSize} from '~/theme/dimension';

import Text from '~/beinComponents/Text';
import PostView from '~/screens/Post/components/PostView';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import {useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';

export interface NewsfeedListProps {
  style?: StyleProp<ViewStyle>;
  data?: any;
  refreshing?: boolean;
  canLoadMore?: boolean;
  onEndReach?: () => void;
  onRefresh?: () => void;
  HeaderComponent?: any;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewTypes = {
  HEADER: 0,
  ITEM: 1,
};

const _NewsfeedList: FC<NewsfeedListProps> = ({
  data,
  refreshing = false,
  canLoadMore,
  onEndReach,
  onRefresh,
  HeaderComponent,
}: NewsfeedListProps) => {
  const [initializing, setInitializing] = useState(true);
  const listView = useRef<any>();
  const [newsfeedWidth, setNewsfeedWidth] = useState<number>(
    deviceDimensions.phone,
  );

  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const itemStyle = useRef({
    width: screenWidth,
    marginBottom: spacing.margin.small,
  }).current;

  const layoutProvider = useRef(
    new LayoutProvider(
      index =>
        index === 0 && HeaderComponent ? ViewTypes.HEADER : ViewTypes.ITEM,
      (type, dim) => {
        dim.width = screenWidth;
        dim.height = 0;
      },
    ),
  ).current;
  const dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
        HeaderComponent ? [{header: true}, ...data] : data,
      ),
    [data, HeaderComponent],
  );

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listView?.current?.scrollToOffset?.(0, 0, true);
      }
    },
    [listView?.current],
  );

  useEffect(() => {
    if (!canLoadMore && !refreshing) {
      setInitializing(false);
    }
  }, [canLoadMore, refreshing]);

  const _onItemLayout = debounce(() => {
    if (initializing) {
      setInitializing(false);
    }
  }, 500);

  const _onEndReached = () => {
    if (!initializing) {
      onEndReach?.();
    }
  };

  const onVisibleIndicesChanged = debounce((indexes: any) => {
    if (
      indexes?.length > 0 &&
      data?.length === indexes?.[indexes?.length - 1]
    ) {
      onEndReach?.();
    }
  }, 1000);

  const rowRenderer = (type: any, data: any, index: number) => {
    if (type === ViewTypes.HEADER && HeaderComponent) {
      return HeaderComponent;
    }
    return <PostView style={itemStyle} postId={data.id} />;
  };

  const renderPlaceholder = () => {
    if (!initializing) {
      return null;
    }
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

  const renderEmpty = () => {
    if (data?.length === 0 && !canLoadMore) {
      //todo waiting for design
      return (
        <View>
          {!!HeaderComponent && HeaderComponent}
          <View style={styles.listFooter}>
            <Image
              resizeMode={'contain'}
              style={styles.imgEmpty}
              source={images.img_empty_no_post}
            />
            <Text.H6 useI18n>post:newsfeed:title_empty_no_post</Text.H6>
            <Text.Subtitle useI18n color={theme.colors.textSecondary}>
              post:newsfeed:text_empty_no_post
            </Text.Subtitle>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    return (
      <View style={styles.listFooter}>
        {canLoadMore && !refreshing && (
          <ActivityIndicator color={theme.colors.bgFocus} />
        )}
        {!refreshing && !canLoadMore && (
          <>
            <Image
              resizeMode={'contain'}
              style={[styles.imgEmpty, {marginTop: spacing.margin.base}]}
              source={images.img_empty_cant_load_more}
            />
            <Text.H6 useI18n>post:newsfeed:title_empty_cant_load_more</Text.H6>
            <Text.Subtitle
              useI18n
              color={theme.colors.textSecondary}
              style={{marginBottom: spacing.margin.large}}>
              post:newsfeed:text_empty_cant_load_more
            </Text.Subtitle>
          </>
        )}
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={event => setNewsfeedWidth(event.nativeEvent.layout.width)}>
      {data && data.length > 0 && (
        <RecyclerListView
          ref={listView}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={rowRenderer}
          forceNonDeterministicRendering={true}
          onEndReached={_onEndReached}
          onEndReachedThreshold={2 * screenHeight}
          onVisibleIndicesChanged={onVisibleIndicesChanged}
          onItemLayout={_onItemLayout}
          renderFooter={renderFooter}
          renderAheadOffset={screenHeight} //pixels in advance to be rendered
          disableRecycling={false} //if enable, list > 100 item will drop UI frame
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh?.()}
              />
            ),
          }}
        />
      )}
      {renderEmpty()}
      {renderPlaceholder()}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
        },
      }),
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    listFooter: {
      minHeight: 150,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.padding.large,
    },
    placeholder: {
      opacity: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.bgSecondary,
    },
    imgEmpty: {
      width: scaleSize(240),
      height: scaleSize(160),
      maxWidth: 240,
      maxHeight: 160,
      marginBottom: spacing.margin.large,
    },
  });
};

const NewsfeedList = memo(_NewsfeedList);
// NewsfeedList.whyDidYouRender = true;
export default NewsfeedList;
