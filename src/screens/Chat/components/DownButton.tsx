import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
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
    <View style={styles.container}>
      <Icon
        tintColor={theme.colors.accent}
        icon="ArrowDown"
        onPress={onDownPress}
      />
    </View>
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
      zIndex: 3,
    },
  });
};

export default DownButton;
