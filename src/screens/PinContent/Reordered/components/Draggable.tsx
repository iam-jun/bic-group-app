import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';

const Draggable = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  return (
    <Button style={styles.container} disabled>
      <Icon
        icon="Bars"
        size={14}
        tintColor={colors.neutral40}
      />
    </Button>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: spacing.margin.small,
      left: spacing.margin.small,
      backgroundColor: colors.neutral2,
      height: 28,
      width: 28,
      borderRadius: borderRadius.base,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });
};

export default Draggable;
