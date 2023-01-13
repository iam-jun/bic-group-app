import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  StyleProp, ViewStyle, StyleSheet, View,
} from 'react-native';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';

type EditActionProps = {
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
    type: 'add' | 'edit';
    disabled?: boolean;
}

const EditAction: FC<EditActionProps> = ({
  style, onPress, type, disabled,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const iconName = type === 'add' ? 'Plus' : 'Pen';

  return (
    <Button
      style={[StyleSheet.absoluteFillObject]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.btnPosition}>
        <View style={[styles.container, style]}>
          <Icon icon={iconName} size={14} tintColor={disabled ? colors.neutral20 : colors.neutral40} />
        </View>
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      height: spacing.padding.extraLarge,
      width: spacing.padding.extraLarge,
      borderRadius: spacing.padding.extraLarge / 2,
      backgroundColor: colors.neutral2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnPosition: {
      position: 'absolute',
      top: spacing.margin.base,
      right: spacing.margin.large,
    },
  });
};

export default EditAction;
