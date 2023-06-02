import { IReaction } from '~/interfaces/IPost';

export const handleNewOwnReaction2 = (params: { newOwnReaction2: any, response: any }) => {
  const { newOwnReaction2, response } = params;
  if (newOwnReaction2?.length > 0) {
    let isAdded = false;
    newOwnReaction2.forEach((
      ownReaction: IReaction, index: number,
    ) => {
      if (ownReaction?.reactionName === response.data?.reactionName) {
        newOwnReaction2[index] = { ...response.data };
        isAdded = true;
      }
    });
    if (!isAdded) {
      newOwnReaction2.push(response.data);
    }
  } else {
    newOwnReaction2.push(response.data);
  }
  return newOwnReaction2;
};
