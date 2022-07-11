import React, {useCallback, useRef} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';

import Filter from '~/beinComponents/Filter';
import {ITheme} from '~/theme/interfaces';
import NotificationList from './NotificationList';
import spacing from '~/theme/spacing';

const {width: screenWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterStyle: {
    paddingVertical: spacing.padding.small,
    borderBottomWidth: 0,
  },
});

export interface Props {
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  data?: any[];
  onChangeTab: (index: number) => void;
  activeIndex?: number;
}

const ScrollableTabBar = ({
  onItemPress,
  data,
  onPressItemOption,
  onChangeTab,
  activeIndex = 0,
}: Props) => {
  const theme: ITheme = useTheme() as ITheme;

  const scrollViewRef = useRef<any>();
  const filterRef = useRef<any>();
  const translateX = useSharedValue(0);

  const _onChangeTab = useCallback(
    (i: number) => {
      onChangeTab(i);
      if (!!scrollViewRef.current) {
        scrollViewRef.current?.scrollTo?.({
          x: screenWidth * i,
          animated: true,
        });
      }
    },
    [onChangeTab],
  );

  const _onItemPress = useCallback(
    (item: any) => {
      onItemPress?.(item);
    },
    [onItemPress],
  );

  const _onPressItemOption = useCallback(
    ({item, e}: any) => {
      onPressItemOption?.({item, e});
    },
    [onPressItemOption],
  );

  const onMomentumScrollEnd = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = contentOffset.x / viewSize.width;
    if ((pageNum - parseInt(pageNum)) * 10 >= 5) {
      pageNum = parseInt(pageNum) + 1;
    } else {
      pageNum = parseInt(pageNum);
    }
    if (activeIndex !== pageNum) {
      onChangeTab(pageNum);
    }
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Filter
        ref={filterRef}
        activeIndex={activeIndex}
        translateX={translateX}
        testID={'notification.filter'}
        itemTestID={'notification.filter.item'}
        style={styles.filterStyle}
        data={data}
        onPress={(item: any, index: number) => {
          _onChangeTab(index);
        }}
      />
      <Animated.ScrollView
        ref={scrollViewRef}
        style={{flex: 1}}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}>
        {data?.length > 0 &&
          data?.map((item: any, index: number) => {
            return (
              <NotificationList
                key={'NOTI_ITEM_SCREEN_' + index + item?.type}
                onItemPress={_onItemPress}
                type={item?.type}
                keyValue={item?.key}
                onPressItemOption={_onPressItemOption}
                activeIndex={activeIndex === index}
              />
            );
          })}
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollableTabBar;
