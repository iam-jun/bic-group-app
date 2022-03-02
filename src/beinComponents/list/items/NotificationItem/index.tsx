import React from 'react';
import {Platform, StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from 'react-native-paper';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import TimeView from '~/beinComponents/TimeView';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import {ITheme} from '~/theme/interfaces';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';

export interface NotificationItemProps {
  activities: IGetStreamNotificationActivity[];
  verb: string;
  is_read: boolean;
  is_seen: boolean;
  activity_count: number;
  actor_count: number;
  created_at: string;
  updated_at: string;
  isActive?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  activities,
  is_read,
  updated_at,
  isActive = false,
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
    } else if (!is_read) {
      return (
        <View
          testID="notification_item.indicator"
          style={styles.stateIndicatorUnread}
        />
      );
    }
  };

  // render notification body, it can be post content, comment content
  const renderNotiBody = (body: any) => {
    return <Text.BodyS style={styles.subContent}>{body}</Text.BodyS>;
  };

  // render notification item
  return (
    <Div className={className}>
      <View style={styles.container}>
        {renderIndicator()}
        <NotificationAvatar activities={activities} />
        <View style={styles.flex1}>
          <NotificationContent activities={activities} />
        </View>
        <TimeView time={updated_at} style={styles.timeCreated} type={'short'} />
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
    flex1: {flex: 1},
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
    content: {
      marginStart: spacing?.margin.base,
      flex: 1,
    },

    subContent: {
      color: colors.textSecondary,
    },
    iconOptions: {},
    timeCreated: {
      marginTop: 1,
      marginLeft: spacing.margin.base,
      color: colors.textSecondary,
    },
    reactIcon: {
      transform: [{translateY: 4}],
    },
  });
};

export default NotificationItem;
