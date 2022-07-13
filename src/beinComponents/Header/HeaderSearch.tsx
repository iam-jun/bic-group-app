import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import i18next from 'i18next';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import Icon from '~/beinComponents/Icon';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export interface HeaderSearchProps {
  testID?: string;
  headerSearchRef?: any;
  inputRef?: any;
  isShowSearch: boolean;
  onSearchText?: (searchText: string) => void;
  onPressBack?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onSubmitSearch?: () => void;
}

const HeaderSearch: FC<HeaderSearchProps> = ({
  testID,
  headerSearchRef,
  inputRef,
  isShowSearch,
  onSearchText,
  onPressBack,
  placeholder,
  autoFocus = false,
  onFocus,
  onSubmitSearch,
}: HeaderSearchProps) => {
  const [isShow, setIsShow] = useState(false);
  const searchInputRef = useRef<any>();
  const _headerSearchRef = headerSearchRef || useRef();
  const _inputRef = inputRef || useRef();
  const showValue = useSharedValue(0);

  const theme = useTheme() as ExtendedTheme;
  const styles = createStyle(theme);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: showValue.value,
  }));
  const searchContainerStyle = useAnimatedStyle(() => ({
    width: `${interpolate(showValue.value, [0, 1], [0, 100])}%`,
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

  const setSearchText = (searchText: string) => {
    searchInputRef?.current?.setText?.(searchText);
  };

  useImperativeHandle(_headerSearchRef, () => ({
    setSearchText,
  }));

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
          size={24}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          style={styles.icon}
        />
      </Animated.View>
      <View style={styles.searchWrapper}>
        <Animated.View style={[searchContainerStyle, styles.searchContainer]}>
          <SearchInput
            testID={testID}
            searchInputRef={searchInputRef}
            inputRef={_inputRef}
            autoFocus={autoFocus}
            onFocus={onFocus}
            style={styles.searchInput}
            onChangeText={_onChangeText}
            placeholder={placeholder || i18next.t('input:search_group_people')}
            onSubmitEditing={onSubmitSearch}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      height: dimension?.headerHeight || 44,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingLeft: spacing.padding.small,
      paddingRight: spacing.padding.base,
    },
    searchWrapper: {
      flex: 1,
      alignItems: 'flex-end',
    },
    searchInput: {flex: 1, backgroundColor: undefined},
    searchContainer: {
      height: 40,
      overflow: 'hidden',
      backgroundColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
    },
    icon: {
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.base,
    },
  });
};

export default HeaderSearch;
