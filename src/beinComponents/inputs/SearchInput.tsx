import React, {
  Ref,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet, View, TextInput, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '../Icon';
import { fontFamilies } from '~/theme/fonts';
import { TextInputProps } from './TextInput';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export interface SearchInputProps extends TextInputProps {
  searchInputRef?: Ref<TextInput>;
  inputRef?: Ref<TextInput>;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  autoFocus?: boolean;
  value?: string;
  testID?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchInputRef,
  inputRef,
  style,
  placeholder,
  autoFocus,
  value,
  testID,
  onChangeText,
  onFocus,
  onSubmitEditing,
}: SearchInputProps) => {
  const _searchInputRef = searchInputRef || useRef<any>();

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const [text, setText] = useState<string>('');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  useImperativeHandle(_searchInputRef, () => ({
    setText,
  }));

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  const _onFocus = () => {
    onFocus?.();
  };

  const _onSubmitEditing = () => {
    if (text?.trim?.()) {
      onSubmitEditing?.();
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.itemContainer}>
        <Icon
          style={styles.searchIcon}
          icon="search"
          size={20}
          tintColor={theme.colors.gray50}
        />
        <TextInput
          ref={inputRef}
          testID={testID}
          style={styles.textInput}
          value={text}
          autoFocus={autoFocus}
          autoComplete="off"
          onChangeText={_onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray50}
          selectionColor={theme.colors.gray50}
          onFocus={_onFocus}
          returnKeyType="search"
          onSubmitEditing={_onSubmitEditing}
        />
        {!!text && (
          <Icon
            icon="iconClose"
            size={20}
            tintColor={theme.colors.neutral80}
            onPress={() => _onChangeText('')}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.neutral5,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchIcon: {
      marginRight: spacing.margin.small,
    },
    textInput: {
      flex: 1,
      height: '100%',
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension?.sizes.bodyM,
      color: colors.neutral80,
    },
  });
};

export default SearchInput;
