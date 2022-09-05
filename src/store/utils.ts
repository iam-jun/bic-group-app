import create from 'zustand';
import {
  persist,
  PersistOptions,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import zustandFlipper from 'react-native-flipper-zustand';

interface ICreateZustand {
  persist?: PersistOptions<any>;
}

const createStore = <T>(
  name: string,
  store,
  options?: ICreateZustand,
): (() => T) => {
  let _store: any = zustandFlipper(immer(store) as any, name);
  if (options?.persist) {
    _store = persist(_store, options.persist);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return create<T>(_store);
};

const resetStore = (initState: any, set: any) => {
  set((state) => {
    Object.keys(initState).forEach((k) => {
      state[k] = initState[k];
    });
  }, false, 'reset');
};

export {
  createStore,
  create as createZustand,
  resetStore,
};
