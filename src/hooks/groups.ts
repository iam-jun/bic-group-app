import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useGroups = () => {
  const groups = useSelector((state: IObject<any>) => state.groups);
  return groups || {};
};

export default useGroups;
