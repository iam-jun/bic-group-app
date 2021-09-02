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
import {default as reactionsIcons} from '~/constants/reactions';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';

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

const COMMENT_TARGET = {
  POST: 'post',
  COMMENT: 'comment',
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
    try {
      if (act.notificationType !== undefined) {
        switch (act.notificationType) {
          // noti type 18, 8, 22, 17
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_YOUR_COMMENT:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_REPLIED:
            return renderReplyToCommentNotiContent(act);

          // noti type 7, 19, 20, 21
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_YOUR_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_A_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED:
            return renderCommentToPostNotiContent(act);

          // noti type 9
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_POST:
            return renderReactionToPostNotiContent(act);

          // noti type 10
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_COMMENT:
            return renderReactionToCommentNotiContent(act);

          // noti type 16
          case NOTIFICATION_TYPE.MENTION_YOU_IN_COMMENT:
            return renderMentionYouInCommentNotiContent(act);

          // noti type 7
          case NOTIFICATION_TYPE.MENTION:
            return renderPostNotiContent(act);

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
    } catch (error) {
      console.log(
        '\x1b[33m',
        '--- render notification item error ---',
        error,
        '\x1b[0m',
      );
      console.log('\x1b[33m', '--- notification detail ---', act, '\x1b[0m');
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
    let realActivityObject;
    let verbText = '';
    // create verb text depends on verb of notification
    // and get real activity object, because with "mention"
    // real post activity is set to object property like reaction noti type
    switch (act.verb) {
      case VERB.MENTION:
        realActivityObject = act.object;
        verbText = i18n.t('notification:mentioned_you_in_a_post');
        break;
      case VERB.POST:
      default:
        realActivityObject = act;
        verbText = i18n.t('notification:created_a_post');
        break;
    }
    const actorName = realActivityObject.actor.data?.fullname || 'Someone';

    // create group text (group name or group count)
    let groupText;
    if (realActivityObject.audience?.groups?.length === 1) {
      const groupName =
        realActivityObject.audience.groups[0].data?.name || 'a group';
      groupText = i18n
        .t('notification:in_group')
        .replace('{group_name}', groupName);
    } else if (realActivityObject.audience?.groups?.length > 1) {
      groupText = i18n
        .t('notification:in_n_groups')
        .replace(
          '{group_count}',
          realActivityObject.audience.groups.length.toString(),
        );
    }

    // get noti body from post content then process it
    let body = realActivityObject.object.data.content || null;
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
      case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_REPLIED:
        verbText = i18n.t('notification:replied_to_comment_you_replied');
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

  // render content for noti type 7, 19, 20, 21
  const renderCommentToPostNotiContent = (
    act: IGetStreamNotificationActivity,
  ) => {
    const actorName = act.actor.data?.fullname || 'Someone';
    let verbText = '';
    switch (act.notificationType) {
      case NOTIFICATION_TYPE.NEW_COMMENT_TO_YOUR_POST:
        verbText = i18n.t('notification:commented_on_your_post');
        break;
      case NOTIFICATION_TYPE.NEW_COMMENT_TO_A_POST:
        verbText = i18n.t('notification:also_commented_on_a_post');
        break;
      case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED:
      case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT:
        verbText = i18n.t('notification:commented_on_a_post_you_are_mentioned');
        break;
      default:
        break;
    }

    let body = act.reaction.data?.content || null;
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

  // render verb text and icon for noti type 9, 10
  const getReactVerb = (react: string, target: string) => {
    let targetText;
    switch (target) {
      case COMMENT_TARGET.COMMENT:
        targetText = i18n.t('notification:to_your_comment');
        break;
      case COMMENT_TARGET.POST:
      default:
        targetText = i18n.t('notification:to_your_post');
        break;
    }

    return (
      <React.Fragment>
        {i18n.t('reacted') + ' '}
        {reactionsIcons[react] !== undefined && (
          <Icon
            icon={reactionsIcons[react].icon}
            iconStyle={styles.reactIcon}
          />
        )}
        {' ' + targetText}
      </React.Fragment>
    );
  };

  // render content for noti type 9
  const renderReactionToPostNotiContent = (
    act: IGetStreamNotificationActivity,
  ) => {
    const actorName = act.actor.data?.fullname || 'Someone';
    const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.POST);
    let body = act.object?.object?.data.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, reactionVerb)}
        {body && renderNotiBody(body)}
      </View>
    );
  };

  // render content for noti type 10
  const renderReactionToCommentNotiContent = (
    act: IGetStreamNotificationActivity,
  ) => {
    const actorName = act.actor.data?.fullname || 'Someone';
    const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.COMMENT);
    let body = act.parent_reaction?.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, reactionVerb)}
        {renderNotiBody(body)}
      </View>
    );
  };

  // render noti content for type 16, 17
  const renderMentionYouInCommentNotiContent = (
    act: IGetStreamNotificationActivity,
  ) => {
    const actorName = act.actor.data?.fullname || 'Someone';
    const verbText = i18n.t('notification:mentioned_you_in_a_comment');
    let body =
      act.parent_reaction?.data?.content || act.reaction.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, verbText)}
        {renderNotiBody(body)}
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
    reactIcon: {
      transform: [{translateY: 4}],
    },
  });
};

// process a text, strip markdown, cut the text off
const processNotiBody = (text: string) => {
  text = text.trim();
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
