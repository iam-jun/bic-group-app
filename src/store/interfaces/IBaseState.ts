interface IBaseState {
  reset?: () => void;
}

export interface IBaseListState<T> {
  ids: T[];
  loading: boolean;
  refreshing: boolean;
  error?: any;
  hasNextPage: boolean;
}

export default IBaseState;
