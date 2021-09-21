import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  visible: boolean;
  onDownPress: () => void;
}

const DownButton = ({visible, onDownPress}: Props) => {
  if (Platform.OS === 'web' || !visible) return null;
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <Icon
      iconStyle={styles.container}
      tintColor={theme.colors.accent}
      icon="ArrowDown"
      onPress={onDownPress}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      borderWidth: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.background,
      borderColor: colors.primary3,
      borderRadius: spacing.borderRadius.large,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
  });
};

export default DownButton;
