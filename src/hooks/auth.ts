import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAuth = () => {
  const auth = useSelector((state: IObject<any>) => state.auth);
  return auth;
};

export default useAuth;
