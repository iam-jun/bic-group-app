import { IconType } from '~/resources/icons';

export enum CommunityPrivacyType {
  OPEN = 'OPEN',
  PRIVATE = 'PRIVATE',
  SECRET = 'SECRET'
}

export enum GroupPrivacyType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PRIVATE = 'PRIVATE',
  SECRET = 'SECRET',
}

export interface IPrivacyItem {
  type: GroupPrivacyType | CommunityPrivacyType,
  title: string,
  icon: IconType,
  subtitle: string,
  privacyTitle: string
}

export const GroupPrivacyDetail = {
  OPEN: {
    type: GroupPrivacyType.OPEN,
    title: 'settings:title_open',
    icon: 'iconOpen',
    subtitle: 'settings:title_open_subtitle_group',
    privacyTitle: 'settings:privacy_open',
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
  CLOSED: {
    type: GroupPrivacyType.CLOSED,
    title: 'settings:title_closed',
    icon: 'iconClosed',
    subtitle: 'settings:title_closed_subtitle_group',
    privacyTitle: 'settings:privacy_closed',
  },
};

export const CommunityPrivacyDetail = {
  OPEN: {
    type: CommunityPrivacyType.OPEN,
    title: 'settings:title_open',
    icon: 'iconOpen',
    subtitle: 'settings:title_open_subtitle_community',
    privacyTitle: 'settings:privacy_open',
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
