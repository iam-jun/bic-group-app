import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const usePost = () => {
  return useSelector((state: IObject<any>) => state.post);
};

export const useCreatePost = () => {
  return useSelector((state: IObject<any>) => state.post.createPost);
};

export default usePost;
