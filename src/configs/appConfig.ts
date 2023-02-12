export const APP_ENV = {
  SANDBOX: 'sbx',
  STAGING: 'stg',
  PRODUCTION: 'pro',
};

const appConfig = {
  defaultLanguage: 'en',
  recordsPerPage: 25,
  maxFileSize: {
    video: 300 * 1024 * 1024, // kb => byte = 300Mb
    image: 5 * 1024 * 1024, // kb => byte = 5Mb

  },
  searchTriggerTime: 200,
  defaultScreenOptions: {
    headerShown: false,
  },
  postPhotoLimit: 10,
  limitReactionCount: 21,
  maxFiles: 25,
  totalFileSize: 25 * 1024 * 1024, // kb => byte = 25Mb
  fileUploadTimeout: 5 * 60 * 1000, // 5 minutes,
  commentLimit: 10,
  limitPostContentLength: 400,
  shortPostContentLength: 400,
  articlesInSeriesLimit: 20,
  articlePhotoMaxSize: 25 * 1024 * 1024, // kb => byte = 25Mb
  superUsers: [
    'namanh@evolgroup.vn',
    'dieplamminhthu@evolgroup.vn',
    'thuquyen@evolgroup.vn',
    'phuongkhanh@evolgroup.vn',
    'sison@evolgroup.vn',
    'ngoclinh@evolgroup.vn',
    'kimmai@evolgroup.vn',
    'ngoccuong@evolgroup.vn',
  ],
};

export default appConfig;
