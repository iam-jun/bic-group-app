import _, {parseInt} from 'lodash';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import {useUserIdAuth} from '~/hooks/auth';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import {ITheme} from '~/theme/interfaces';

interface Props {
  activities: IGetStreamNotificationActivity[];
  actor: any;
  actorCount: number;
  verb: string;
  isRead: boolean;
}

const AVATAR_WIDTH = 32;
const MAX_AVATAR = 7;

// render avatar group or single avatar
const NotificationAvatar = ({
  actor,
  activities,
  verb,
  isRead,
  actorCount,
}: Props) => {
  const userId = useUserIdAuth();
  const theme = useTheme() as ITheme;
  const {dimension} = theme;
  const styles = createStyles(theme);

  const handleActorNotification = () => {
    switch (verb) {
      case 'REACT':
        // Reply to your child comment
        if (activities[0]?.comment?.child?.reaction) {
          const _listNoti = _.uniqBy(
            activities.map(item => ({
              ...item.comment?.child?.reaction?.actor,
            })),
            'username',
          );
          return _listNoti.filter(item => item?.id !== parseInt(userId));
        }
        // Reaction to your comment
        if (activities[0]?.comment?.reaction) {
          const _listNoti1 = _.uniqBy(
            activities.map(item => ({
              ...item.comment?.reaction?.actor,
            })),
            'username',
          );
          return _listNoti1.filter(item => item?.id !== parseInt(userId));
        }
        // Reaction to your Post
        // eslint-disable-next-line no-case-declarations
        const _listNoti2 = _.uniqBy(
          activities.map(item => ({
            ...item.reaction?.actor,
          })),
          'username',
        );
        return _listNoti2.filter(item => item?.id !== parseInt(userId));
      case 'COMMENT':
        // Mention to your comments
        if (
          activities[0]?.comment?.mentions &&
          activities[0]?.comment?.mentions?.length > 0
        ) {
          const _listNoti = _.uniqBy(
            activities[0]?.comment?.mentions.map((item: any) => ({
              ...item?.actor,
            })),
            'username',
          );
          return _listNoti.filter(item => item?.id !== parseInt(userId));
        }
        // Mention to your reply comments
        if (
          activities[0]?.comment?.child?.mentions &&
          activities[0]?.comment?.child.mentions?.length > 0
        ) {
          const _listNoti = _.uniqBy(
            activities[0]?.comment?.child?.mentions.map((item: any) => ({
              ...item.actor,
            })),
            'username',
          );
          return _listNoti.filter(item => item?.id !== parseInt(userId));
        }
        // Reply to your comments
        if (activities[0]?.comment?.child) {
          const _listNoti = _.uniqBy(
            activities.map(item => ({
              ...item.comment?.child?.actor,
            })),
            'username',
          );
          return _listNoti.filter(item => item?.id !== parseInt(userId));
        }
        // Comments to your post
        // eslint-disable-next-line no-case-declarations
        const _listNoti3 = _.uniqBy(
          activities.map(item => ({
            ...item.comment?.actor,
          })),
          'username',
        );
        return _listNoti3.filter(item => item?.id !== parseInt(userId));

      case 'POST':
        // Mention to your post
        if (activities[0]?.mentions && activities[0].mentions?.length > 0) {
          const _listNoti = _.uniqBy(
            activities[0].mentions.map((item: any) => ({
              ...item.actor,
            })),
            'username',
          );
          return _listNoti.filter(item => item?.id !== parseInt(userId));
        }
        return [actor];
      default:
        return [actor];
    }
  };

  const listAvatarWidth =
    dimension.deviceWidth - 16 * 2 - 40 - (isRead ? 0 : 16);

  const listActor = handleActorNotification();

  let _listAvatarWidth = 0;
  const listAvatar = listActor?.map?.((item: any, index: number) => {
    if (index < MAX_AVATAR && _listAvatarWidth <= listAvatarWidth) {
      _listAvatarWidth = (index + 1) * (AVATAR_WIDTH + 8);
      if (index < MAX_AVATAR - 1) {
        return (
          <View key={item?.id} style={styles.item}>
            <Avatar.SmallAlt
              testI="notification_avatar.single"
              source={item?.avatar}
              isRounded
            />
          </View>
        );
      }
      return (
        <View key={item?.id} style={styles.item}>
          <Avatar.SmallAlt
            testI="notification_avatar.single"
            source={item?.avatar}
            isRounded
            counter={actorCount - index - 1}
          />
        </View>
      );
    } else return null;
  });
  return <View style={styles.container}>{listAvatar}</View>;
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    item: {
      marginRight: spacing.margin.small,
    },
  });
};

export default NotificationAvatar;
