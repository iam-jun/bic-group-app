import create from 'zustand';
import {
  persist,
  PersistOptions,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import zustandFlipper from 'react-native-flipper-zustand';
import { zustandLogger } from '../components/LogView/utils';

interface ICreateZustand {
  persist?: PersistOptions<any>;
}

const createStore = <T>(store, options?: ICreateZustand) => {
  const storeName = store.name || 'ZustandStore';
  let _store: any = zustandLogger(zustandFlipper(immer(store) as any, storeName), storeName);
  if (options?.persist) {
    _store = persist(_store, options.persist);
  }

  return create<T>(_store);
};

const resetStore = (initState: any, set: any) => {
  set((state) => {
    Object.keys(initState).forEach((k) => {
      state[k] = initState[k];
    });
  });
};

export {
  createStore,
  create as createZustand,
  resetStore,
};
