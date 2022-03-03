import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import i18n from 'i18next';
import NodeEmoji from 'node-emoji';
import {NotificationTitleProps} from './NotificationContent/NotificationTitle';
import {COMMENT_TARGET, VERB} from './constants';

// count, get actorNames text and get action times if all actions belong to only one actor
export const getCombinedInfo = (
  activities: IGetStreamNotificationActivity[],
  verbText = '',
): NotificationTitleProps => {
  const combinedInfo = {
    actorNames: '',
    verbText: verbText,
  };
  const actorIds: any[] = [];
  activities.forEach(act => {
    if (!actorIds.includes(act.actor.id)) {
      actorIds.push(act.actor.id);
    }
  });
  if (actorIds.length > 1) {
    combinedInfo.actorNames = i18n
      .t('notification:number_people')
      .replace('{number}', actorIds.length.toString());
  } else {
    combinedInfo.actorNames = activities[0].actor.data?.fullname || '';
    if (activities.length > 1 && verbText !== '') {
      combinedInfo.verbText =
        verbText +
        ' ' +
        i18n
          .t('notification:number_times')
          .replace('{number}', activities.length.toString());
    }
  }

  return combinedInfo;
};

/**
 * Get first line of text for noti body,
 * if this line has more than 20 chars cut it off.
 * e.g: ('1234 5678 \n9', 3) => '123
 *
 * @param text string
 * @param maxChars number
 *
 * @returns string
 */
export const sliceText = (text: string, maxChars = 20) => {
  const firstLine = text.split('\n')[0];
  // const firstLineCharacters = firstLine.split(' ');
  // console.log('[DEBUG] firstLineCharacters', firstLineCharacters);

  if (firstLine.length > maxChars) {
    return firstLine.substring(0, maxChars) + '...';
  } else {
    return firstLine;
  }
};

// process a text, strip markdown, cut the text off
export const processNotiBody = (text: string) => {
  text = text.trim();
  text = sliceText(text);
  return text;
};

// render verb text and icon for noti type 9, 10
export const getReactVerb = (react: string, target: string) => {
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
  return {
    emoji,
    targetText,
  };
};

// render notification for type 8, 18, 22
// these types may be combined by Aggregation
export const getReplyToCommentNotiContent = (
  activities: IGetStreamNotificationActivity[],
) => {
  const act = activities[0];
  let verbText = '';
  switch (act.notification_type) {
    case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED:
    case NOTIFICATION_TYPE.NEW_REPLY_TO_COMMENT_YOU_ARE_MENTIONED_IN_ITS_REPLY:
      verbText = i18n.t('notification:replied_to_a_comment_you_are_mentioned');
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
  let body = act.reaction?.data?.content || null;
  if (body) {
    body = processNotiBody(body);
  }

  return {
    title: combinedInfo,
    body,
  };
};

// render content for noti type 7, 19, 20, 21
// these types may be combined by Aggregation
export const getCommentToPostNotiContent = (
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
  let body = act.reaction?.data?.content || null;
  if (body) {
    body = processNotiBody(body);
  }
  return {
    title: combinedInfo,
    body,
  };
};

// render content for noti type 9
// this type may be combined by Aggregation by actors
// there isn't case that one actor react 1 emoji many times
export const getReactionToPostNotiContent = (
  activities: IGetStreamNotificationActivity[],
) => {
  const act = activities[0];
  const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.POST);
  const combinedInfo = getCombinedInfo(activities);
  let body = act.object?.object?.data.content || null;
  if (body) {
    body = processNotiBody(body);
  }

  return {
    title: {
      ...combinedInfo,
      verbText: reactionVerb,
    },
    body,
  };
};

// render content for noti type 10
// this type may be combined by Aggregation by actors
// there isn't case that one actor react 1 emoji many times
export const getReactionToCommentNotiContent = (
  activities: IGetStreamNotificationActivity[],
) => {
  const act = activities[0];
  const combinedInfo = getCombinedInfo(activities);
  const reactionVerb = getReactVerb(act.verb, COMMENT_TARGET.COMMENT);
  let body = act.parent_reaction?.data?.content || null;
  if (body) {
    body = processNotiBody(body);
  }
  return {
    title: {
      ...combinedInfo,
      verbText: reactionVerb,
    },
    body,
  };
};

// render noti content for type 16, 17
// this type may be combined by Aggregation
export const getMentionYouInCommentNotiContent = (
  activities: IGetStreamNotificationActivity[],
) => {
  const act = activities[0];
  const verbText = i18n.t('notification:mentioned_you_in_a_comment');
  const combinedInfo = getCombinedInfo(activities, verbText);
  let body =
    act.parent_reaction?.data?.content || act.reaction?.data?.content || null;
  if (body) {
    body = processNotiBody(body);
  }
  return {
    title: {
      ...combinedInfo,
      verbText,
    },
    body,
  };
};

// render content of default notification type
// such as: create a post, mention a user
// these types won't be combined by Aggregation, so we can pass an action object
export const getPostNotiContent = (act: IGetStreamNotificationActivity) => {
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
  const actorNames =
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

  return {
    title: {
      actorNames,
      verbText,
      groupText,
    },
    body,
  };
};

export const getNotificationContent = (
  activities: IGetStreamNotificationActivity[],
) => {
  if (activities.length === 0) {
    return null;
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
          return getReplyToCommentNotiContent(activities);

        // noti type 7, 19, 20, 21
        case NOTIFICATION_TYPE.NEW_COMMENT_TO_YOUR_POST:
        case NOTIFICATION_TYPE.NEW_COMMENT_TO_A_POST:
        case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED_IN_COMMENT:
        case NOTIFICATION_TYPE.NEW_COMMENT_TO_POST_YOU_ARE_MENTIONED:
          return getCommentToPostNotiContent(activities);

        // noti type 9
        case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_POST:
          return getReactionToPostNotiContent(activities);

        // noti type 10
        case NOTIFICATION_TYPE.NEW_REACTION_TO_YOUR_COMMENT:
          return getReactionToCommentNotiContent(activities);

        // noti type 16
        case NOTIFICATION_TYPE.MENTION_YOU_IN_COMMENT:
          return getMentionYouInCommentNotiContent(activities);

        // noti type 7,
        // these types won't be combined by Aggregation, so we can pass an action object
        case NOTIFICATION_TYPE.MENTION:
          return getPostNotiContent(act);

        default:
          throw new Error(
            `Notification type ${act.notification_type} have not implemented yet`,
          );
      }
    } else {
      // default, render it as "create post" or "mention" notification
      // these types won't be combined by Aggregation, so we can pass an action object
      return getPostNotiContent(act);
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
  return null;
};
