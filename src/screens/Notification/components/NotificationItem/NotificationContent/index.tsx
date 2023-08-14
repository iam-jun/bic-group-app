import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import TimeView from '~/beinComponents/TimeView';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import Markdown from '~/beinComponents/Markdown';
import Text from '~/baseComponents/Text';
import { fontFamilies } from '~/theme/fonts';

const LIST_NOTI_SHOW_ICON = [
  {
    type: NOTIFICATION_TYPE.APPROVED_KYC,
    icon: 'BadgeCheck',
  },
];

interface Props {
  description: string;
  content: string;
  updatedAt: string;
  type?: string;
  isRead?: boolean;
  isShowDeclineText?: boolean;
  isShowAcceptText?: boolean;
  isAlreadyJoined?: boolean;
}

const NotificationContent = ({
  description,
  content,
  updatedAt,
  type = '',
  isRead = false,
  isShowDeclineText = false,
  isShowAcceptText = false,
  isAlreadyJoined = false,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (type && !icon) {
      const notiIconInfo = LIST_NOTI_SHOW_ICON.find((item) => item.type === type);
      if (notiIconInfo) {
        setIcon(notiIconInfo.icon);
      }
    }
  }, [type, icon]);

  return (
    <View testID="notification_content" style={styles.container}>
      <View style={styles.row}>
        {!!icon
      && (
      <Icon
        testID="notification_content.icon"
        size={14}
        tintColor={colors.green50}
        icon={icon as any}
        style={styles.icon}
      />
      )}
        { Boolean(description) && (
        <Markdown
          testID="notification_content.description"
          value={description}
        />
        )}
      </View>
      {!!content && (
      <Markdown
        testID="notification_content.content"
        value={content}
      />
      )}
      { Boolean(isShowAcceptText) && (
      <Text.BodyM useI18n style={styles.invitationText}>
        notification:text_invitation_accepted
      </Text.BodyM>
      )}
      {
        Boolean(isShowDeclineText) && (
        <Text.BodyM useI18n style={styles.invitationText}>
          notification:text_invitation_declined
        </Text.BodyM>
        )
        }
      { Boolean(isAlreadyJoined) && (
      <Text.BodyM useI18n style={styles.invitationText}>
        notification:text_you_have_previously_joined
      </Text.BodyM>
      )}
      <View style={[styles.row, styles.timeCreated]}>
        {
        Boolean(!isRead)
        && <View style={styles.dot} />
      }
        <TimeView
          testID="notification_content.time_view"
          time={updatedAt}
          type="short"
          textProps={{ variant: 'bodyS', color: colors.neutral40 }}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    timeCreated: {
      marginTop: spacing.margin.tiny,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: spacing.margin.xSmall,
    },
    dot: {
      width: spacing.margin.small,
      height: spacing.margin.small,
      borderRadius: spacing.borderRadius.circle,
      backgroundColor: colors.purple50,
      marginRight: spacing.margin.xSmall,
    },
    invitationText: {
      fontFamily: fontFamilies.BeVietnamProLightItalic,
    },
  });
};

export default NotificationContent;
