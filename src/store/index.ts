import create, { StateCreator } from 'zustand';
import {
  devtools, DevtoolsOptions, persist, PersistOptions,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import zustandFlipper from 'react-native-flipper-zustand'

type Persist = (
    config: StateCreator<any>,
    options: PersistOptions<any>
) => StateCreator<any>

type Devtools = (
    config: StateCreator<any>,
    options: DevtoolsOptions
) => StateCreator<any>

const withPersist = (
  payload: any,
  options: PersistOptions<any>,
) => (persist as unknown as Persist)(
  payload,
  { ...options, getStorage: () => AsyncStorage },
);

const withDevtools = (
  payload: any,
  options?: DevtoolsOptions,
) => (devtools as unknown as Devtools)(
  payload,
  options,
);

const withImmer = (
  payload: any,
) => (immer)(
  payload,
)

const withFlipper = (
  payload: any,
  name?: string,
) => (zustandFlipper)(
  payload, name,
)

interface ICreateZustand {
  persist?: PersistOptions<any>
}

const createZustand = <T>(name: string, store, options?: ICreateZustand): () => T => {
  let _store: any = zustandFlipper(immer(store), name);
  if (options?.persist) {
    _store = persist(_store, options.persist)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return create<T>(_store);
}

export {
  createZustand,
  create as createStore,
  withPersist,
  withDevtools,
  withImmer,
  withFlipper,
};
