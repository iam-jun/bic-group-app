function fetchable<T extends GenericFunction>( saga: T, ...args: Parameters<T>): IFetchSaga<T> {
  return {saga, args};
}