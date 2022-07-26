import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import { useBaseHook } from '~/hooks';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

export interface DropDownMenuProps {
  style?: StyleProp<ViewStyle>;
  initIndex?: number;
  data: any;
  onChange?: (item: any, index: number) => void;
  minWidth?: number;
}

/**
 * Make sure parent of this view have highest zIndex to work on iOS
 */

const DropDownMenu: FC<DropDownMenuProps> = ({
  style,
  initIndex = -1,
  data,
  onChange,
  minWidth = 100,
}: DropDownMenuProps) => {
  const [selectingIndex, setSelectingIndex] = useState(initIndex);

  const showOptionsValue = useSharedValue(0);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const selectingItem = data?.[selectingIndex] || {};

  const { title = t('common:text_select'), icon } = selectingItem;

  const optionsStyle = useAnimatedStyle(() => ({
    right: interpolate(showOptionsValue.value, [0, 0.2, 1], [-200, 0, 0]),
    opacity: interpolate(showOptionsValue.value, [0, 0.2, 1], [0, 0, 1]),
  }));

  const showOptions = (callback?: () => void) => {
    showOptionsValue.value = withTiming(1, { duration: 300 }, () => {
      callback && runOnJS(callback)();
    });
  };

  const hideOptions = (callback?: () => void) => {
    showOptionsValue.value = withTiming(0, { duration: 100 }, () => {
      callback && runOnJS(callback)();
    });
  };

  const onPressItem = (item: any, index: number) => {
    hideOptions(() => {
      setSelectingIndex(index);
      onChange?.(item, index);
    });
  };

  const renderActiveItem = () => (
    <TouchableOpacity
      onPress={() => (showOptionsValue.value === 1 ? hideOptions() : showOptions())}
      style={styles.row}
    >
      {!!icon && (
      <Icon
        tintColor={colors.gray50}
        icon={icon}
        style={{ marginRight: spacing.margin.tiny }}
      />
      )}
      <Text useI18n color={colors.gray50}>
        {title}
      </Text>
      <Icon icon="AngleDown" style={{ marginLeft: spacing.margin.tiny }} />
    </TouchableOpacity>
  );

  const renderItem = (item: any, index: number) => {
    if (index === selectingIndex) {
      return null;
    }
    return (
      <TouchableOpacity onPress={() => onPressItem(item, index)}>
        <View style={styles.row}>
          {!!item?.icon && (
            <Icon
              tintColor={colors.gray50}
              icon={item?.icon}
              style={{ marginRight: spacing.margin.tiny }}
            />
          )}
          <Text useI18n color={colors.gray50}>
            {item?.title}
          </Text>
        </View>
        {index < (data?.length || 0) - 1 && <Divider margin={spacing.margin.tiny} />}
      </TouchableOpacity>
    );
  };

  const renderOptions = () => (
    <Animated.View style={[styles.optionStyle, optionsStyle]}>
      {renderActiveItem()}
      <Divider margin={spacing.margin.tiny} />
      {data?.map?.(renderItem)}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { minWidth }, style]}>
      <View style={styles.activeItemContainer}>{renderActiveItem()}</View>
      {renderOptions()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      zIndex: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.tiny,
    },
    optionStyle: {
      position: 'absolute',
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.neutral5,
      borderWidth: 1,
      backgroundColor: colors.white,
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
    activeItemContainer: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.neutral5,
      borderWidth: 1,
      backgroundColor: colors.white,
    },
  });
};

export default DropDownMenu;
