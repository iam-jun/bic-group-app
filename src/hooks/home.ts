import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useHome = () => {
  const homePosts = useSelector((state: IObject<any>) => state.home);
  return homePosts;
};

export default useHome;
