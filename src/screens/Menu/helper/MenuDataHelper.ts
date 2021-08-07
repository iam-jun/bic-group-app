import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import userProfileDataMocksResponse from './mockDataUserProfile';

export const menuApiConfig = {
  getMyProfile: (): HttpApiRequestConfig => ({
    // TODO: will need to change API URL
    url: `${ApiConfig.providers.bein.url}users/my-group`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const menuDataHelper = {
  getMyProfile: async () => {
    try {
      // TODO: will need to change response data
      const response: any = userProfileDataMocksResponse;
      // const response: any = await makeHttpRequest(menuApiConfig.getMyProfile());
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default menuDataHelper;

export const mapBasicInfoData = userProfileData => {
  // const allTitles = ['fullname', 'gender', 'birthday', 'language'];
  // const data = allTitles.map((title: string) => ({
  //   title: `settings:title_${title}`,
  //   subtitle: userProfileData.title,
  // }));

  const data = [
    {
      title: 'settings:title_name',
      subtitle: userProfileData.fullname,
      leftIcon: 'TextFields',
      privacyIcon: 'Globe',
    },
    {
      title: 'settings:title_gender',
      subtitle: userProfileData.gender,
      leftIcon: 'UserSquare',
      privacyIcon: 'Lock',
    },
    {
      title: 'settings:title_birthday',
      subtitle: userProfileData.birthday,
      leftIcon: 'Calender',
      privacyIcon: 'Lock',
    },
    {
      title: 'settings:title_language',
      subtitle: userProfileData.language,
      leftIcon: 'CommentsAlt',
      privacyIcon: 'Lock',
    },
  ];

  return data;
};
