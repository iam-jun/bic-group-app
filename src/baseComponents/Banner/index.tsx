import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';

interface BannerImportantProps {
  style?: StyleProp<ViewStyle>;
  markedAsRead?: boolean;
}

const BannerImportant = ({ style, markedAsRead }: BannerImportantProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();
  const { colors } = theme;

  const importantStyles = {
    active: {
      textColor: colors.white,
      backgroundColor: colors.purple50,
      iconColor: colors.white,
    },
    inactive: {
      textColor: colors.neutral40,
      backgroundColor: colors.neutral20,
      iconColor: colors.neutral40,
    },
  };

  const { textColor, backgroundColor, iconColor } = markedAsRead ? importantStyles.inactive : importantStyles.active;

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Icon
        icon="StarSolid"
        size={18}
        tintColor={iconColor}
      />
      <View style={styles.textView}>
        <Text.SubtitleS color={textColor} useI18n>common:text_important</Text.SubtitleS>
      </View>
    </View>
  );
};

export default BannerImportant;

const createStyles = () => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textView: {
    paddingVertical: spacing.padding.xSmall,
    marginLeft: spacing.margin.small,
  },
});
