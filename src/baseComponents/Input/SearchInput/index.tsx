import React, {
  Ref,
  useEffect,
  useState,
  useImperativeHandle,
  RefObject,
  useRef,
} from 'react';
import {
  StyleSheet, View, TextInput, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '../../Icon';
import { fontFamilies } from '~/theme/fonts';
import { TextInputProps } from '../TextInput';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import { SEARCH_INPUT_SIZES } from './constants';

export interface SearchInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputRef?: RefObject<TextInput>;
  searchInputRef?: Ref<{setText:(text: string)=>void}>;
  size?: keyof typeof SEARCH_INPUT_SIZES,

  onSubmitEditing?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  style,
  value,
  inputRef,
  searchInputRef,
  size = 'medium',

  onChangeText,
  onFocus,
  onSubmitEditing,
  ...props
}: SearchInputProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const textInputRef = useRef<any>();

  const [text, setText] = useState<string>('');
  const [isFocused, setFocused] = useState(false);

  const focus = () => inputRef?.current?.focus?.();
  const blur = () => inputRef?.current?.blur?.();

  useEffect(
    () => {
      setText(value || '');
    }, [value],
  );

  useImperativeHandle(
    searchInputRef, () => ({
      setText,
      focus,
      blur,
    }),
  );

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  const _onFocus = () => {
    onFocus?.();
    setFocused(true);
  };

  const _onBlur = () => {
    setFocused(false);
  };

  const _onSubmitEditing = () => {
    if (text?.trim?.()) {
      onSubmitEditing?.();
    }
  };

  const _onClearTextInput = () => {
    _onChangeText('');
    textInputRef?.current?.focus?.();
  };

  return (
    <View
      testID="search_input"
      style={[
        styles.container, style,
        { height: SEARCH_INPUT_SIZES[size] },
        isFocused && styles.focused,
      ]}
    >
      <View style={styles.itemContainer}>
        <Icon
          testID="search_input.icon"
          style={styles.searchIcon}
          icon="search"
          size={18}
          tintColor={theme.colors.neutral20}
        />
        <TextInput
          {...props}
          testID="search_input.input"
          ref={inputRef || textInputRef}
          style={styles.textInput}
          value={text}
          autoComplete="off"
          returnKeyType="search"
          placeholderTextColor={theme.colors.neutral20}
          selectionColor={theme.colors.gray50}
          onFocus={_onFocus}
          onBlur={_onBlur}
          onChangeText={_onChangeText}
          onSubmitEditing={_onSubmitEditing}
        />
        {!!text && (
          <Icon
            testID="search_input.icon_clear"
            style={styles.iconClose}
            icon="iconClose"
            size={8}
            tintColor={theme.colors.neutral40}
            onPress={_onClearTextInput}
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
      backgroundColor: colors.white,
      justifyContent: 'center',
      paddingLeft: spacing.padding.small,
      paddingRight: spacing.padding.base,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
    focused: {
      borderColor: colors.purple50,
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
      fontSize: dimension?.sizes.bodyS,
      color: colors.neutral80,
    },
    iconClose: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default SearchInput;
