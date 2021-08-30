import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import Icon from '../../Icon';
import {ITheme} from '~/theme/interfaces';
import {countTime} from '~/utils/formatData';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import i18n from '~/localization';

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

const VERB = {
  POST: 'post',
  MENTION: 'mention',
};

const MENTION_USER_REG = /@\[u:(\d+):(\S.*?)\]/gm;

const NOTIFICATION_TYPE = {
  // CREATE_POST: 1,
  // MENTION: 4,
  NEW_COMMENT_TO_YOUR_POST: 7,
  NEW_REPLY_TO_YOUR_COMMENT: 8,
  NEW_REACTION_TO_YOUR_POST: 9,
  NEW_REACTION_TO_YOUR_COMMENT: 10,
  // CREATE_POST_IN_SINGLE_GROUP: 11,
  // CREATE_POST_IN_MULTI_GROUP: 12,
  // MENTION_IN_SINGLE_GROUP: 13,
  // MENTION_IN_MULTI_GROUP: 14,
  // ADD_COMMENT_TO_POST_NOTICE_AUDIENCE_USER: 15,
  MENTION_YOU_IN_COMMENT: 16,
  NEW_REPLY_TO_COMMENT_YOU_REPLIED: 17,
  NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED: 18,
  NEW_COMMENT_TO_A_POST: 19,
  NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT: 20,
  NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED: 21,
  NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY: 22,
};

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
  const styles = createStyles(theme, is_read);

  const activity = activities[0];
  const avatar = activity.actor.data?.avatar || activity.actor.data?.avatarUrl;

  // this function is used to determine type of each notification
  // then render them with defference content corresponding their type
  const renderNotiContent = (act: IGetStreamNotificationActivity) => {
    // for notification has a type
    if (act.notificationType !== undefined) {
      switch (act.notificationType) {
        // noti type 18, 8, 22
        case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
        case NOTIFICATION_TYPE.NEW_REPLY_TO_YOUR_COMMENT:
        case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
          return renderReplyToCommentNotiContent(act);
        default:
          console.log(
            `Notification type ${act.notificationType} have not implemented yet`,
          );
          return null;
      }
    } else {
      // default, render it as "create post" or "mention" notification
      return renderPostNotiContent(act);
    }
  };

  // render notification title, include:
  // - actor name,
  // - verb + object
  // - group name or group count for few notification type
  const renderNotiTitle = (
    actorName: any,
    verbText: any,
    groupText: any = null,
  ) => {
    return (
      <Text.BodyM style={styles.title}>
        {actorName + ' '}
        <Text.Body>
          {verbText}
          {groupText && <Text.BodyM>{' ' + groupText}</Text.BodyM>}
        </Text.Body>
      </Text.BodyM>
    );
  };

  // render notification body, it can be post content, comment content
  const renderNotiBody = (body: any) => {
    return <Text.Subtitle style={styles.subContent}>{body}</Text.Subtitle>;
  };

  // render content of default notification type
  // such as: create a post, mention a user
  const renderPostNotiContent = (act: IGetStreamNotificationActivity) => {
    const actorName = act.actor.data?.fullname || 'Someone';

    // create verb text depends on verb of notification
    let verbText = '';
    switch (act.verb) {
      case VERB.MENTION:
        verbText = i18n.t('notification:mentioned_you_in_a_post');
        break;
      case VERB.POST:
      default:
        verbText = i18n.t('notification:created_a_post');
        break;
    }

    // create group text (group name or group count)
    let groupText;
    if (act.audience?.groups?.length === 1) {
      const groupName = act.audience.groups[0].data?.name || 'a group';
      groupText = i18n
        .t('notification:in_group')
        .replace('{group_name}', groupName);
    } else if (act.audience?.groups?.length > 1) {
      groupText = i18n
        .t('notification:in_n_groups')
        .replace('{group_count}', act.audience.groups.length.toString());
    }

    // get noti body from post content then process it
    let body = act.object.data.content || null;
    if (body) {
      body = processNotiBody(body);
    }

    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, verbText, groupText)}
        {body && renderNotiBody(body)}
      </View>
    );
  };

  // render notification for type 8, 18, 22
  const renderReplyToCommentNotiContent = (
    act: IGetStreamNotificationActivity,
  ) => {
    const actorName = act.actor.data?.fullname || 'Someone';
    let verbText = '';
    switch (act.notificationType) {
      case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
      case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
        verbText = i18n.t(
          'notification:replied_to_a_comment_you_are_mentioned',
        );
        break;
      case NOTIFICATION_TYPE.NEW_REPLY_TO_YOUR_COMMENT:
        verbText = i18n.t('notification:replied_to_your_comment');
        break;
      default:
        break;
    }

    let body = activity.reaction.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }

    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, verbText)}
        {body && renderNotiBody(body)}
      </View>
    );
  };

  // render notification item
  return (
    <View style={styles.container}>
      <Avatar.Large source={avatar} />
      {renderNotiContent(activity)}
      <Text.Subtitle style={styles.timeCreated}>
        {countTime(`${updated_at}`)}
      </Text.Subtitle>
      <Icon style={styles.iconOptions} icon="EllipsisH" size={16} />
    </View>
  );
};

const createStyles = (theme: ITheme, isRead: boolean) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isRead ? colors.background : colors.primary2,
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.base,
      borderRadius: 6,
    },
    content: {
      marginStart: spacing?.margin.base,
      flex: 1,
    },
    title: {
      marginEnd: 30,
      alignItems: 'baseline',
    },
    subContent: {
      marginTop: spacing?.margin.tiny,
      color: colors.textSecondary,
      marginEnd: 30,
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

// process a text, strip markdown, cut the text off
const processNotiBody = (text: string) => {
  text = escapeMarkDown(text);
  text = sliceText(text);
  return text;
};

// get first line of text for noti body, if this line has more than 20 chars
// cut it off
const sliceText = (text: string, maxChars = 20) => {
  const firstLine = text.split('\n')[0];
  const firstLineCharacters = firstLine.split(' ');
  if (firstLineCharacters.length > maxChars) {
    return firstLineCharacters.splice(0, maxChars).join(' ') + '...';
  } else {
    return firstLine;
  }
};

// change mention markdown to mentioned name
// for future, handle other markdown here
const escapeMarkDown = (text: string) => {
  let match;
  while ((match = MENTION_USER_REG.exec(text))) {
    text = text.replace(match[0], match[2]);
    MENTION_USER_REG.lastIndex = 0;
  }
  return text;
};

export default NotificationItem;
