import React from 'react';
import { StyleSheet, View } from 'react-native';
import Avatar from '~/baseComponents/Avatar';
import { spacing } from '~/theme';
import dimension from '~/theme/dimension';

interface Props {
  actors: any[];
  actorCount: number;
}

const AVATAR_WIDTH = 32;
const BUTTON_MORE_WIDTH = 28;
const LIST_AVATAR_WIDTH = dimension.deviceWidth - (spacing.padding.large * 2)
  - BUTTON_MORE_WIDTH - spacing.margin.small;
const MAX_AVATAR = Math.floor(LIST_AVATAR_WIDTH / (AVATAR_WIDTH + 2));

// render avatar group or single avatar
const NotificationAvatar = ({
  actors = [],
  actorCount,
}: Props) => {
  if (!actors?.length) return null;

  const rightActorCount = actorCount >= actors.length ? actorCount : actors.length;

  let currentListAvatarWidth = 0;
  const listAvatar = actors.map((
    item: any, index: number,
  ) => {
    if (index < MAX_AVATAR && currentListAvatarWidth < LIST_AVATAR_WIDTH) {
      currentListAvatarWidth = (index + 1) * (AVATAR_WIDTH + 2);
      if (
        (index < (rightActorCount - 1)
        && LIST_AVATAR_WIDTH - currentListAvatarWidth >= (AVATAR_WIDTH + 2))
         || (index === (rightActorCount - 1)
        && LIST_AVATAR_WIDTH - currentListAvatarWidth >= 0)
      ) {
        return (
          <View key={item?.id} style={styles.item}>
            <Avatar.Small
              source={item?.avatar}
              isRounded
            />
          </View>
        );
      }
      return (
        <View key={item?.id} style={styles.item}>
          <Avatar.Small
            source={item?.avatar}
            isRounded
            counter={rightActorCount - index}
          />
        </View>
      );
    }
    return null;
  });
  return <View testID="notification.avatars" style={styles.container}>{listAvatar}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    marginRight: 2,
  },
});

export default NotificationAvatar;
