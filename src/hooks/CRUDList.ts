import {useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';

const useCRUDList = (dataType: string) => {
  const CRUDList = useSelector((state: IObject<any>) => state.CRUDList);
  return CRUDList.list[dataType];
};

export default useCRUDList;
