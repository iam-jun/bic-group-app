/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  FC, memo, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
  DeviceEventEmitter,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { debounce, throttle } from 'lodash';
import {
  ExtendedTheme,
  useFocusEffect,
  useTheme,
} from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { FlashListProps } from '@shopify/flash-list/src/FlashListProps';
import dimension from '~/theme/dimension';

import Text from '~/baseComponents/Text';
import PostViewPlaceholder from '~/components/placeholder/PostViewPlaceholder';
import { useRootNavigation, useTabPressListener } from '~/hooks/navigation';
import { ITabTypes } from '~/interfaces/IRouter';
import FloatingCreatePost from '../FloatingCreatePost';
import { IPost } from '~/interfaces/IPost';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import Button from '~/baseComponents/Button';
import { useBaseHook } from '~/hooks';
import VideoProcessingNotice from '../VideoProcessingNotice';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import ContentItem from '~/components/ContentItem';
import NewUpdateNotice from '../NewUpdateNotice';

export interface NewsfeedListProps {
  data?: any;
  refreshing?: boolean;
  canLoadMore?: boolean;
  HeaderComponent?: any;
  contentFilter?: ContentFeed;
  attributeFilter?: AttributeFeed;

  onEndReach?: () => void;
  onRefresh?: () => void;
  onScrollY?: (y: number) => void;
}

const AnimatedFlashList = Animated.createAnimatedComponent<
  React.ComponentType<FlashListProps<any>>
>(FlashList as any);

const screenHeight = Dimensions.get('window').height;

const ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT = 180;

