import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const usePost = () => {
  const posts = useSelector((state: IObject<any>) => state.post);
  return posts;
};

export default usePost;
