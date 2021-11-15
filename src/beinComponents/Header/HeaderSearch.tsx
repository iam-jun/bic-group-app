import React, {FC, useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import i18next from 'i18next';
import Icon from '~/beinComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';

export interface HeaderSearchProps {
  isShowSearch: boolean;
  onSearchText?: (searchText: string) => void;
  onPressBack?: () => void;
  placeholder?: string;
}

const HeaderSearch: FC<HeaderSearchProps> = ({
  isShowSearch,
  onSearchText,
  onPressBack,
  placeholder,
}: HeaderSearchProps) => {
  const [isShow, setIsShow] = useState(false);
  const showValue = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const iconStyle = useAnimatedStyle(() => ({
    marginLeft: spacing.margin.large,
    opacity: Platform.OS === 'web' ? 1 : showValue.value,
  }));
  const searchContainerStyle = useAnimatedStyle(() => ({
    width: `${interpolate(
      showValue.value,
      [0, 1],
      [Platform.OS === 'web' ? 96 : 0, 96],
    )}%`,
  }));

  const show = () => {
    setIsShow(true);
    showValue.value = withSpring(1, {mass: 0.8});
  };

  const hide = () => {
    const onHideDone = () => {
      setIsShow(false);
    };
    showValue.value = withTiming(0, undefined, () => {
      runOnJS(onHideDone)();
    });
  };

  useEffect(() => {
    if (isShowSearch) {
      show();
    } else {
      hide();
    }
  }, [isShowSearch]);

  if (!isShow) {
    return null;
  }

  const _onChangeText = (text: string) => {
    onSearchText?.(text);
  };

  const _onPressBack = () => {
    onPressBack?.();
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={iconStyle}>
        <Icon
          icon="iconBack"
          onPress={_onPressBack}
          size={28}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        />
      </Animated.View>
      <View style={styles.searchWrapper}>
        <Animated.View style={[searchContainerStyle, styles.searchContainer]}>
          <SearchInput
            style={styles.searchInput}
            onChangeText={_onChangeText}
            placeholder={placeholder || i18next.t('input:search_group')}
          />
        </Animated.View>
      </View>
      <ViewSpacing width={spacing.margin.large} />
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, dimension, spacing} = theme;
  return StyleSheet.create({
    container: {
      height: dimension?.headerHeight || 44,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    searchWrapper: {
      flex: 1,
      alignItems: 'flex-end',
    },
    searchInput: {flex: 1, backgroundColor: undefined},
    searchContainer: {
      height: 36,
      overflow: 'hidden',
      backgroundColor: colors.placeholder,
      borderRadius: spacing.borderRadius.large,
    },
  });
};

export default HeaderSearch;
