import create, { StateCreator } from 'zustand';
import {
  devtools, DevtoolsOptions, persist, PersistOptions,
} from 'zustand/middleware';

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
  options,
)

const withDevtools = (
  payload: any,
  options?: DevtoolsOptions,
) => (devtools as unknown as Devtools)(
  payload,
  options,
)

export {
  create as createStore,
  withPersist,
  withDevtools,
};
