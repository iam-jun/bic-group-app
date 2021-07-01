import {timeOut} from '~/utils/common';
import {
  generateRandomWords,
  generateUniqueId,
  getRandomInt,
  generateRandomUser,
} from '~/utils/generator';

export const getData = async () => {
  await timeOut();
  const max = getRandomInt(1, 2) === 1 ? 10 : getRandomInt(3, 7);
  return Array.from(Array(max).keys()).map(index => ({
    id: generateUniqueId(),
    content: generateRandomWords(),
    createdAt: '2021-03-09T11:14:44.579Z',
    updateAt: '2021-03-09T11:14:44.579Z',
    user: generateRandomUser(),
    replyCount: 0,
  }));
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
