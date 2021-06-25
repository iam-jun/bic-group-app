import {
  generateRandomUser,
  generateRandomWords,
  generateUniqueId,
  getRandomInt,
} from '~/utils/generation';
import {IUser} from '../auth/interfaces';
import {IConversation} from './interfaces';

export const messages = (conversation: IConversation) => {
  return Array.from(Array(20).keys()).map(index => ({
    ...generateMessage(conversation.members),
    quoted_message:
      index > 0 && getRandomInt(1, 4) === 1 ? generateMessage() : undefined,
  }));
};

export const generateMessage = (members?: IUser[]) => {
  return {
    _id: generateUniqueId(),
    text: generateRandomWords(),
    user: members
      ? members[getRandomInt(0, members?.length)]
      : generateRandomUser(),
    createdAt: new Date('2021-03-09T10:59:23.767Z'),
    reactions:
      getRandomInt(1, 4) === 1
        ? [
            {
              type: 'haha',
              count: getRandomInt(1, 99),
            },
            {
              type: 'love',
              count: getRandomInt(1, 99),
            },
          ]
        : [],
    attachments: [],
  };
};
