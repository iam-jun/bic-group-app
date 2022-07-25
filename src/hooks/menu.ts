import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useMenu = () => {
  const menuData = useSelector((state: IObject<any>) => state.menu);
  return menuData || {};
};

export default useMenu;
