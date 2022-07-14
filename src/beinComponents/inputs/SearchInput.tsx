import React, {
  Ref,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, TextInput, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '../Icon';
import {fontFamilies} from '~/theme/fonts';
import {TextInputProps} from './TextInput';

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

  const theme: ITheme = useTheme() as ITheme;
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
          tintColor={theme.colors.textSecondary}
        />
        <TextInput
          ref={inputRef}
          testID={testID}
          style={styles.textInput}
          value={text}
          autoFocus={autoFocus}
          autoComplete={'off'}
          onChangeText={_onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.textSecondary}
          onFocus={_onFocus}
          returnKeyType={'search'}
          onSubmitEditing={_onSubmitEditing}
        />
        {!!text && (
          <Icon
            icon="iconClose"
            size={20}
            tintColor={theme.colors.iconTint}
            onPress={() => _onChangeText('')}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;

  return StyleSheet.create({
    container: {
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.placeholder,
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
      color: colors.textPrimary,
    },
  });
};

export default SearchInput;
