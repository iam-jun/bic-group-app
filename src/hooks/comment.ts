import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useComment = () => {
  const comments = useSelector((state: IObject<any>) => state.comment);
  return comments;
};

export default useComment;
