import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import { formatDate } from '~/utils/formatData';

interface CreatePostBannerImportantProps {
  style?: StyleProp<ViewStyle>;
  expiresTime: any;
}

const CreatePostBannerImportant = ({ style, expiresTime }: CreatePostBannerImportantProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  const dateValue = formatDate(expiresTime, 'MMMM DD, YYYY HH:mm');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Icon
          icon="StarSolid"
          size={20}
          tintColor={colors.purple50}
        />
        <View style={styles.textView}>
          <Text.SubtitleM useI18n color={colors.neutral70}>common:text_important_post</Text.SubtitleM>
          {
            !!expiresTime && !!dateValue ? (
              <View style={styles.expiresOnTextContainer}>
                <Text.BodyM useI18n color={colors.neutral40}>
                  common:text_expires_on
                </Text.BodyM>
                <Text.BodyMMedium>
                  {dateValue}
                  .
                </Text.BodyMMedium>
              </View>
            )
              : (
                <Text.BodyM useI18n color={colors.neutral40}>common:text_never_expire</Text.BodyM>
              )
}
        </View>
      </View>
    </View>
  );
};

export default CreatePostBannerImportant;

const createStyles = (theme:ExtendedTheme) => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.large,
    paddingBottom: spacing.padding.small,
    borderBottomColor: theme.colors.neutral5,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textView: {
    marginLeft: spacing.margin.small,
  },
  expiresOnTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
