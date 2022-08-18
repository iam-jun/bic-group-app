import { cleanup } from '@testing-library/react-native';

global.__DEV__ = false;

afterEach(() => {
  cleanup();
  jest.useRealTimers();
});
