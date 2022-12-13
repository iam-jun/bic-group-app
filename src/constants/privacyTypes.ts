import { IconType } from '~/resources/icons';

export enum CommunityPrivacyType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  SECRET = 'SECRET'
}

export enum GroupPrivacyType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  SECRET = 'SECRET',
  OPEN = 'OPEN'
}

export interface IPrivacyItem {
  type: GroupPrivacyType | CommunityPrivacyType,
  title: string,
  icon: IconType,
  subtitle: string,
  privacyTitle: string
}

export const groupPrivacyListDetail: IPrivacyItem[] = [
  {
    type: GroupPrivacyType.PUBLIC,
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_group',
    privacyTitle: 'settings:privacy_public',
  },
  {
    type: GroupPrivacyType.PRIVATE,
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_group',
    privacyTitle: 'settings:privacy_private',
  },
  {
    type: GroupPrivacyType.SECRET,
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_group',
    privacyTitle: 'settings:privacy_secret',
  },
  {
    type: GroupPrivacyType.OPEN,
    title: 'settings:title_open',
    icon: 'iconOpen',
    subtitle: 'settings:title_open_subtitle_group',
    privacyTitle: 'settings:privacy_open',
  },
];

export const GroupPrivacyDetail = {
  PUBLIC: {
    type: GroupPrivacyType.PUBLIC,
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_group',
    privacyTitle: 'settings:privacy_public',
  },
  PRIVATE: {
    type: GroupPrivacyType.PRIVATE,
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_group',
    privacyTitle: 'settings:privacy_private',
  },
  SECRET: {
    type: GroupPrivacyType.SECRET,
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_group',
    privacyTitle: 'settings:privacy_secret',
  },
  OPEN: {
    type: GroupPrivacyType.OPEN,
    title: 'settings:title_open',
    icon: 'iconOpen',
    subtitle: 'settings:title_open_subtitle_group',
    privacyTitle: 'settings:privacy_open',
  },
};

export const communityPrivacyListDetail: IPrivacyItem[] = [
  {
    type: CommunityPrivacyType.PUBLIC,
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_community',
    privacyTitle: 'settings:privacy_public',
  },
  {
    type: CommunityPrivacyType.PRIVATE,
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_community',
    privacyTitle: 'settings:privacy_private',
  },
  {
    type: CommunityPrivacyType.SECRET,
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_community',
    privacyTitle: 'settings:privacy_secret',
  },
];

export const CommunityPrivacyDetail = {
  PUBLIC: {
    type: CommunityPrivacyType.PUBLIC,
    title: 'settings:title_public',
    icon: 'iconPublic',
    subtitle: 'settings:title_public_subtitle_community',
    privacyTitle: 'settings:privacy_public',
  },
  PRIVATE: {
    type: CommunityPrivacyType.PRIVATE,
    title: 'settings:title_private',
    icon: 'iconPrivate',
    subtitle: 'settings:title_private_subtitle_community',
    privacyTitle: 'settings:privacy_private',
  },
  SECRET: {
    type: CommunityPrivacyType.SECRET,
    title: 'settings:title_secret',
    icon: 'iconSecret',
    subtitle: 'settings:title_secret_subtitle_community',
    privacyTitle: 'settings:privacy_secret',
  },
};
