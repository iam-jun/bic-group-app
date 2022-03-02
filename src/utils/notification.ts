import {MENTION_USER_REG} from '~/constants/commonRegex';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import i18n from '~/localization';

// count, get actorName text and get action times if all actions belong to only one actor
export const getCombinedInfo = (
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

// change mention markdown to mentioned name
// for future, handle other markdown here
export const escapeMarkDown = (text: string) => {
  let match;
  while ((match = MENTION_USER_REG.exec(text))) {
    text = text.replace(match[0], match[2]);
    MENTION_USER_REG.lastIndex = 0;
  }
  return text;
};

// get first line of text for noti body, if this line has more than 20 chars
// cut it off
export const sliceText = (text: string, maxChars = 20) => {
  const firstLine = text.split('\n')[0];
  const firstLineCharacters = firstLine.split(' ');
  if (firstLineCharacters.length > maxChars) {
    return firstLineCharacters.splice(0, maxChars).join(' ') + '...';
  } else {
    return firstLine;
  }
};

// process a text, strip markdown, cut the text off
export const processNotiBody = (text: string) => {
  text = text.trim();
  text = escapeMarkDown(text);
  text = sliceText(text);
  return text;
};
