import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import spacing from '~/theme/spacing';
import Icon from '../baseComponents/Icon';
import Text from '../baseComponents/Text';

const { width: screenWidth } = Dimensions.get('window');
export interface FilterProps {
  translateX: Animated.SharedValue<number>;
  data?: {id: number; text: string; icon?: string; type: string}[];
  activeIndex?: number;
  filterRef?: React.Ref<ScrollView>;
  testID?: string;
  itemTestID?: string;
  style?: StyleProp<ViewStyle>;
  showItemBorder?: boolean;
  activeColor?: string;
  activeBackgroundColor?: string;
  inactiveColor?: string;

  onPress: (item: any, index: number) => void;
}

const FilterComponent: React.FC<FilterProps> = ({
  testID,
  style,
  data = [],
  itemTestID,
  onPress,
  activeIndex = 0,
  translateX,
  showItemBorder = true,
  activeColor,
  activeBackgroundColor,
  inactiveColor,
}: FilterProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = useMemo(
    () => createStyle(theme), [theme, style],
  );

  const [measurements, setMeasurements] = useState<any[]>(new Array(data?.length).fill({}));

  const _onPress = useCallback(
    (
      item: any, index: number,
    ) => {
      onPress?.(
        item, index,
      );
    },
    [onPress],
  );

  const panGestureValue = useSharedValue(0);
  const offsetValue = useSharedValue(0);
  const clampedTranslateX = useDerivedValue(() => {
    const lastMeasurements = measurements[measurements.length - 1];
    const MAX_TRANSLATE_X = -(
      (lastMeasurements?.x || 0)
        + (lastMeasurements?.width || 0)
        + spacing.margin.small
        - screenWidth
    ) || 0;
    if (MAX_TRANSLATE_X > 0) return 0;
    return Math.max(
      Math.min(
        panGestureValue.value, 0,
      ), MAX_TRANSLATE_X,
    );
  });

  const renderItem = (
    item: any, index: number,
  ) => {
    const isSelected = index === activeIndex;
    const itemStyle = [styles.itemContainer, showItemBorder ? styles.itemBorder : {}];
    const defaultTextColor = theme.colors.neutral80;
    const textColor = isSelected ? activeColor || defaultTextColor : inactiveColor || defaultTextColor;
    return (
      <View
        style={styles.itemView}
        key={`${itemTestID || 'item_filter'}_${item?.text}`}
        onLayout={(event) => {
          const { x, width, height } = event?.nativeEvent?.layout || {};
          if (
            measurements[index]?.x !== x
            || measurements[index]?.width !== width
          ) {
            measurements[index] = { x, width, height };
            setMeasurements([...measurements]);
          }
        }}
      >
        <TouchableOpacity
          activeOpacity={0.25}
          style={itemStyle}
          testID={`${itemTestID || 'item_filter'}_${item.id}`}
          onPress={() => {
            _onPress(
              item, index,
            );
          }}
        >
          {!!item?.icon && (
            <Icon
              icon={item.icon}
              size={24}
              tintColor={
                isSelected ? theme.colors.purple60 : theme.colors.gray50
              }
              style={styles.icon}
            />
          )}
          <Text color={textColor} variant={isSelected ? 'bodyMMedium' : 'bodyM'} useI18n>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onActive(event: any) {
      if (panGestureValue.value > 0) {
        offsetValue.value = 0;
        panGestureValue.value = event.translationX;
      } else {
        panGestureValue.value = event.translationX + offsetValue.value;
      }
    },
    onFinish() {
      offsetValue.value = panGestureValue.value;
    },
  });

  const scrollViewContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          clampedTranslateX.value, {
            duration: 10,
            easing: Easing.bezier(
              0.25, 0.1, 0.25, 1,
            ),
          },
        ),
      },
    ],
  }));

  const activeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX?.value,
          data?.map?.((
            _, index: number,
          ) => index * screenWidth),
          measurements.map((item: any) => {
            if (!item?.x) return 8;
            return item.x;
          }),
        ),
      },
    ],
    width: interpolate(
      translateX?.value,
      data?.map?.((
        _, index: number,
      ) => index * screenWidth),
      measurements.map((item: any) => item?.width || 60),
    ),
    height: measurements[0]?.height || 0,
    borderWidth: measurements[0]?.height ? 1 : 0,
  }));

  const itemActiveStyle = activeBackgroundColor ? {
    backgroundColor: activeBackgroundColor,
    borderColor: activeBackgroundColor,
  } : styles.itemActiveColor;

  return (
    <View testID={testID || 'filter'} style={[styles.container, style]}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[scrollViewContainerStyle]}>
          <View
            style={styles.row}
          >
            {data?.map?.(renderItem)}
            <Animated.View
              style={[
                { ...StyleSheet.absoluteFillObject },
                styles.itemActive,
                itemActiveStyle,
                activeStyle,
              ]}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
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
      paddingHorizontal: spacing.padding.base,
    },
    itemBorder: {
      borderWidth: 1,
      borderRadius: 100,
      borderColor: colors.neutral5,
    },
    itemActive: {
      borderRadius: 100,
      zIndex: -1,
    },
    itemActiveColor: {
      borderColor: colors.gray40,
      backgroundColor: colors.gray40,
    },
    iconLeftStyle: { marginRight: spacing.margin.base },
    icon: {
      marginRight: spacing.margin.small,
    },
    row: {
      flexDirection: 'row',
      paddingLeft: spacing.padding.small,
    },
  });
};

const _Filter = React.forwardRef((
  props: FilterProps, ref?: React.Ref<ScrollView>,
) => (
  <FilterComponent filterRef={ref} {...props} />
));

const Filter = React.memo(_Filter);
Filter.whyDidYouRender = true;
export default Filter;
