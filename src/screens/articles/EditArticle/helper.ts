import { IPostAudience } from '~/interfaces/IPost';

export const getAudienceIdsFromAudienceObject = (audience: IPostAudience) => {
  const { groups = [], users = [] } = audience || {};
  const groupIds = groups.map((group) => group.id);
  const userIds = users.map((user) => user.id);
  return { groupIds, userIds };
};
