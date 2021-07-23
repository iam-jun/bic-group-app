import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';

interface ThreadProps {
  label: string;
  isTrending?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Thread: React.FC<ThreadProps> = ({
  style,
  label,
  isTrending,
}: ThreadProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text.Subtitle style={styles.textInput}>💎 # {label}</Text.Subtitle>
      {isTrending && (
        <Icon
          icon={'Star'}
          size={16}
          tintColor={theme.colors.iconTint}
          style={{marginStart: 3}}
        />
      )}
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderWidth: 0.4,
      borderColor: colors.primary3,
      borderRadius: 6,
      borderTopLeftRadius: 1,
      paddingHorizontal: spacing?.padding.tiny,
      paddingVertical: 2,
      alignSelf: 'baseline',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      color: colors.primary,
      textAlign: 'center',
    },
  });
};

export default Thread;
