import NodeEmoji from 'node-emoji';
import React from 'react';
import {Platform, StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import TimeView from '~/beinComponents/TimeView';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import i18n from '~/localization';
import {ITheme} from '~/theme/interfaces';
import {getCombinedInfo, processNotiBody} from '~/utils/notification';

export interface NotificationItemProps {
  activities: IGetStreamNotificationActivity[];
  verb: string;
  is_read: boolean;
  is_seen: boolean;
  activity_count: number;
  actor_count: number;
  created_at: string;
  updated_at: string;
  isActive?: boolean;
}

const VERB = {
  POST: 'post',
  MENTION: 'mention',
};

const COMMENT_TARGET = {
  POST: 'post',
  COMMENT: 'comment',
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  activities,
  is_read,
  updated_at,
  isActive = false,
}: NotificationItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const activity = activities[0];

  let className = 'notification-item';
  if (isActive) className = 'notification-item--active';

  // this function is used to determine type of each notification
  // then render them with defference content corresponding their type
  const renderNotiContent = (activities: IGetStreamNotificationActivity[]) => {
    if (activities.length === 0) {
      return;
    }

    const act = activities[0];
    // for notification has a type
    try {
      if (act.notification_type !== undefined) {
        switch (act.notification_type) {
          // noti type 18, 8, 22, 17
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_YOUR_COMMENT:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
          case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_REPLIED:
            return renderReplyToCommentNotiContent(activities);

          // noti type 7, 19, 20, 21
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_YOUR_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_A_POST:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT:
          case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED:
            return renderCommentToPostNotiContent(activities);

          // noti type 9
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_POST:
            return renderReactionToPostNotiContent(activities);

          // noti type 10
          case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_COMMENT:
            return renderReactionToCommentNotiContent(activities);

          // noti type 16
          case NOTIFICATION_TYPE.MENTION_YOU_IN_COMMENT:
            return renderMentionYouInCommentNotiContent(activities);

          // noti type 7,
          // these types won't be combined by Aggregation, so we can pass an action object
          case NOTIFICATION_TYPE.MENTION:
            return renderPostNotiContent(act);

          default:
            console.log(
              `Notification type ${act.notification_type} have not implemented yet`,
            );
            return null;
        }
      } else {
        // default, render it as "create post" or "mention" notification
        // these types won't be combined by Aggregation, so we can pass an action object
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

  const renderIndicator = () => {
    if (Platform.OS === 'web' && isActive) {
      return <View style={styles.stateIndicatorActive} />;
    } else if (!is_read) {
      return <View style={styles.stateIndicatorUnread} />;
    }
  };

  // render avatar group or single avatar
  const renderAvatar = (activities: IGetStreamNotificationActivity[]) => {
    const actorIds: any[] = [];
    const actorAvatars: any[] = [];
    activities.forEach(act => {
      if (!actorIds.includes(act.actor.id)) {
        actorIds.push(act.actor.id);
        actorAvatars.push(act.actor.data?.avatar);
      }
    });
    if (actorAvatars.length > 1) {
      return (
        <Avatar.Group
          variant={'large'}
          source={actorAvatars}
          totalMember={actorIds.length - 3} // used when numers of avatars >= 5
        />
      );
    } else {
      return <Avatar.Large source={actorAvatars[0]} />;
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
    return <Text.BodyS style={styles.subContent}>{body}</Text.BodyS>;
  };

  // render content of default notification type
  // such as: create a post, mention a user
  // these types won't be combined by Aggregation, so we can pass an action object
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
    const actorName =
      realActivityObject?.actor?.data?.fullname ||
      act?.actor?.data?.fullname ||
      'Someone';

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
    let body =
      realActivityObject?.object?.data?.content ||
      realActivityObject?.data?.content;
    if (body) {
      body = processNotiBody(body);
    }

    return (
      <View style={styles.content}>
        {renderNotiTitle(actorName, verbText, groupText)}
        {!!body && renderNotiBody(body)}
      </View>
    );
  };

  // render notification for type 8, 18, 22
  // these types may be combined by Aggregation
  const renderReplyToCommentNotiContent = (
    activities: IGetStreamNotificationActivity[],
  ) => {
    const act = activities[0];
    let verbText = '';
    switch (act.notification_type) {
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

    const combinedInfo = getCombinedInfo(activities, verbText);
    let body = activity.reaction.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }

    return (
      <View style={styles.content}>
        {renderNotiTitle(combinedInfo.actorNames, combinedInfo.verbText)}
        {!!body && renderNotiBody(body)}
      </View>
    );
  };

  // render content for noti type 7, 19, 20, 21
  // these types may be combined by Aggregation
  const renderCommentToPostNotiContent = (
    activities: IGetStreamNotificationActivity[],
  ) => {
    const act = activities[0];
    let verbText = '';
    switch (act.notification_type) {
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

    const combinedInfo = getCombinedInfo(activities, verbText);
    let body = act.reaction.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }

    return (
      <View style={styles.content}>
        {renderNotiTitle(combinedInfo.actorNames, combinedInfo.verbText)}
        {!!body && renderNotiBody(body)}
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
    const emoji = NodeEmoji.find(react || '')?.emoji || '';
    return (
      <React.Fragment>
        {i18n.t('reacted') + ' '}
        {emoji}
        {' ' + targetText}
      </React.Fragment>
    );
  };

  // render content for noti type 9
  // this type may be combined by Aggregation by actors
  // there isn't case that one actor react 1 emoji many times
  const renderReactionToPostNotiContent = (
    activities: IGetStreamNotificationActivity[],
  ) => {
    const act = activities[0];
    const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.POST);
    const combinedInfo = getCombinedInfo(activities);
    let body = act.object?.object?.data.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(combinedInfo.actorNames, reactionVerb)}
        {!!body && renderNotiBody(body)}
      </View>
    );
  };

  // render content for noti type 10
  // this type may be combined by Aggregation by actors
  // there isn't case that one actor react 1 emoji many times
  const renderReactionToCommentNotiContent = (
    activities: IGetStreamNotificationActivity[],
  ) => {
    const act = activities[0];
    const combinedInfo = getCombinedInfo(activities);
    const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.COMMENT);
    let body = act.parent_reaction?.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(combinedInfo.actorNames, reactionVerb)}
        {renderNotiBody(body)}
      </View>
    );
  };

  // render noti content for type 16, 17
  // this type may be combined by Aggregation
  const renderMentionYouInCommentNotiContent = (
    activities: IGetStreamNotificationActivity[],
  ) => {
    const act = activities[0];
    const verbText = i18n.t('notification:mentioned_you_in_a_comment');
    const combinedInfo = getCombinedInfo(activities, verbText);
    let body =
      act.parent_reaction?.data?.content || act.reaction.data?.content || null;
    if (body) {
      body = processNotiBody(body);
    }
    return (
      <View style={styles.content}>
        {renderNotiTitle(combinedInfo.actorNames, combinedInfo.verbText)}
        {renderNotiBody(body)}
      </View>
    );
  };

  // render notification item
  return (
    <Div className={className}>
      <View style={styles.container}>
        {renderIndicator()}
        <View style={styles.avatarContainer}>{renderAvatar(activities)}</View>
        <View style={styles.flex1}>{renderNotiContent(activities)}</View>
        <TimeView time={updated_at} style={styles.timeCreated} type={'short'} />
      </View>
    </Div>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  const stateIndicator = {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.primary5,
  } as ViewProps;

  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
    },
    stateIndicatorActive: {
      ...stateIndicator,
      top: 20,
      width: 4,
      height: 48,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    stateIndicatorUnread: {
      ...stateIndicator,
      top: 40,
      left: 4,
      width: 6,
      height: 6,
      borderRadius: 6,
    },
    avatarContainer: {
      marginTop: spacing.margin.small,
    },
    content: {
      marginStart: spacing?.margin.base,
      flex: 1,
    },
    title: {
      alignItems: 'baseline',
    },
    subContent: {
      color: colors.textSecondary,
    },
    iconOptions: {},
    timeCreated: {
      marginTop: 1,
      marginLeft: spacing.margin.base,
      color: colors.textSecondary,
    },
    reactIcon: {
      transform: [{translateY: 4}],
    },
  });
};

export default NotificationItem;
