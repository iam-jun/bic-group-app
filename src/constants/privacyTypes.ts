export type GROUP_PRIVACY_TYPE = 'PUBLIC' | 'PRIVATE' | 'SECRET' | 'OPEN';
export type COMMUNITY_PRIVACY_TYPE = 'PUBLIC' | 'PRIVATE' | 'SECRET';

export const groupPrivacy = {
  public: 'PUBLIC',
  private: 'PRIVATE',
  secret: 'SECRET',
  open: 'OPEN',
};

export default [
  {
    type: 'PUBLIC',
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_group',
    privacyTitle: 'settings:privacy_public',
  },
  {
    type: 'PRIVATE',
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_group',
    privacyTitle: 'settings:privacy_private',
  },
  {
    type: 'SECRET',
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_group',
    privacyTitle: 'settings:privacy_secret',
  },
  {
    type: 'OPEN',
    title: 'settings:title_open',
    icon: 'iconOpen',
    subtitle: 'settings:title_open_subtitle_group',
    privacyTitle: 'settings:privacy_open',
  },
];

export const communityPrivacyListDetail = [
  {
    type: 'PUBLIC',
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_community',
    privacyTitle: 'settings:privacy_public',
  },
  {
    type: 'PRIVATE',
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_community',
    privacyTitle: 'settings:privacy_private',
  },
  {
    type: 'SECRET',
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_community',
    privacyTitle: 'settings:privacy_secret',
  },
];
