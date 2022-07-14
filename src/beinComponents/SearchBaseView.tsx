import {StyleSheet, View, Platform, TextInput} from 'react-native';
import React, {useState} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from './Icon';
import {fontFamilies} from '~/theme/fonts';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

interface SearchBaseViewProps {
  isOpen: boolean;
  children?: React.ReactNode;
  placeholder?: string;
  initSearch?: string;
  onClose?: () => void;
  onChangeText?: (text: string) => void;
}

const SearchBaseView = ({
  isOpen,
  children,
  placeholder,
  initSearch,
  onClose,
  onChangeText,
}: SearchBaseViewProps) => {
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyles(theme);

  const [searchText, setSearchText] = useState(initSearch || '');

  const onPressBack = () => {
    setSearchText('');
    onClose?.();
    onChangeText?.('');
  };

  const _onChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const renderHeader = () => {
    return (
      <View style={[styles.headerContainer, styles.bottomBorderAndShadow]}>
        <View style={styles.inputIconContainer}>
          <Icon
            icon="iconBack"
            onPress={onPressBack}
            size={24}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            style={styles.iconBack}
            buttonTestID="search_base_view.back_button"
          />
          <TextInput
            autoFocus
            testID={'search_base_view.text_input'}
            style={styles.textInput}
            value={searchText}
            autoComplete={'off'}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.gray40}
            selectionColor={theme.colors.gray50}
            onChangeText={_onChangeText}
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
  };

  return isOpen ? (
    <View style={styles.container}>
      {renderHeader()}
      {children}
    </View>
  ) : null;
};

const createStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
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
    },
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.neutral5,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
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
