export interface IBaseState {
  reset?: () => void;
}

export interface IBaseListState<T> {
  ids: T[];
  loading: boolean;
  refreshing: boolean;
  error?: any;
  hasNextPage: boolean;
}

export type InitStateType<T> = Omit<T, 'actions' | 'reset'>

export default IBaseState;
