import React, { useMemo, useState } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Dimensions,
} from 'react-native';
import { isEmpty, isEqual } from 'lodash';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import TimeView from '~/beinComponents/TimeView';
import Icon from '~/baseComponents/Icon';

import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';
import { useKeySelector } from '~/hooks/selector';
import notificationSelector from '~/storeRedux/notification/selector';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import spacing from '~/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

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
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const [timerWidth, setTimerWidth] = useState(0);

  if (!id) return null;

  const itemValue = useKeySelector(notificationSelector.getNotificationById(id));

  const _itemValue = useMemo(
    () => {
      if (
        itemValue !== undefined
      && itemValue !== null
      && !isEqual(
        JSON.stringify(itemValue), JSON.stringify(_itemValue),
      )
      ) {
        return itemValue;
      }
    }, [itemValue, onPress, onPressOption, testID, id],
  );

  const {
    isRead, updatedAt, extra, actorCount,
  }: any = _itemValue || {};

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

  const notShowAvatar = extra?.type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL
    || extra?.type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL;

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
          backgroundColor: isRead ? theme.colors.white : theme.colors.neutral1,
        },
      ]}
    >
      {notShowAvatar ? (
        <View
          style={[
            { flexDirection: 'row', flex: 1, justifyContent: 'flex-start' },
          ]}
        >
          {renderIndicator(styles.indicatorMargin)}
          <NotificationContent
            description={extra?.description || ''}
            content={extra?.content || ''}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={[styles.row, { flex: 1, justifyContent: 'flex-start' }]}>
            {renderIndicator()}
            <NotificationAvatar
              actors={extra.actors}
              actorCount={actorCount}
              isRead={isRead}
              timerWidth={timerWidth}
            />
          </View>
          <NotificationContent
            description={extra?.description || ''}
            content={extra?.content || ''}
          />
        </View>
      )}

      <View
        onLayout={onLayout}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <TimeView
          testID="notification_item.time_view"
          time={updatedAt}
          style={styles.timeCreated}
          type="short"
        />
        <TouchableOpacity
          testID="notificationItem.menuIcon.button"
          style={styles.icon}
          activeOpacity={0.2}
          onPress={(e: any) => onPressOption && onPressOption({ e, item: _itemValue })}
          hitSlop={{
            bottom: 20,
            left: 20,
            right: 20,
            top: 20,
          }}
        >
          <Icon
            icon="menu"
            size={15}
            tintColor={colors.gray50}
            testID="notificationItem.menuIcon"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: spacing.padding.large,
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
      backgroundColor: colors.purple30,
      marginRight: spacing.margin.small,
    },
    timeCreated: {
      color: colors.gray50,
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
