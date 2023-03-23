// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import * as React from 'react';
import * as ReactNative from 'react-native';
import { configure } from 'enzyme';
import { get } from 'lodash';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

import 'react-native-gesture-handler/jestSetup';
import { initReactI18next } from 'react-i18next';

import mockPermissions from 'react-native-permissions/mock';
import mockSafeAreaContext from '~/test/mockSafeAreaContext';
import colors from '~/theme/theme';

jest.mock('zustand');

jest.mock('rn-fetch-blob', () => {
  const rnFetchBlobMock = {
    DocumentDir: jest.fn(),
    polyfill: jest.fn(),
    fetch: jest.fn(),
    fs: {
      scanFile: jest.fn(),
      unlink: jest.fn(),
      mkdir: jest.fn(),
      dirs: {
        MainBundleDir: '',
        CacheDir: '',
        DocumentDir: '',
        PictureDir: '',
      },
    },
  };

  return {
    ...rnFetchBlobMock,
    config: () => rnFetchBlobMock,
  };
});

configure({ adapter: new Adapter() });

global.__reanimatedWorkletInit = jest.fn();

const languages = require('~/localization/en.json');

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('@react-native-clipboard/clipboard');

/* eslint-disable no-undef */
// jest.doMock('@react-native-firebase', () => ({
//   ...jest.requireActual('@react-native-firebase'),
//   messaging: jest.fn(() => ({
//     hasPermission: jest.fn(() => Promise.resolve(true)),
//     subscribeToTopic: jest.fn(),
//     unsubscribeFromTopic: jest.fn(),
//     requestPermission: jest.fn(() => Promise.resolve(true)),
//     getToken: jest.fn(() => Promise.resolve('myMockToken')),
//   })),
// }));

jest.mock('~/services/sharePreferences', () => ({
  getUserFromSharedPreferences: jest.fn(),
  saveUserToSharedPreferences: jest.fn(),
  updateUserFromSharedPreferences: jest.fn(),
  isAppInstalled: jest.fn(),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn().mockImplementation(() => Promise.resolve({
    mime: 'test',
    data: 'test',
  })),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-permissions', () => mockPermissions);

global.FormData = require('react-native/Libraries/Network/FormData');

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.doMock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str, params) => {
      let suffix = '';
      if (params?.count) {
        suffix = params.count === 1 ? '_one' : '_other';
      }

      const translationResult = get(
        languages,
        `${str}${suffix}`.replaceAll?.(':', '.'),
      )?.replace('{{count}}', params?.count);

      return translationResult || str;
    },
    i18n: {
      changeLanguage: () => new Promise(),
    },
  }),
  initReactI18next,
}));

jest.doMock('i18next', () => ({
  ...jest.requireActual('i18next'),
  t: (str, params) => {
    let suffix = '';
    if (params?.count) {
      suffix = params.count === 1 ? '_one' : '_other';
    }

    const translationResult = get(
      languages,
      `${str}${suffix}`.replaceAll?.(':', '.'),
    )?.replace('{{count}}', params?.count);

    return translationResult || str;
  },
}));

jest.doMock('react-native-autogrow-textinput', () => ({
  // eslint-disable-next-line react/prop-types
  AutoGrowingTextInput: ({ children, ...props }) => (
    <ReactNative.TextInput {...props}>{children}</ReactNative.TextInput>
  ),
}));

jest.doMock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: (screen, params) => ({ screen, params }),
  }),
  useIsFocused: jest.fn(),
  useTheme: () => ({
    colors: colors.light.colors,
    elevations: colors.light.elevations,
  }),
}));

jest.doMock('react-native-modalize', () => {
  const RealModule = jest.requireActual('react-native-modalize');
  // noinspection UnnecessaryLocalVariableJS
  const MockedModule = {
    ...RealModule,
    // eslint-disable-next-line react/prop-types
    Modalize: ({ children }) => <ReactNative.View>{children}</ReactNative.View>,
  };
  return MockedModule;
});

jest.doMock('react-native-portalize', () => {
  const RealModule = jest.requireActual('react-native-portalize');
  // noinspection UnnecessaryLocalVariableJS
  const MockedModule = {
    ...RealModule,
    // eslint-disable-next-line react/prop-types
    Portal: ({ children }) => <ReactNative.View>{children}</ReactNative.View>,
  };
  return MockedModule;
});

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.doMock('aws-amplify', () => {
  const RealModule = jest.requireActual('aws-amplify');
  // noinspection UnnecessaryLocalVariableJS
  const MockedModule = {
    ...RealModule,
    // eslint-disable-next-line react/prop-types
    Auth: {
      ...RealModule.Auth,
      signIn: jest.fn(),
      forgotPassword: jest.fn(),
      forgotPasswordSubmit: jest.fn(),
    },
  };
  return MockedModule;
});

jest.mock('@react-native-camera-roll/camera-roll', () => ({
  save: jest.fn(),
}));

jest.doMock('react-native', () => {
  const {
    Platform,
    StyleSheet,
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
    runAfterInteractions: jest.fn((cb) => cb()),
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
      getCurrentState: jest.fn().mockResolvedValue({ isConnected: true }),
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
    RNCCameraRollPermissionModule: {
      checkPermission: jest.fn(),
      requestReadWritePermission: jest.fn(),
      requestAddOnlyPermission: jest.fn(),
      refreshPhotoSelection: jest.fn(),
    },
    RNCCameraRoll: {
      deletePhotos: jest.fn(),
      saveToCameraRoll: jest.fn(),
      getPhotos: jest.fn(),
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

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useController: ({ defaultValue }) => ({
    field: {
      onChange: jest.fn(),
      value: defaultValue,
    },
  }),
  Controller: ({ children }) => [children],
  useSubscribe: () => ({
    r: { current: { subject: { subscribe: () => jest.fn() } } },
  }),
}));

jest.doMock('expo-av', () => ({
  Video: {
    ...ReactNative.View,
    onPlaybackStatusUpdate: jest.fn(),
    onError: jest.fn(),
  },
  ResizeMode: { CONTAIN: 'CONTAIN' },
}));

// Fix case - TypeError: Cannot read properties of undefined (reading 'now')
global.ReanimatedDataMock = {
  now: () => 0,
};
