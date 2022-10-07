import { IObject } from '~/interfaces/common';
import IBaseState from '../interfaces/IBaseState';

export interface IArticlesState extends IBaseState {
  items: IObject<any>,
  requestings: IObject<boolean>;
  actions: {
    getArticleDetail: (id: string) => void,
  }
}
