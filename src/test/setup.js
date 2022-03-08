import * as React from 'react';
import * as ReactNative from 'react-native';
import {configure} from 'enzyme';
import {get} from 'lodash';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import 'react-native-gesture-handler/jestSetup';
import {initReactI18next} from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

import colors from '~/theme/colors';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import mockSafeAreaContext from '~/test/mockSafeAreaContext';

configure({adapter: new Adapter()});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const languages = require('~/localization/en.json');

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn().mockImplementation(() =>
    Promise.resolve({
      mime: 'test',
      data: 'test',
    }),
  ),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.doMock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => get(languages, str?.replaceAll?.(':', '.')),
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
      },
    };
  },
  initReactI18next,
}));

jest.doMock('i18next', () => ({
  t: str => get(languages, str?.replaceAll?.(':', '.')),
}));

jest.doMock('react-native-paper', () => ({
  // eslint-disable-next-line react/prop-types
  Portal: ({children}) => children,
  useTheme: () => ({
    colors: colors.light.colors,
    spacing: spacing,
    dimension: dimension,
  }),
  TextInput: ReactNative.TextInput,
}));

jest.doMock('react-native-modalize', () => {
  const RealModule = jest.requireActual('react-native-modalize');
  // noinspection UnnecessaryLocalVariableJS
  const MockedModule = {
    ...RealModule,
    // eslint-disable-next-line react/prop-types
    Modalize: ({children}) => <ReactNative.View>{children}</ReactNative.View>,
  };
  return MockedModule;
});

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.doMock('react-native', () => {
  const {
    Platform,
    StyleSheet,
    ViewPropTypes,
    PermissionsAndroid,
    ImagePickerManager,
    requireNativeComponent,
    Alert: RNAlert,
    InteractionManager: RNInteractionManager,
    NativeModules: RNNativeModules,
    Linking: RNLinking,
  } = ReactNative;

  const Alert = {
    ...RNAlert,
    alert: jest.fn(),
  };

  const InteractionManager = {
    ...RNInteractionManager,
    runAfterInteractions: jest.fn(cb => cb()),
  };

  // noinspection JSUnusedGlobalSymbols
  const NativeModules = {
    ...RNNativeModules,
    UIManager: {
      RCTView: {
        directEventTypes: {},
      },
    },
    BlurAppScreen: () => true,
    MattermostManaged: {
      getConfig: jest.fn(),
    },
    MattermostShare: {
      close: jest.fn(),
      cacheDirName: 'mmShare',
    },
    PlatformConstants: {
      forceTouchAvailable: false,
    },
    RNGestureHandlerModule: {
      State: {
        BEGAN: 'BEGAN',
        FAILED: 'FAILED',
        ACTIVE: 'ACTIVE',
        END: 'END',
      },
    },
    KeyboardObserver: {},
    RNCNetInfo: {
      getCurrentState: jest.fn().mockResolvedValue({isConnected: true}),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
      addEventListener: jest.fn(),
    },
    RNKeychainManager: {
      SECURITY_LEVEL_ANY: 'ANY',
      SECURITY_LEVEL_SECURE_SOFTWARE: 'SOFTWARE',
      SECURITY_LEVEL_SECURE_HARDWARE: 'HARDWARE',
    },
    RNReactNativeHapticFeedback: {
      trigger: jest.fn(),
    },
    StatusBarManager: {
      getHeight: jest.fn(),
    },
    RNDocumentPicker: {
      pick: jest.fn(),
    },
    RNPermissions: {},
    RNFastStorage: {
      setupLibrary: jest.fn(),
      setStringAsync: jest.fn(),
    },
  };

  const Linking = {
    ...RNLinking,
    openURL: jest.fn(),
  };

  return Object.setPrototypeOf(
    {
      Platform: {
        ...Platform,
        OS: 'ios',
        Version: 12,
      },
      StyleSheet,
      ViewPropTypes,
      PermissionsAndroid,
      ImagePickerManager,
      requireNativeComponent,
      Alert,
      InteractionManager,
      NativeModules,
      Linking,
    },
    ReactNative,
  );
});
