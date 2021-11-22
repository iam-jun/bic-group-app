import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useNoInternet = () => {
  const noInternet = useSelector((state: IObject<any>) => state.noInternet);
  console.log(`noInternet`, noInternet);

  return noInternet;
};

export default useNoInternet;
