import { isEmpty } from 'lodash';
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
