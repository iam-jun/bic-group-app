import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
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
import {useKeySelector} from '~/hooks/selector';

export interface NotificationItemProps {
  activities: IGetStreamNotificationActivity[];
  verb: string;
  isRead: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
  extra: INotiExtraData;
  group: string;
  activityCount: number;
  actorCount: number;
  onPress: (...params: any) => void;
  onPressOption: (...params: any) => void;
  testID?: string;
  id?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  activities,
  isRead,
  updatedAt,
  extra,
  verb,
  actorCount,
  onPress,
  onPressOption,
  testID,
}: NotificationItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {colors} = theme;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const [timerWidth, setTimerWidth] = useState(0);

  const onLayout = (e: any) => {
    const width = e?.nativeEvent?.layout?.width;
    if (width) {
      setTimerWidth(width);
    }
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
    <TouchableOpacity
      testID={testID}
      disabled={!isInternetReachable || !onPress}
      onPress={onPress}
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
            timerWidth={timerWidth}
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

      <View
        onLayout={onLayout}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
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
          onPress={(e: any) => onPressOption && onPressOption(e)}
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
    </TouchableOpacity>
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
