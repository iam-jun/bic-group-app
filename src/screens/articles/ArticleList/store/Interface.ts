import IBaseState from '~/store/interfaces/IBaseState';

export interface IArticleListState extends IBaseState {
  ids: string[],
  loading: boolean,
  hasNextPage: boolean,
  actions: {
    getArticles: () => void,
  }
}
