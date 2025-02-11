import { isEmpty, isPlainObject } from 'lodash';
import { IPostAudience } from '~/interfaces/IPost';
import { parseSafe } from '~/utils/common';

export const getAudienceIdsFromAudienceObject = (audience: IPostAudience) => {
  const { groups = [], users = [] } = audience || {};
  const groupIds = groups.map((group) => group.id);
  const userIds = users.map((user) => user.id);
  return { groupIds, userIds };
};

export const isEmptyContent = (content: string | null) => {
  if (isEmpty(content)) return true;

  const contentArr = parseSafe(content);

  return (
    !isEmpty(contentArr)
    && contentArr.length === 1
    && contentArr[0].type === 'p'
    && contentArr[0].children.length === 1
    && contentArr[0].children[0].text === ''
  );
};

export const countWords = (str: string) => {
  str = str.trim();

  if (str === '') return 0;

  const words = str.split(/\s+/);

  return words.length;
};

export const getTextFromContent = (node: any) => {
  if (!node) return '';

  if (isText(node)) {
    return node?.text;
  }
  return node?.children?.map((item) => getTextFromContent(item)).join(' ');
};

export const isText = (value: any) => isPlainObject(value) && typeof value?.text === 'string';

export const countWordsFromContent = (content: any) => {
  const contentParse = content ? JSON.parse(content) : [];
  const textContent = getTextFromContent({
    type: 'content',
    children: contentParse,
  });

  return countWords(textContent);
};
