import React, {useState} from 'react';
import {StyleSheet, View, TextInput, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '../Icon';
import {fontFamilies} from '~/theme/fonts';
import {TextInputProps} from './TextInput';

export interface SearchInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  autoFocus?: boolean;
  onChangeText?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  style,
  placeholder,
  autoFocus,
  onChangeText,
}: SearchInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const [text, setText] = useState<string>('');

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.itemContainer}>
        <Icon
          icon="search"
          size={14}
          style={styles.iconSearch}
          tintColor={theme.colors.textSecondary}
        />
        <TextInput
          style={styles.textInput}
          value={text}
          autoFocus={autoFocus}
          onChangeText={_onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.textSecondary}
        />
        {!!text && (
          <Icon
            icon="iconClose"
            size={16}
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
      // alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
    itemContainer: {
      flexDirection: 'row',
    },
    textInput: {
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension?.sizes.body,
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing?.margin.small,
    },
    iconSearch: {
      marginLeft: spacing?.margin.small,
      marginRight: spacing?.margin.tiny,
    },
  });
};

export default SearchInput;
