import {IReaction} from '~/interfaces/IPost';

export const sortComments = (comments: IReaction[]) => {
  let newComments: any = comments || [];
  comments?.map?.((cmt: IReaction) => {
    if (cmt?.latest_children?.comment) {
      cmt.latest_children.comment = cmt.latest_children?.comment?.sort?.(
        (c1: IReaction, c2: IReaction) =>
          c1?.created_at && c2?.created_at && c1?.created_at > c2?.created_at,
      );
    }
  });
  newComments = newComments?.sort?.(
    (c1: IReaction, c2: IReaction) =>
      c1?.created_at && c2?.created_at && c1?.created_at > c2?.created_at,
  );
  return newComments;
};
