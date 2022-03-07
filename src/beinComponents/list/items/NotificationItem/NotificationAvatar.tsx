import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import {ITheme} from '~/theme/interfaces';

interface Props {
  activities: IGetStreamNotificationActivity[];
}

// render avatar group or single avatar
const NotificationAvatar = ({activities}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const actorIds: any[] = [];
  const actorAvatars: any[] = [];
  activities.forEach(act => {
    if (!actorIds.includes(act.actor.id)) {
      actorIds.push(act.actor.id);
      actorAvatars.push(act.actor.data?.avatar);
    }
  });

  let avatar = null;

  if (actorAvatars.length > 1) {
    avatar = (
      <Avatar.Group
        testI="notification_avatar.group"
        variant={'large'}
        source={actorAvatars}
        totalMember={actorIds.length - 3} // used when numers of avatars >= 5
      />
    );
  } else {
    avatar = (
      <Avatar.Large
        testI="notification_avatar.single"
        source={actorAvatars[0]}
      />
    );
  }

  return <View style={styles.container}>{avatar}</View>;
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.small,
    },
  });
};

export default NotificationAvatar;
