import * as ReactNative from 'react-native';
import {configure} from 'enzyme';
import MockAsyncStorage from 'mock-async-storage';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import 'react-native-gesture-handler/jestSetup';
import {initReactI18next} from 'react-i18next';

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

import colors from '~/theme/colors';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

configure({adapter: new Adapter()});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.doMock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
      },
    };
  },
  initReactI18next,
}));

jest.doMock('react-native-paper', () => ({
  useTheme: () => {
    return {
      colors: colors.light.colors,
      spacing: spacing,
      dimension: dimension,
    };
  },
}));

const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-async-storage/async-storage', () => mockImpl);

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
