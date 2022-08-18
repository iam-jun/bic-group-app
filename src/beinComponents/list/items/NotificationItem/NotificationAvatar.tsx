import React from 'react';
import { StyleSheet, View } from 'react-native';
import Avatar from '~/baseComponents/Avatar';
import dimension from '~/theme/dimension';
import spacing from '~/theme/spacing';

interface Props {
  actors: any[];
  actorCount: number;
  isRead: boolean;
  timerWidth: number;
}

const AVATAR_WIDTH = 32;
const MAX_AVATAR = 7;

// render avatar group or single avatar
const NotificationAvatar = ({
  actors = [],
  actorCount,
  isRead,
  timerWidth,
}: Props) => {
  if (!actors?.length) return null;

  const listAvatarWidth = dimension.deviceWidth - 16 * 2 - timerWidth - (isRead ? 0 : 16);
  let _listAvatarWidth = 0;
  const listAvatar = actors.map((
    item: any, index: number,
  ) => {
    if (index < MAX_AVATAR && _listAvatarWidth <= listAvatarWidth) {
      _listAvatarWidth = (index + 1) * (AVATAR_WIDTH + 8);
      if (
        index < MAX_AVATAR - 1
        && listAvatarWidth - _listAvatarWidth >= AVATAR_WIDTH + 8
      ) {
        return (
          <View key={item?.id} style={styles.item}>
            <Avatar.Small
              testI="notification_avatar.single"
              source={item?.avatar}
              isRounded
            />
          </View>
        );
      }
      return (
        <View key={item?.id} style={styles.item}>
          <Avatar.Small
            testI="notification_avatar.single"
            source={item?.avatar}
            isRounded
            counter={actorCount - index - 1}
          />
        </View>
      );
    } return null;
  });
  return <View style={styles.container}>{listAvatar}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    marginRight: spacing.margin.small,
  },
});

export default NotificationAvatar;
