export type PRIVACY_TYPE = 'PUBLIC' | 'PRIVATE' | 'SECRET' | 'OPEN';
export type GROUP_TYPE = 'GENERIC' | 'COMMUNITY' | 'COMPANY';

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
    icon: 'Globe',
    subtitle: 'settings:title_public_subtitle',
    groupTitle: 'settings:group_title_public',
  },
  {
    type: 'PRIVATE',
    title: 'settings:title_private',
    icon: 'Lock',
    subtitle: 'settings:title_private_subtitle',
    groupTitle: 'settings:group_title_private',
  },
  {
    type: 'SECRET',
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle',
    groupTitle: 'settings:group_title_secret',
  },
  {
    type: 'OPEN',
    title: 'settings:title_open',
    icon: 'Eye',
    subtitle: 'settings:title_open_subtitle',
    groupTitle: 'settings:group_title_open',
  },
];
