import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import MarkdownView from '~/beinComponents/MarkdownView';
import TimeView from '~/beinComponents/TimeView';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';

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
}

const NotificationContent = ({
  description,
  content,
  updatedAt,
  type = '',
}: Props) => {
  const theme: ExtendedTheme = useTheme();
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
        <MarkdownView testID="notification_content.description">
          {description}
        </MarkdownView>
      </View>
      {!!content && (
        <MarkdownView
          testID="notification_content.content"
        >
          {content}
        </MarkdownView>
      )}
      <TimeView
        testID="notification_content.time_view"
        time={updatedAt}
        style={styles.timeCreated}
        type="short"
        textProps={{ variant: 'bodyS', color: colors.neutral40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default NotificationContent;
