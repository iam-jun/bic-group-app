import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useModal = () => {
  const modal = useSelector((state: IObject<any>) => state.modal);
  return modal;
};

export default useModal;
