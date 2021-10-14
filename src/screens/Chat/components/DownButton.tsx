import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  visible: boolean;
  onDownPress: () => void;
}

const DownButton = ({visible, onDownPress}: Props) => {
  if (!visible) return null;
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <ButtonWrapper
      nativeID="down-button"
      style={[styles.container, Platform.OS !== 'web' && styles.shadow]}
      onPress={onDownPress}>
      <Icon tintColor={theme.colors.accent} icon="ArrowDown" />
    </ButtonWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 24,
      right: 24,
      borderWidth: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.background,
      borderColor: Platform.OS !== 'web' ? colors.primary3 : undefined,
      borderRadius: spacing.borderRadius.large,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 6,
    },
  });
};

export default DownButton;
