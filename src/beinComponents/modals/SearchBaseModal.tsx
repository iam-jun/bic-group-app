import {StyleSheet, View, Modal, TextInput, Platform} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import {fontFamilies} from '~/theme/fonts';

interface SearchBaseModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  placeholder?: string;
  onClose?: () => void;
  onChangeText?: (text: string) => void;
}

const SearchBaseModal = ({
  isOpen,
  children,
  placeholder,
  onClose,
  onChangeText,
}: SearchBaseModalProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const [searchText, setSearchText] = useState('');

  const onPressBack = () => {
    setSearchText('');
    onClose?.();
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
            buttonTestID="search_modal.back_button"
          />
          <TextInput
            testID={'search_modal.text_input'}
            style={styles.textInput}
            value={searchText}
            autoFocus
            autoComplete={'off'}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            selectionColor={theme.colors.textSecondary}
            onChangeText={_onChangeText}
          />
          {!!searchText && (
            <Icon
              style={styles.iconClose}
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

  return (
    <Modal visible={isOpen} animationType="fade" presentationStyle="fullScreen">
      {renderHeader()}
      {children}
    </Modal>
  );
};

export default SearchBaseModal;

const createStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    headerContainer: {
      paddingTop: Platform.OS === 'android' ? 0 : insets.top,
      overflow: 'hidden',
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: colors.background,
    },
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.borderDivider,
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
      fontFamily: fontFamilies.OpenSans,
      fontSize: dimension.sizes.body,
      color: colors.textPrimary,
      marginHorizontal: spacing.margin.base,
    },
    inputIconContainer: {
      height: dimension.headerHeight,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.background,
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
