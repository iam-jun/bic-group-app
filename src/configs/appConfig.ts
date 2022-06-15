const appConfig = {
  dataMode: 'mock',
  defaultLanguage: 'en',
  recordsPerPage: 25,
  maxFileSize: {
    file: 5 * 1024 * 1000, // kb => byte = 5Mb
    video: 300 * 1024 * 1000, // kb => byte = 300Mb
  },
  searchTriggerTime: 200,
  defaultScreenOptions: {
    headerShown: false,
  },
  postPhotoLimit: 10,
  limitReactionCount: 21,
  maxFiles: 5,
};

export default appConfig;
