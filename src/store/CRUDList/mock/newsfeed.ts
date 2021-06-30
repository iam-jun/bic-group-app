import {timeOut} from '~/utils/common';
import {
  generateRandomUser,
  generateUniqueId,
  getRandomInt,
  generateRandomWords,
} from '~/utils/generation';

export const getData = async () => {
  await timeOut();
  const max = getRandomInt(1, 2) === 1 ? 10 : getRandomInt(3, 7);
  return Array.from(Array(max).keys()).map(index => ({
    id: generateUniqueId(),
    coverUrl: 'https://placeimg.com/300/200/any',
    content: generateRandomWords(),
    privacy: 'public',
    hashtags: Array.from(Array(getRandomInt(0, 5)).keys()).map(() =>
      generateRandomWords(1, 4),
    ),
    price: '0',
    status: 'public',
    createdAt: '2021-03-09T10:59:23.767Z',
    updatedAt: '2021-03-09T10:59:23.767Z',
    user: generateRandomUser(),
    isLike: true,
    likeCount: getRandomInt(1, 99),
    commentCount: 0,
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
