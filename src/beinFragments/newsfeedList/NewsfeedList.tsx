import React, {FC, memo, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
  FlatList,
} from 'react-native';
import {debounce, throttle} from 'lodash';
import {useTheme} from 'react-native-paper';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';

import Text from '~/beinComponents/Text';
import PostView from '~/screens/Post/components/PostView';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import {useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import FloatingCreatePost from '~/beinFragments/FloatingCreatePost';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import NoticePanel from '~/screens/Home/Newsfeed/components/NoticePanel';

export interface NewsfeedListProps {
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
  const lockHeaderRef = useRef(true);

  const prevOffsetYRef = useRef(0);

  const theme = useTheme() as ITheme;
  const {spacing, dimension} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const refreshControlOffset = insets.top + dimension.headerHeight;

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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // setTimeout(() => {
        DeviceEventEmitter.emit('showHeader', true);
        DeviceEventEmitter.emit('showBottomBar', true);
        // }, 100);
      };
    }, []),
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
    if (data?.length === 0) {
      DeviceEventEmitter.emit('showHeader', true);
      DeviceEventEmitter.emit('showBottomBar', true);
    }
  }, [data?.length]);

  useEffect(() => {
    if (!canLoadMore && !refreshing) {
      // In case newsfeed has only 1 page, canLoadMore false at the first time,
      // set initializing false show footer when item not rendered yet
      // so need delay to wait render, list empty still show
      setTimeout(() => setInitializing(false), 5000);
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
    lockHeaderRef.current = true;
    setTimeout(() => {
      if (lockHeaderRef?.current) {
        lockHeaderRef.current = false;
      }
    }, 1000);
  };

  const onVisibleIndicesChanged = debounce((indexes: any) => {
    if (
      indexes?.length > 0 &&
      data?.length === indexes?.[indexes?.length - 1]
    ) {
      onEndReach?.();
    }
  }, 1000);

  const onScroll = throttle(
    (rawEvent: any, offsetX: number, offsetY: number) => {
      //on iOS, when add more item, callback scroll fired as scroll up
      //so need lock 1 second to avoid header and bottom bar blink when load more
      if (lockHeaderRef.current) {
        return;
      }
      // on iOS, pull to refresh will fire onScroll with negative offsetY, ignore to avoid hide header
      if (offsetY < 0) {
        return;
      }

      const isDown = offsetY - prevOffsetYRef.current > 2;
      const isDown5Percent =
        ((offsetY - prevOffsetYRef.current) * 100) / screenHeight >= 5;
      const isUp = prevOffsetYRef.current - offsetY > 2;
      const isUp5Percent =
        ((prevOffsetYRef.current - offsetY) * 100) / screenHeight >= 5;

      const createPostHeaderHeight = 50;
      const showFloating = offsetY > createPostHeaderHeight;
      DeviceEventEmitter.emit('stopAllVideo');
      if (isDown5Percent) {
        DeviceEventEmitter.emit('showHeader', false);
        DeviceEventEmitter.emit('showBottomBar', false);
        DeviceEventEmitter.emit('showFloatingCreatePost', false);
      } else if (isDown && offsetY > 20) {
        DeviceEventEmitter.emit('showHeader', false);
      }
      if (isUp5Percent) {
        DeviceEventEmitter.emit('showHeader', true);
        DeviceEventEmitter.emit('showBottomBar', true);
        DeviceEventEmitter.emit('showFloatingCreatePost', showFloating);
      } else if (isUp) {
        DeviceEventEmitter.emit('showBottomBar', true);
        DeviceEventEmitter.emit('showFloatingCreatePost', showFloating);
        if (offsetY < 50) {
          DeviceEventEmitter.emit('showHeader', true);
        }
      }

      prevOffsetYRef.current = offsetY;
    },
    300,
  );

  const rowRenderer = (type: any, data: any) => {
    if (type === ViewTypes.HEADER && HeaderComponent) {
      return (
        <View style={styles.headerContainer}>
          {HeaderComponent}
          <NoticePanel />
        </View>
      );
    }
    return (
      <PostView
        style={itemStyle}
        postId={data.id}
        testID="newsfeed_list.post.item"
        btnReactTestID="newsfeed_list.post.btn_react"
        btnCommentTestID="newsfeed_list.post.btn_comment"
      />
    );
  };

  const renderPlaceholder = () => {
    if (!initializing) {
      return null;
    }
    return (
      <View style={styles.placeholder}>
        <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
      </View>
    );
  };

  const renderEmpty = () => {
    if (data?.length === 0 && !canLoadMore) {
      return (
        <FlatList
          testID={'newsfeed_list.empty_list'}
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl
              testID={'newsfeed_list.refresh_control'}
              progressViewOffset={refreshControlOffset}
              refreshing={!!refreshing}
              onRefresh={() => onRefresh?.()}
            />
          }
          ListEmptyComponent={
            <NewsfeedListEmpty
              styles={styles}
              HeaderComponent={HeaderComponent}
              theme={theme}
            />
          }
        />
      );
    }
    return null;
  };

  const renderFooter = () => {
    return (
      <View style={styles.listFooter}>
        {canLoadMore && !refreshing && (
          <ActivityIndicator
            testID={'newsfeed_list.activity_indicator'}
            color={theme.colors.bgFocus}
          />
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
    <View testID="newsfeed_list" style={styles.container}>
      {data && data.length > 0 && (
        <RecyclerListView
          testID="newsfeed_list.list"
          ref={listView}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={rowRenderer}
          // bounces={false}
          forceNonDeterministicRendering={true}
          onScroll={onScroll}
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
                testID={'newsfeed_list.refresh_control'}
                progressViewOffset={refreshControlOffset}
                refreshing={refreshing}
                onRefresh={() => onRefresh?.()}
              />
            ),
          }}
        />
      )}
      {renderEmpty()}
      {renderPlaceholder()}
      <FloatingCreatePost />
    </View>
  );
};

const NewsfeedListEmpty = ({styles, HeaderComponent, theme}: any) => {
  return (
    <View testID={'newsfeed_list.empty_view'} style={styles.emptyContainer}>
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
};

const createStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
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
      top: insets.top + dimension.headerHeight,
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
    headerContainer: {
      marginTop: insets.top + dimension.headerHeight,
      width: '100%',
    },
    emptyContainer: {
      marginTop: insets.top + dimension.headerHeight,
    },
  });
};

const NewsfeedList = memo(_NewsfeedList);
// NewsfeedList.whyDidYouRender = true;
export default NewsfeedList;
