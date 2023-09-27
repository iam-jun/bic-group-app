import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { PostStatus } from '~/interfaces/IPost';
import { formatDate } from '~/utils/formatter';

interface BoxScheduleTimeProps {
  scheduledAt: string;
  status: PostStatus;
  isBorderTop?: boolean;
  isBorderBottomShadow?: boolean;
  isMarginBottom?: boolean;
}

const BoxScheduleTime: React.FC<BoxScheduleTimeProps> = ({
  scheduledAt,
  status,
  isBorderTop = false,
  isBorderBottomShadow = false,
  isMarginBottom = false,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const isFail = status === PostStatus.SCHEDULE_FAILED;

  const scheduleTimeStyle = {
    normal: {
      backgroundColor: colors.white,
      labelTimeColor: colors.purple50,
      iconColor: colors.purple20,
    },
    fail: {
      backgroundColor: colors.red2,
      labelTimeColor: colors.red40,
      iconColor: colors.red30,
    },
  };

  const {
    backgroundColor,
    labelTimeColor,
    iconColor,
  } = isFail ? scheduleTimeStyle.fail : scheduleTimeStyle.normal;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        isBorderTop && styles.borderTop,
        isBorderBottomShadow && styles.bottomBorderAndShadow,
        isMarginBottom && styles.marginBottom,
      ]}
      testID="box_schedule_time"
    >
      <View style={styles.boxRow}>
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
          |
          {' '}
        </Text>
        <View style={styles.boxRow}>
          <Text.BodyMMedium color={labelTimeColor}>
            {formatDate(scheduledAt, 'HH:mm')}
          </Text.BodyMMedium>
        </View>
      </View>
      {isFail && (
        <Icon
          icon="CircleExclamationSolid"
          tintColor={iconColor}
          size={18}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderTop: {
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
    },
    boxRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: spacing.margin.tiny,
    },
    bottomBorderAndShadow: {
      ...elevations.e2,
    },
    marginBottom: {
      marginBottom: spacing.margin.large,
    },
  });
};

export default BoxScheduleTime;
