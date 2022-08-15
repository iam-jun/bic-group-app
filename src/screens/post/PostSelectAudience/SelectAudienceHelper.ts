import { isEqual } from 'lodash';
import { ICreatePostParams } from '~/interfaces/IPost';

export interface ISelectAudienceParams extends ICreatePostParams {
  isFirstStep?: boolean;
}

export const checkChangeAudiences = (
  a1: any, a2: any,
) => {
  if (a1?.length !== a2?.length) {
    return true;
  }
  const compare = (
    x: any, y: any,
  ) => (x > y ? 1 : -1);
  const ids1: any[] = [];
  const ids2: any[] = [];
  a1?.map?.((a: any) => ids1.push(a?.id));
  a2?.map?.((a: any) => ids2.push(a?.id));
  return !isEqual(
    ids1.sort(compare), ids2.sort(compare),
  );
};
