import {ICreatePostParams} from '~/interfaces/IPost';
import {isEqual} from 'lodash';

export interface ISelectAudienceParams extends ICreatePostParams {
  isFirstStep?: boolean;
}

export const checkChangeAudiences = (a1: any, a2: any) => {
  if (a1?.length !== a2?.length) {
    return true;
  }
  const compare = (x: any, y: any) => (x > y ? 1 : -1);
  const ids1: number[] = [];
  const ids2: number[] = [];
  a1?.map?.((a: any) => ids1.push(Number(a?.id)));
  a2?.map?.((a: any) => ids2.push(Number(a?.id)));
  return !isEqual(ids1.sort(compare), ids2.sort(compare));
};
