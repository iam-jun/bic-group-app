import * as Actions from './constants';
import {IComment} from './interfaces';

export const getComments = () => ({
  type: Actions.GET_COMMENTS,
});

export const setComments = (payload: IComment[]) => ({
  type: Actions.SET_COMMENTS,
  payload,
});

export const sendComment = (payload: IComment) => ({
  type: Actions.SEND_COMMENT,
  payload,
});
