const appConfig = {
  dataMode: 'mock',
  defaultLanguage: 'en',
  recordsPerPage: 25,
  maxFileSize: {
    video: 300 * 1024 * 1000, // kb => byte = 300Mb
  },
  searchTriggerTime: 200,
  defaultScreenOptions: {
    headerShown: false,
  },
  postPhotoLimit: 10,
  limitReactionCount: 21,
  maxFiles: 25,
  totalFileSize: 25 * 1024 * 1000, // kb => byte = 25Mb
  fileUploadTimeout: 5 * 60 * 1000, // 5 minutes
};

export default appConfig;
