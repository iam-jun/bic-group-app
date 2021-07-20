import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';

interface UserBadgeProps {
  label: string;
  icon: any;
  style?: StyleProp<ViewStyle>;
}

const UserBadge: React.FC<UserBadgeProps> = ({
  style,
  icon,
  label,
}: UserBadgeProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Icon icon={icon} size={12} />
      <Text.Subtitle style={styles.textInput}>{label}</Text.Subtitle>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderWidth: 0.4,
      borderColor: colors.primary3,
      borderRadius: 100,
      paddingHorizontal: spacing?.padding.tiny,
      paddingVertical: 2,
      alignSelf: 'baseline',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    textInput: {
      marginStart: 2,
      color: colors.primary,
      textAlign: 'center',
    },
  });
};

export default UserBadge;
