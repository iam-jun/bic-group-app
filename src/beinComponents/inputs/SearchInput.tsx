import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '../Icon';
import {fontFamilies} from '~/theme/fonts';
import {TextInputProps} from './TextInput';
import Text from '~/beinComponents/Text';

export interface SearchInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  autoFocus?: boolean;
  value?: string;
  onChangeText?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  style,
  placeholder,
  autoFocus,
  value,
  onChangeText,
}: SearchInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const [text, setText] = useState<string>('');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText?.(text);
  };

  const Wrapper = Platform.OS === 'web' ? Text : View;

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Wrapper style={styles.itemContainer}>
        <Icon icon="search" size={16} tintColor={theme.colors.textSecondary} />
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
      </Wrapper>
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
      paddingHorizontal: spacing.padding.base,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension?.sizes.body,
      color: colors.textPrimary,
      flex: 1,
      marginHorizontal: spacing.margin.small,
    },
  });
};

export default SearchInput;
