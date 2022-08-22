import {
  StyleSheet, View, TextInput, StyleProp, ViewStyle,
} from 'react-native';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from './Icon';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

interface SearchBaseViewProps {
  style?: StyleProp<ViewStyle>;
  isOpen: boolean;
  children?: React.ReactNode;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  searchViewRef?: any;
}

function SearchBaseView({
  style,
  isOpen,
  children,
  placeholder,
  initSearch,
  onClose,
  onChangeText,
  onFocus,
  onSubmitEditing,
  searchViewRef,
}: SearchBaseViewProps) {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const [searchText, setSearchText] = useState(initSearch || '');
  const textInputRef = useRef(null);

  const onPressBack = () => {
    setSearchText('');
    onClose?.();
    onChangeText?.('');
  };

  const _onChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const focus = () => textInputRef.current?.focus?.();
  const blur = () => textInputRef.current?.blur?.()

  useImperativeHandle(searchViewRef, () => ({
    setSearchText,
    focus,
    blur,
  }))

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.inputIconContainer}>
        <Icon
          icon="iconBack"
          onPress={onPressBack}
          size={24}
          hitSlop={{
            top: 20, bottom: 20, left: 20, right: 20,
          }}
          style={styles.iconBack}
          buttonTestID="search_base_view.back_button"
        />
        <TextInput
          ref={textInputRef}
          autoFocus
          testID="search_base_view.text_input"
          style={styles.textInput}
          value={searchText}
          autoComplete="off"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray40}
          selectionColor={theme.colors.gray50}
          onChangeText={_onChangeText}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
        />
        {!!searchText && (
          <Icon
            style={styles.iconClose}
            icon="iconClose"
            size={20}
            tintColor={theme.colors.neutral80}
            onPress={() => _onChangeText('')}
            buttonTestID="search_base_view.reset_button"
          />
        )}
      </View>
    </View>
  );

  return isOpen ? (
    <View style={[styles.container, style]}>
      {renderHeader()}
      {children}
    </View>
  ) : null;
}

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      zIndex: 99,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
    },
    headerContainer: {
      paddingTop: insets.top,
      overflow: 'hidden',
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: colors.white,
      ...elevations.e1,
    },
    iconBack: {
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.base,
    },
    textInput: {
      flex: 1,
      height: '100%',
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral80,
      marginHorizontal: spacing.margin.base,
    },
    inputIconContainer: {
      height: dimension.headerHeight,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.white,
      overflow: 'hidden',
      alignItems: 'center',
      paddingRight: spacing.padding.small,
      paddingLeft: spacing.padding.small,
    },
    iconClose: {
      marginRight: spacing.margin.large,
    },
  });
};

export default SearchBaseView;
