import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import { TextInput } from '~/baseComponents/Input';
import { formatDate } from '~/utils/formatData';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface CreatePostBannerImportantProps {
  style?: StyleProp<ViewStyle>;
  expiresTime: any;
}

const CreatePostBannerImportant = ({ style, expiresTime }: CreatePostBannerImportantProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  const dateValue = formatDate(expiresTime, 'DD/MM/YYYY');
  const timeValue = formatDate(expiresTime, 'hh:mm A', undefined, 9999);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Icon
          icon="StarSolid"
          size={20}
          tintColor={colors.purple50}
        />
        <View style={styles.textView}>
          <Text.SubtitleM color={colors.neutral70} useI18n>common:text_important_posts</Text.SubtitleM>
          <Text.BodyXS color={colors.neutral40} useI18n>post:expire_time_desc</Text.BodyXS>
        </View>
      </View>
      <View style={[styles.row, styles.endDateBlock]}>
        <Text.LabelS useI18n>common:text_end_date</Text.LabelS>
        <ViewSpacing width={8} />
        <TextInput editable={false} value={dateValue} style={{ flex: 1 }} />
        <ViewSpacing width={8} />
        <TextInput editable={false} value={timeValue} style={{ flex: 1 }} />
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
  endDateBlock: {
    marginTop: spacing.margin.xSmall,
  },
  textView: {
    marginLeft: spacing.margin.small,
  },
});
