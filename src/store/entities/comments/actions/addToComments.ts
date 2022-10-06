import { cloneDeep, isArray } from 'lodash';
import { ICommentData } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';

const addToComments = (_set, get) => (payload: ICommentData[] | ICommentData) => {
  const { comments, actions }: ICommentsState = get();
  const newComments = cloneDeep(comments);
  if (isArray(payload) && payload.length > 0) {
    payload.forEach((item: ICommentData) => {
      if (item?.id) {
        newComments[item.id] = item;
      }
    });
  } else if (payload && 'id' in payload && payload.id) {
    newComments[payload.id] = payload;
  }
  actions.setComments(newComments);
};

export default addToComments;
