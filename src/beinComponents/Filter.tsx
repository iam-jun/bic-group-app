import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';
import Icon from './Icon';
import Text from './Text';

const {width: screenWidth} = Dimensions.get('window');
export interface FilterProps {
  filterRef?: React.Ref<ScrollView>;
  testID?: string;
  itemTestID?: string;
  style?: StyleProp<ViewStyle>;
  data?: {id: number; text: string; icon?: string; type: string}[];
  activeIndex?: number;
  onPress: (item: any, index: number) => void;
  translateX: Animated.SharedValue<number>;
}

const FilterComponent: React.FC<FilterProps> = ({
  filterRef,
  testID,
  style,
  data = [],
  itemTestID,
  onPress,
  activeIndex = 0,
  translateX,
}: FilterProps) => {
  const theme = useTheme() as ITheme;
  const styles = useMemo(() => createStyle(theme), [theme, style]);
  const {colors, spacing} = theme;

  const [measurements, setMeasurements] = useState<any[]>(
    new Array(data?.length).fill({}),
  );

  const _onPress = useCallback(
    (item: any, index: number) => {
      onPress?.(item, index);
    },
    [onPress],
  );

  const x = useSharedValue(0);
  const offsetValue = useSharedValue(0);
  const clampedTranslateX = useDerivedValue(() => {
    const lastMeasurements = measurements[measurements.length - 1];
    const MAX_TRANSLATE_X =
      -(
        lastMeasurements?.x +
        lastMeasurements?.width +
        spacing.margin.small -
        screenWidth
      ) || -50;
    return Math.max(Math.min(x.value, 0), MAX_TRANSLATE_X);
  });

  const renderItem = (item: any, index: number) => {
    const isSelected = index === activeIndex;
    return (
      <View
        style={styles.itemView}
        key={`${itemTestID || 'item_filter'}_${item?.text}`}
        onLayout={event => {
          const {x, width, height} = event?.nativeEvent?.layout || {};
          measurements[index] = {x, width, height};
          setMeasurements([...measurements]);
        }}>
        <TouchableOpacity
          activeOpacity={0.25}
          style={[styles.itemContainer]}
          testID={`${itemTestID || 'item_filter'}_${item.id}`}
          onPress={() => {
            x.value = 0;
            _onPress(item, index);
          }}>
          {!!item?.icon && (
            <Icon
              icon={item.icon}
              size={24}
              tintColor={
                isSelected ? theme.colors.primary : theme.colors.iconTintLight
              }
              style={styles.icon}
            />
          )}
          <Text variant={isSelected ? 'bodyM' : 'body'} useI18n>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onStart(event: any) {
      console.log('>>>>>>START>>>>>>>', x.value);
    },
    onActive(event: any) {
      x.value = event.translationX + offsetValue.value;
    },
    onFinish(event: any) {
      offsetValue.value = x.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(clampedTranslateX.value, {
            duration: 10,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const activeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX?.value,
          data?.map?.((_, index: number) => index * screenWidth),
          measurements.map((item: any) => {
            if (!item?.x) return 0;
            return item.x;
          }),
        ),
      },
    ],
    width: interpolate(
      translateX?.value,
      data?.map?.((_, index: number) => index * screenWidth),
      measurements.map((item: any) => item?.width || 0),
    ),
    height: measurements[0]?.height || 40,
  }));

  const scrollViewContatinerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX?.value,
          data?.map?.((_, index: number) => index * screenWidth),
          measurements.map((item: any, index: number) => {
            if (!item?.x) return 0;
            const halfScreen = screenWidth / 2;
            if (item.x > halfScreen) {
              const filterRemaining = measurements.reduceRight(
                (acc, c) => {
                  const temp = acc.remainingWidth + c.width;
                  if (acc.remainingWidth >= halfScreen) {
                    return acc;
                  } else
                    return {
                      remainingX: c.x,
                      remainingWidth: temp,
                    };
                },
                {remainingX: 0, remainingWidth: 0},
              );
              if (filterRemaining.remainingX > item.x)
                return -item.x + (screenWidth - item.width) / 2;
              return (
                -1 *
                (filterRemaining.remainingX -
                  screenWidth +
                  filterRemaining.remainingWidth +
                  spacing.margin.small * 2)
              );
            } else {
              return 0;
            }
          }),
        ),
      },
    ],
  }));

  return (
    <View testID={testID || 'filter'} style={[styles.container, style]}>
      <PanGestureHandler
        activeOffsetX={[-100, 0]}
        onGestureEvent={panGestureEvent}>
        <Animated.View style={[animatedStyle]}>
          <Animated.View style={[scrollViewContatinerStyle]}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  paddingRight: 100,
                },
              ]}>
              {data?.map?.(renderItem)}
              <Animated.View
                style={[
                  {...StyleSheet.absoluteFillObject},
                  styles.itemSelectedContainer,
                  activeStyle,
                ]}></Animated.View>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.placeholder,
    },
    itemView: {
      padding: 0,
      margin: 0,
      marginLeft: spacing.margin.small,
    },
    itemContainer: {
      backgroundColor: colors.transparent,
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: colors.borderDivider,
    },
    itemSelectedContainer: {
      borderColor: colors.borderFocus,
      backgroundColor: colors.borderFocus,
      borderWidth: 1,
      borderRadius: 100,
      zIndex: -1,
    },
    iconLeftStyle: {marginRight: spacing.margin.base},
    icon: {
      marginRight: spacing.margin.small,
    },
  });
};

const _Filter = React.forwardRef(
  (props: FilterProps, ref?: React.Ref<ScrollView>) => (
    <FilterComponent filterRef={ref} {...props} />
  ),
);

const Filter = React.memo(_Filter);
Filter.whyDidYouRender = true;
export default Filter;