const _NewsfeedList: FC<NewsfeedListProps> = ({
  data,
  refreshing = false,
  canLoadMore,
  HeaderComponent,
  contentFilter,
  attributeFilter,

  onEndReach,
  onRefresh,
  onScrollY,
}: NewsfeedListProps) => {
  const [initializing, setInitializing] = useState(true);
  const listRef = useRef<any>();
  const lockHeaderRef = useRef(false);

  const prevOffsetYShared = useSharedValue(0);

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyle(theme, insets), [theme, insets]);

  const refreshControlOffset = insets.top + dimension.homeHeaderHeight;

  const emit = (event: string, params?: any) => {
    DeviceEventEmitter.emit(event, params);
  };

  const handleScrollY = throttle((offsetY: number) => {
    // on iOS, pull to refresh will fire onScroll with negative offsetY, ignore to avoid hide header
    if (offsetY < 0) {
      return;
    }

    const isDown = offsetY - prevOffsetYShared.value > 2;
    const isDown5Percent
      = ((offsetY - prevOffsetYShared.value) * 100) / screenHeight >= 5;
    const isUp = prevOffsetYShared.value - offsetY > 2;
    const isUp5Percent
      = ((prevOffsetYShared.value - offsetY) * 100) / screenHeight >= 5;

    emit('stopAllVideo');
    if (isDown5Percent) {
      emit('showHeader', false);
      emit('showBottomBar', false);
    } else if (isDown && offsetY > 92) {
      emit('showHeader', false);
    }
    if (isUp5Percent) {
      emit('showHeader', true);
      emit('showBottomBar', true);
    } else if (isUp) {
      emit('showBottomBar', true);
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
    onScrollY?.(e?.nativeEvent?.contentOffset?.y);
    handleScrollY(e?.nativeEvent?.contentOffset?.y);
  };

  useEffect(() => {
    setTimeout(() => {
      listRef?.current?.scrollToOffset?.({ animated: false, offset: 0 });
    }, 200);
  }, [contentFilter, attributeFilter]);

  useFocusEffect(
    React.useCallback(
      () => () => {
        // setTimeout(() => {
        DeviceEventEmitter.emit('showHeader', true);
        DeviceEventEmitter.emit('showBottomBar', true);
        // }, 100);
      },
      [],
    ),
  );

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'home') {
        listRef?.current?.scrollToOffset?.({ animated: true, offset: 0 });
      }
    },
    [listRef?.current],
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

  const onLoaded = (info: { elapsedTimeInMs: number }) => {
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️Newsfeed loaded ${info?.elapsedTimeInMs}ms\x1b[0m`);
    if (initializing) {
      setInitializing(false);
    }
  };

  const onPressDiscover = () => {
    rootNavigation.navigate(menuStack.discover);
  };

  const renderItem = ({ item }: any) => (
    <ContentItem
      id={item}
      testID="newsfeed_list.post.item"
      btnReactTestID="newsfeed_list.post.btn_react"
      btnCommentTestID="newsfeed_list.post.btn_comment"
    />
  );

  const renderPlaceholder = () => {
    if (!initializing) {
      return null;
    }
    return (
      <View style={styles.placeholder}>
        <PostViewPlaceholder />
        <PostViewPlaceholder />
        <PostViewPlaceholder />
      </View>
    );
  };

  const renderFooter = () => {
    if (refreshing) return null;

    if (!canLoadMore) {
      return (
        <View style={styles.listFooter}>
          <Text.BodyM useI18n color={theme.colors.neutral40}>
            {data?.length === 0
              ? 'post:newsfeed:text_empty_no_post'
              : 'post:newsfeed:text_empty_cant_load_more'}
          </Text.BodyM>
        </View>
      );
    }

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator
          testID="newsfeed_list.activity_indicator"
          color={theme.colors.gray20}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (canLoadMore) {
      return null;
    }
    return (
      <View style={styles.emptyContainer} testID="newsfeed_list.empty">
        <Text.SubtitleM useI18n>
          post:newsfeed:title_empty_no_post
        </Text.SubtitleM>
        <Text.BodyXS style={styles.textEmpty} useI18n>
          post:newsfeed:text_empty_no_post
        </Text.BodyXS>
        <Button.Primary testID="newsfeed_list.btn_discover" onPress={onPressDiscover}>
          {t('menu:title_discover')}
        </Button.Primary>
      </View>
    );
  };

  const renderListEmpty = () => (
    <FlatList
      testID="newsfeed_list.empty_list"
      data={[]}
      renderItem={null}
      refreshControl={(
        <RefreshControl
          testID="newsfeed_list.refresh_control"
          progressViewOffset={refreshControlOffset}
          refreshing={!!refreshing}
          onRefresh={() => onRefresh?.()}
        />
      )}
      ListEmptyComponent={renderEmpty}
      style={styles.mainColor}
    />
  );

  return (
    <View testID="newsfeed_list" style={styles.container}>
      <View style={styles.background} />
      {data?.length > 0 ? (
        <AnimatedFlashList
          ref={listRef}
          // @ts-ignore
          testID="newsfeed_list.list"
          // @ts-ignore
          data={data}
          // bounces={false}
          renderItem={renderItem}
          keyExtractor={(item: IPost) => `newsfeed-${contentFilter}-${attributeFilter}-${item}`}
          estimatedItemSize={ESTIMATE_HEIGHT_POST_SINGLE_LINE_TEXT}
          onScroll={onScroll}
          onLoad={onLoaded}
          refreshing
          refreshControl={(
            <RefreshControl
              testID="newsfeed_list.refresh_control"
              progressViewOffset={refreshControlOffset}
              refreshing={!!refreshing}
              onRefresh={() => onRefresh?.()}
              style={styles.refreshControl}
            />
          )}
          showsHorizontalScrollIndicator={false}
          onRefresh={onRefresh}
          onEndReached={_onEndReached}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={(
            <NewsfeedListHeader
              HeaderComponent={HeaderComponent}
              attributeFilter={attributeFilter}
            />
          )}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => <ViewSpacing height={spacing.margin.large} />}
          contentContainerStyle={styles.mainColor}
        />
      ) : (
        renderListEmpty()
      )}
      {renderPlaceholder()}
      <FloatingCreatePost />
    </View>
  );
};

export const NewsfeedListHeader = ({
  HeaderComponent,
  attributeFilter,
}: any) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as any;
  const styles = createStyle(theme, insets);

  const isNewsfeed = attributeFilter === AttributeFeed.ALL;

  return (
    <View style={styles.headerContainer} testID="newsfeed_list_header">
      {!!HeaderComponent && HeaderComponent}
      <NewUpdateNotice />
      {isNewsfeed ? <VideoProcessingNotice /> : null}
      <View style={styles.headerDivider} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: colors.gray5,
    },
    headerDivider: {
      height: spacing.margin.large,
      backgroundColor: colors.gray5,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    listFooter: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing.padding.small,
      paddingBottom: 58,
      paddingHorizontal: spacing.padding.large,
    },
    placeholder: {
      opacity: 1,
      position: 'absolute',
      top: insets.top + dimension.homeHeaderHeight,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.neutral1,
    },
    headerContainer: {
      paddingTop: insets.top + dimension.homeHeaderHeight,
      backgroundColor: colors.neutral,
      width: '100%',
    },
    emptyContainer: {
      marginTop: insets.top + dimension.homeHeaderHeight + 56,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    emptyIndicator: {
      marginTop: insets.top + dimension.homeHeaderHeight,
      paddingTop: 34,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    textEmpty: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.extraLarge,
      color: colors.neutral50,
    },
    background: {
      width: '100%',
      height: '60%',
      position: 'absolute',
      bottom: 0,
      backgroundColor: colors.gray5,
    },
    mainColor: { backgroundColor: theme.colors.gray5 },
    refreshControl: { position: 'absolute', zIndex: 2 },
  });
};

const NewsfeedList = memo(_NewsfeedList);
export default NewsfeedList;
