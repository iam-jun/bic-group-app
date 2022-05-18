import React from 'react';
import {Platform, StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from 'react-native-paper';
import Div from '~/beinComponents/Div';
import TimeView from '~/beinComponents/TimeView';
import {
  IGetStreamNotificationActivity,
  INotiExtraData,
} from '~/interfaces/INotification';
import {ITheme} from '~/theme/interfaces';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';

export interface NotificationItemProps {
  activities: IGetStreamNotificationActivity[];
  verb: string;
  isRead: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  extra: INotiExtraData;
  group: string;
  activityCount: number;
  actorCount: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  activities,
  isRead,
  updatedAt,
  isActive = false,
  extra,
  verb,
  actorCount,
}: NotificationItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  let className = 'notification-item';
  if (isActive) className = 'notification-item--active';

  const renderIndicator = () => {
    if (Platform.OS === 'web' && isActive) {
      return (
        <View
          testID="notification_item.indicator.web"
          style={styles.stateIndicatorActive}
        />
      );
    } else if (!isRead) {
      return (
        <View
          testID="notification_item.indicator"
          style={styles.stateIndicatorUnread}
        />
      );
    }
  };

  // render notification item
  return (
    <Div className={className}>
      <View style={styles.container}>
        {renderIndicator()}
        <NotificationAvatar actor={extra.actor} />
        <NotificationContent
          description={extra?.description || ''}
          defaultContent={extra?.content || ''}
          activities={activities}
          verb={verb}
          actorCount={actorCount}
        />
        <TimeView
          testID="notification_item.time_view"
          time={updatedAt}
          style={styles.timeCreated}
          type={'short'}
        />
      </View>
    </Div>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  const stateIndicator = {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.primary5,
  } as ViewProps;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
    },
    stateIndicatorActive: {
      ...stateIndicator,
      top: 20,
      width: 4,
      height: 48,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    stateIndicatorUnread: {
      ...stateIndicator,
      top: 40,
      left: 4,
      width: 6,
      height: 6,
      borderRadius: 6,
    },
    timeCreated: {
      marginTop: 1,
      marginLeft: spacing.margin.base,
      color: colors.textSecondary,
    },
  });
};

export default NotificationItem;
