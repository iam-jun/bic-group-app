import {timeOut} from '~/utils/common';
import {
  generateRandomUser,
  generateRandomWords,
  generateUniqueId,
  getRandomInt,
} from '~/utils/generator';

export const getData = async () => {
  await timeOut();
  return Array.from(Array(20).keys()).map(index => ({
    ...generateMessage(),
    quoted_message:
      index > 0 && getRandomInt(1, 4) === 1 ? generateMessage() : undefined,
  }));
};

const generateMessage = () => {
  const uid = generateUniqueId();
  return {
    _id: uid,
    id: uid,
    text: generateRandomWords(),
    user: generateRandomUser(),
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

export const createItem = async () => {
  await timeOut();
  return {};
};

export const updateItem = async () => {
  await timeOut();
  return {};
};

export const deleteItem = async () => {
  await timeOut();
  return true;
};
