import React, { useMemo } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Dimensions,
} from 'react-native';
import { isEmpty, isEqual } from 'lodash';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';

import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';
import { useKeySelector } from '~/hooks/selector';
import notificationSelector from '~/storeRedux/notification/selector';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import spacing from '~/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

const NOT_SHOW_AVATAR_LIST = [
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL,
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL,
  NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP,
  NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER,
  NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER,
  NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED,
  NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER,
  NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_MULTIPLE_GROUPS,
];

export interface NotificationItemProps {
  onPress: (...params: any) => void;
  onPressOption: (...params: any) => void;
  testID?: string;
  id: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  onPress,
  onPressOption,
  testID,
  id,
}: NotificationItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

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

  const showAvatar = useMemo(() => {
    if (!extra?.type) return false;
    const isNotShowAvatar = NOT_SHOW_AVATAR_LIST.findIndex((item) => item === extra.type);
    return isNotShowAvatar === -1;
  }, [extra?.type]);

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
      {showAvatar ? (
        <View style={styles.flex1}>
          <NotificationAvatar
            actors={extra.actors}
            actorCount={actorCount}
          />
          <NotificationContent
            description={extra?.description || ''}
            content={extra?.content || ''}
            updatedAt={updatedAt}
          />
        </View>
      ) : (
        <NotificationContent
          description={extra?.description || ''}
          content={extra?.content || ''}
          updatedAt={updatedAt}
        />
      )}
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
          size={20}
          tintColor={colors.neutral40}
          testID="notificationItem.menuIcon"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.padding.large,
    width: screenWidth,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(NotificationItem);
