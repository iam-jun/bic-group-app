import {MENTION_USER_REG} from '~/constants/commonRegex';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import i18n from '~/localization';
import NodeEmoji from 'node-emoji';
const VERB = {
  POST: 'post',
  MENTION: 'mention',
};

const COMMENT_TARGET = {
  POST: 'post',
  COMMENT: 'comment',
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

// count, get actorName text and get action times if all actions belong to only one actor
const getCombinedInfo = (
  activities: IGetStreamNotificationActivity[],
  verbText = '',
) => {
  const combinedInfo: {actorNames: string | undefined; verbText: string} = {
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
    combinedInfo.actorNames = activities[0].actor.data?.fullname;
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

// process a text, strip markdown, cut the text off
const processNotiBody = (text: string) => {
  text = text.trim();
  text = escapeMarkDown(text);
  text = sliceText(text);
  return text;
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
  return {
    emoji,
    targetText,
  };
};

// render notification for type 8, 18, 22
// these types may be combined by Aggregation
const getReplyToCommentNotiContent = (
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
  let body = act.reaction.data?.content || null;
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
const getCommentToPostNotiContent = (
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
  return {
    title: combinedInfo,
    body,
  };
};

// render content for noti type 9
// this type may be combined by Aggregation by actors
// there isn't case that one actor react 1 emoji many times
const getReactionToPostNotiContent = (
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
const getReactionToCommentNotiContent = (
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
const getMentionYouInCommentNotiContent = (
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
const getPostNotiContent = (act: IGetStreamNotificationActivity) => {
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

  return {
    title: {
      actorName,
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
