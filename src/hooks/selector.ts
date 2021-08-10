import {useSelector} from 'react-redux';
import {get} from 'lodash';
import {IObject} from '~/interfaces/common';

export const useKeySelector = (key: string) => {
  return useSelector((state: IObject<any>) => get(state, key));
};
