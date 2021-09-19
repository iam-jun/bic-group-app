import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  onDownPress: () => void;
}

const DownButton = ({onDownPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <Icon
      iconStyle={styles.container}
      backgroundColor={theme.colors.background}
      icon="AngleDown"
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
      padding: 6,
      borderColor: colors.accent,
      borderRadius: 99,
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
