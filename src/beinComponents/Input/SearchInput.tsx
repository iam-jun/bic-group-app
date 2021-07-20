import React, {useState} from 'react';
import {StyleSheet, View, TextInput, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import Icon from '../Icon';
import {fontFamilies} from '~/theme/fonts';

interface SearchInputProps {
  style?: StyleProp<ViewStyle>;
}

const SearchInput: React.FC<SearchInputProps> = ({style}: SearchInputProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();

  const [text, setText] = useState<string>('');

  const onReset = () => setText('');

  return (
    <View style={[styles.container, style]}>
      <View style={{flexDirection: 'row'}}>
        <Icon icon={'Search'} size={16} tintColor={theme.colors.iconTint} />
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={text => setText(text)}
          placeholder={t('input:search')}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {!!text && (
          <Icon
            icon={'iconClose'}
            size={16}
            tintColor={theme.colors.iconTint}
            onPress={onReset}
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
      width: 327,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.placeholder,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
    textInput: {
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension.sizes.body,
      color: colors.textPrimary,
      flex: 1,
      marginHorizontal: spacing?.margin.small,
    },
  });
};

export default SearchInput;
