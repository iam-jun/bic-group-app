import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
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
import notificationSelector from '~/screens/Notification/redux/selector';
import {isEmpty, isEqual} from 'lodash';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';

const {width: screenWidth, height} = Dimensions.get('window');

export interface NotificationItemProps {
  // activities: IGetStreamNotificationActivity[];
  // verb: string;
  // isRead: boolean;
  // isSeen: boolean;
  // createdAt: string;
  // updatedAt: string;
  // extra: INotiExtraData;
  // group: string;
  // activityCount: number;
  // actorCount: number;
  onPress: (...params: any) => void;
  onPressOption: (...params: any) => void;
  testID?: string;
  id: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  // activities,
  // isRead,
  // updatedAt,
  // extra,
  // verb,
  // actorCount,
  onPress,
  onPressOption,
  testID,
  id,
}: NotificationItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {colors} = theme;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const [timerWidth, setTimerWidth] = useState(0);

  if (!id) return null;

  const itemValue = useKeySelector(
    notificationSelector.getNotificationById(id),
  );

  const _itemValue = React.useMemo(() => {
    if (
      itemValue !== undefined &&
      itemValue !== null &&
      !isEqual(JSON.stringify(itemValue), JSON.stringify(_itemValue))
    ) {
      return itemValue;
    }
  }, [itemValue, onPress, onPressOption, testID, id]);
  const {activities, isRead, updatedAt, extra, verb, actorCount}: any =
    _itemValue || {};

  if (isEmpty(_itemValue)) return null;

  const onLayout = (e: any) => {
    const width = e?.nativeEvent?.layout?.width;
    if (width) {
      setTimerWidth(width);
    }
  };

  const renderIndicator = (style?: any) => {
    if (!isRead) {
      return (
        <View
          testID="notification_item.indicator"
          style={[styles.stateIndicatorUnread, style]}
        />
      );
    }
  };

  const notShowAvatar =
    extra?.type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL ||
    extra?.type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL;

  // render notification item
  return (
    <TouchableOpacity
      testID={testID}
      disabled={!isInternetReachable || !onPress}
      onPress={() => {
        onPress && onPress(_itemValue);
      }}
      style={[
        styles.container,
        {
          backgroundColor: isRead
            ? theme.colors.background
            : theme.colors.bgSecondary,
        },
      ]}>
      {notShowAvatar ? (
        <View
          style={[
            {flexDirection: 'row', flex: 1, justifyContent: 'flex-start'},
          ]}>
          {renderIndicator(styles.indicatorMargin)}
          <NotificationContent
            description={extra?.description || ''}
            defaultContent={extra?.content || ''}
            activities={activities}
            verb={verb}
            actorCount={actorCount}
          />
        </View>
      ) : (
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
      )}

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
          onPress={(e: any) =>
            onPressOption && onPressOption({e: e, item: _itemValue})
          }
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
      width: screenWidth,
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
    indicatorMargin: {
      marginTop: spacing.margin.base,
    },
  });
};

export default React.memo(NotificationItem);
