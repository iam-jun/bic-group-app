import {Platform} from 'react-native';

const appConfig = {
  dataMode: 'mock',
  defaultLanguage: 'en',
  recordsPerPage: 25,
  messagesPerPage: Platform.OS === 'web' ? 50 : 25,
  maxFileSize: 10 * 1024 * 1000, // kb => byte = 10Mb
  searchTriggerTime: 200,
  defaultScreenOptions: {
    headerShown: false,
  },
  postPhotoLimit: 10,
};

export default appConfig;
