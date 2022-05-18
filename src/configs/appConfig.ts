const appConfig = {
  dataMode: 'mock',
  defaultLanguage: 'en',
  recordsPerPage: 25,
  maxFileSize: 10 * 1024 * 1000, // kb => byte = 10Mb
  maxVideoSize: 200 * 1024 * 1000, // kb => byte = 200Mb
  searchTriggerTime: 200,
  defaultScreenOptions: {
    headerShown: false,
  },
  postPhotoLimit: 10,
  limitReactionCount: 21,
};

export default appConfig;
