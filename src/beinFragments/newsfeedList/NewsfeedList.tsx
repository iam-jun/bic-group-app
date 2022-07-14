import React, {FC, memo, useEffect, useRef, useState} from 'react';
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
import {FlashList} from '@shopify/flash-list';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {FlashListProps} from '@shopify/flash-list/src/FlashListProps';
import {IPostActivity} from '~/interfaces/IPost';
export interface NewsfeedListProps {
  data?: any;
  refreshing?: boolean;
  canLoadMore?: boolean;
  onEndReach?: () => void;
  onRefresh?: () => void;
  HeaderComponent?: any;
}

const AnimatedFlashList = Animated.createAnimatedComponent<
  React.ComponentType<FlashListProps<any>>
>(FlashList as any);

const screenHeight = Dimensions.get('window').height;

const ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT = 180;
const CREATE_POST_HEADER_HEIGHT = 50;

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
  const lockHeaderRef = useRef(false);

  const prevOffsetYShared = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const {spacing, dimension} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const refreshControlOffset = insets.top + dimension.headerHeight;

  const emit = (event: string, params?: any) => {
    DeviceEventEmitter.emit(event, params);
  };

  const handleScrollY = throttle((offsetY: number) => {
    // on iOS, pull to refresh will fire onScroll with negative offsetY, ignore to avoid hide header
    if (offsetY < 0) {
      return;
    }

    const isDown = offsetY - prevOffsetYShared.value > 2;
    const isDown5Percent =
      ((offsetY - prevOffsetYShared.value) * 100) / screenHeight >= 5;
    const isUp = prevOffsetYShared.value - offsetY > 2;
    const isUp5Percent =
      ((prevOffsetYShared.value - offsetY) * 100) / screenHeight >= 5;

    const showFloating = offsetY > CREATE_POST_HEADER_HEIGHT;
    emit('stopAllVideo');
    if (isDown5Percent) {
      emit('showHeader', false);
      emit('showBottomBar', false);
      emit('showFloatingCreatePost', false);
    } else if (isDown && offsetY > 20) {
      emit('showHeader', false);
    }
    if (isUp5Percent) {
      emit('showHeader', true);
      emit('showBottomBar', true);
      emit('showFloatingCreatePost', showFloating);
    } else if (isUp) {
      emit('showBottomBar', true);
      emit('showFloatingCreatePost', showFloating);
      if (offsetY < 50) {
        emit('showHeader', true);
      }
    }

    prevOffsetYShared.value = offsetY;
  }, 300);

  const onScroll = (e: any) => {
    // for smooth handle scrollEvent, i want to use useAnimatedScrollHander
    // this callback run on UI thread, so i have to use runOnJs for function handler and shared value
    // but flash list v1.1.0 has problem, when update state data, scroll stop working
    // so for now, i used normal function onScroll, maybe refactor in the future
    handleScrollY(e?.nativeEvent?.contentOffset?.y);
  };

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

  const _onEndReached = debounce(() => {
    if (!initializing) {
      onEndReach?.();
    }
    lockHeaderRef.current = true;
    setTimeout(() => {
      if (lockHeaderRef?.current) {
        lockHeaderRef.current = false;
      }
    }, 1000);
  }, 300);

  const onLoaded = (info: {elapsedTimeInMs: number}) => {
    console.log(`\x1b[36m🐣️Newsfeed loaded ${info?.elapsedTimeInMs}ms\x1b[0m`);
    if (initializing) {
      setInitializing(false);
    }
  };

  const renderItem = ({item}: any) => {
    return (
      <PostView
        postId={item.id}
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
        <AnimatedFlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: IPostActivity) => `newsfeed-list-${item?.id}`}
          estimatedItemSize={ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT}
          onScroll={onScroll}
          onLoad={onLoaded}
          refreshing
          refreshControl={
            <RefreshControl
              testID={'newsfeed_list.refresh_control'}
              progressViewOffset={refreshControlOffset}
              refreshing={!!refreshing}
              onRefresh={() => onRefresh?.()}
            />
          }
          showsHorizontalScrollIndicator={false}
          onRefresh={onRefresh}
          onEndReached={_onEndReached}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <NewsfeedListHeader HeaderComponent={HeaderComponent} />
          }
          ListFooterComponent={renderFooter}
        />
      )}
      {renderEmpty()}
      {renderPlaceholder()}
      <FloatingCreatePost />
    </View>
  );
};

const NewsfeedListHeader = ({HeaderComponent}: any) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as any;
  const styles = createStyle(theme, insets);

  return (
    <View style={styles.headerContainer}>
      {!!HeaderComponent && HeaderComponent}
      <NoticePanel />
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
