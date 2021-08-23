import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import Icon from '../../Icon';
import {ITheme} from '~/theme/interfaces';
import {countTime} from '~/utils/formatData';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';

export interface NotificationItemProps {
  activities: IGetStreamNotificationActivity[];
  verb: string;
  is_read: boolean;
  is_seen: boolean;
  activity_count: number;
  actor_count: number;
  created_at: string;
  updated_at: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  activities,
  verb,
  is_seen,
  is_read,
  activity_count,
  actor_count,
  created_at,
  updated_at,
}: NotificationItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, is_seen);

  const activity = activities[0];
  const post = activity.object;
  const groupNames: string[] = [];
  activity.audience?.groups?.forEach(group => {
    if (group.data?.name) {
      groupNames.push(group.data.name);
    }
  });
  const avatar = activity.actor.data?.avatar || activity.actor.data?.avatarUrl;

  return (
    <View style={styles.container}>
      <Avatar.Large source={avatar} />

      <View style={styles.content}>
        <Text.BodyM style={styles.title}>
          {activity.actor.data?.fullname}
          <Text.Body style={styles.title}>
            {` ${activity.verb} your post in`}
            <Text.BodyM>{groupNames.join(',')}</Text.BodyM>
          </Text.Body>
        </Text.BodyM>

        {post.data?.content ? (
          <Text.Subtitle
            style={
              styles.subContent
            }>{`"${post.data?.content}"`}</Text.Subtitle>
        ) : null}
      </View>
      <Text.Subtitle style={styles.timeCreated}>
        {countTime(`${updated_at}`)}
      </Text.Subtitle>
      <Icon style={styles.iconOptions} icon="EllipsisH" size={16} />
    </View>
  );
};

const createStyles = (theme: ITheme, isSeen: boolean) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isSeen ? colors.background : colors.primary2,
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.base,
      borderRadius: 6,
    },
    content: {
      marginStart: spacing?.margin.base,
      flex: 1,
    },
    title: {
      marginEnd: 34,
    },
    subContent: {
      marginTop: spacing?.margin.tiny,
      color: colors.textSecondary,
    },
    iconOptions: {
      position: 'absolute',
      top: spacing?.margin.extraLarge,
      right: spacing?.margin.base,
      zIndex: 99,
    },
    timeCreated: {
      position: 'absolute',
      top: spacing?.margin.small,
      right: spacing?.margin.base,
      color: colors.textSecondary,
      zIndex: 99,
    },
  });
};

export default NotificationItem;
