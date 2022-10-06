import { ICommentData } from '~/interfaces/IPost';

const cancelCommentFailed = (_set, _get) => (_payload: ICommentData) => {
  // console.log(
  //   '\x1b[34m🐣️ cancelCommentFailed ',
  //   `${JSON.stringify(payload, undefined, 2)}\x1b[0m`,
  // );
  // // find and remove target reply comment
  // const { localId, parentCommentId, postId } = payload;
  // const allCommentsByPost: any = { ...state.allCommentsByParentIds };
  //
  // // eslint-disable-next-line
  // const postComments = [...allCommentsByPost?.[postId]];
  //
  // if (parentCommentId) {
  //   // find parent comment
  //   const parentCommentPosition = postComments.findIndex((item: ICommentData) => item.id === parentCommentId);
  //   const child = postComments[parentCommentPosition].child || [];
  //   const targetPosition = child.findIndex((item: ICommentData) => item?.localId === localId);
  //   child.splice(
  //     targetPosition, 1,
  //   );
  // } else {
  //   const position = postComments.findIndex((item: ICommentData) => item?.localId === localId);
  //   postComments.splice(
  //     position, 1,
  //   );
  // }
  //
  // allCommentsByPost[postId] = postComments;
  // return {
  //   ...state,
  //   allCommentsByParentIds: allCommentsByPost,
  // };
};

export default cancelCommentFailed;
