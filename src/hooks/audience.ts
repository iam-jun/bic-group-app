import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useAudience = () => {
  const audiences = useSelector((state: IObject<any>) => state.audience);
  return audiences;
};

export default useAudience;
