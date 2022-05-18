import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from 'react-native-paper';
import TimeView from '~/beinComponents/TimeView';
import Icon from '~/beinComponents/Icon';

import {
  IGetStreamNotificationActivity,
  INotiExtraData,
} from '~/interfaces/INotification';
import {ITheme} from '~/theme/interfaces';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
  const {colors} = theme;
  let className = 'notification-item';
  if (isActive) className = 'notification-item--active';

  const onPressOption = () => {
    alert('onPressOption');
  };

  const renderIndicator = () => {
    if (!isRead) {
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: isRead
            ? theme.colors.background
            : theme.colors.bgSecondary,
        },
      ]}>
      <View
        style={{
          flex: 1,
        }}>
        <View style={[styles.row, {flex: 1, justifyContent: 'flex-start'}]}>
          {renderIndicator()}
          <NotificationAvatar
            actor={extra.actor}
            activities={activities}
            actorCount={actorCount}
            verb={verb}
            isRead={isRead}
          />
        </View>
        <NotificationContent
          description={extra?.description || ''}
          defaultContent={extra?.content || ''}
          activities={activities}
          verb={verb}
          actorCount={actorCount}
        />
      </View>

      <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
        <TimeView
          testID="notification_item.time_view"
          time={updatedAt}
          style={styles.timeCreated}
          type={'short'}
        />
        <TouchableOpacity
          testID="notificationItem.menuIcon.button"
          style={styles.icon}
          activeOpacity={0.2}
          onPress={onPressOption}
          hitSlop={{
            bottom: 20,
            left: 20,
            right: 20,
            top: 20,
          }}>
          <Icon
            icon={'menu'}
            size={15}
            tintColor={colors.textSecondary}
            testID="notificationItem.menuIcon"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stateIndicatorUnread: {
      width: 6,
      height: 6,
      borderRadius: 6,
      backgroundColor: colors.primary5,
      marginRight: spacing.margin.small,
    },
    timeCreated: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: spacing.margin.base,
    },
    icon: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default NotificationItem;
