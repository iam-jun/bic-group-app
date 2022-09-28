/* eslint-disable func-names */

import { DeviceEventEmitter } from 'react-native';
import { EVENT_LOGGER_TAG } from '.';
import { LogType } from './Interface';

/* eslint-disable no-sequences */
export function zustandLogger(fn, storeName) {
  const test = function (set, get, api) {
    const namedSet = (state, name, replace = false) => {
      const blacklist = [
        'apply',
        'anonymous',
        '_callReactNativeMicrotasksPass',
        '__callReactNativeMicrotasks',
        '__guard',
        'invokeCallbackAndReturnFlushedQueue',
        'namedSet',
        'tryCallOne',
        '_callTimer',
        'callReactNativeMicrotasks',
        'flushedQueue',
        'commitHookEffectListMount',
        'commitPassiveMountEffects_complete',
        'commitPassiveMountEffects',
        'flushPassiveEffects',
        'workLoop',
        '_flushCallback',
        'callTimers',
        '__callFunction',
        'invoke',
        'call',
        'tryCallTwo',
        'Promise',
        'enqueue',
        'callFunctionReturnFlushedQueue',
        'safelyCallDestroy',
        'commitPassiveUnmountInsideDeletedTreeOnFiber',
        'commitPassiveUnmountEffects',
        'commitPassiveUnmountEffects_begin',
        'flushPassiveEffectsImpl',
        'flushWork',
        'commitHookEffectListUnmount',
        'commitPassiveUnmountEffectsInsideOfDeletedTree_begin',
        'flushSyncCallbacks',
        'batchedUpdates',
        'receiveTouches',
        'receiveEvent',
        'onPress',
        '_receiveSignal',
        'executeDispatch',
        'executeDispatchesAndRelease',
        '_receiveRootNodeIDEvent',
        'forEach',
        'runEventsInBatch',
        '_performTransitionSideEffects',
        'onResponderRelease',
      ];

      const callerName = [];

      try { throw new Error(); } catch (e) {
        const re = /(\w+)@|at (\w+) \(/g; const st = e.stack; let
          m;
        do {
          // eslint-disable-next-line no-unused-expressions
          re.exec(st), m = re.exec(st);
          if (m) {
            const _name = m[1] || m[2];
            if (!blacklist.includes(_name)) { callerName.push(_name); }
          }
        } while (m);
      }

      const newName = callerName.join('/').trim();

      set(state, replace, name);

      DeviceEventEmitter.emit(EVENT_LOGGER_TAG, {
        type: LogType.ZUSTAND,
        data: {
          storeName,
          title: name || newName || 'ZustandAction',
          state: get(),
        },
      });
    };

    return fn(namedSet, get, api);
  };

  return test;
}
