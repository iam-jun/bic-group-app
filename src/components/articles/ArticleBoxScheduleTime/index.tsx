import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { PostStatus } from '~/interfaces/IPost';
import { formatDate } from '~/utils/formatter';

interface ArticleBoxScheduleTimeProps {
  scheduledAt: string;
  status: PostStatus;
}

const ArticleBoxScheduleTime: React.FC<ArticleBoxScheduleTimeProps> = ({
  scheduledAt,
  status,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const isFail = status === PostStatus.SCHEDULE_FAILED;

  const scheduleTimeStyle = {
    normal: {
      backgroundColor: colors.blue2,
      textColor: colors.neutral40,
      labelTimeColor: colors.blue50,
      iconColor: colors.blue20,
    },
    fail: {
      backgroundColor: colors.red2,
      textColor: colors.neutral40,
      labelTimeColor: colors.red40,
      iconColor: colors.red30,
    },
  };

  const {
    backgroundColor,
    textColor,
    labelTimeColor,
    iconColor,
  } = isFail ? scheduleTimeStyle.fail : scheduleTimeStyle.normal;

  return (
    <View
      style={[styles.container, { backgroundColor }]}
      testID="article_box_schedule_time"
    >
      <View style={styles.boxTop}>
        <Text.BodyXS color={textColor} useI18n>
          article:text_article_schedule
        </Text.BodyXS>
        {isFail && (
        <Text.BadgeS color={colors.red40} useI18n>
          article:text_article_schedule_fail
        </Text.BadgeS>
        )}
      </View>
      <View style={styles.boxPublicTime}>
        <View style={styles.boxRow}>
          <Icon
            icon="Calendar"
            tintColor={iconColor}
            size={18}
            style={styles.icon}
          />
          <Text.BodyMMedium color={labelTimeColor}>
            {formatDate(scheduledAt, 'dddd, MMM D')}
          </Text.BodyMMedium>
        </View>
        <Text color={colors.blue20}>
          {' '}
          -
          {' '}
        </Text>
        <View style={styles.boxRow}>
          <Icon
            icon="Clock"
            tintColor={iconColor}
            size={18}
            style={styles.icon}
          />
          <Text.BodyMMedium color={labelTimeColor}>
            {formatDate(scheduledAt, 'hh:mm A')}
          </Text.BodyMMedium>
        </View>
      </View>
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.small,
  },
  boxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.padding.xSmall,
  },
  boxPublicTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.small,
  },
  boxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.margin.tiny,
  },
});

export default ArticleBoxScheduleTime;
