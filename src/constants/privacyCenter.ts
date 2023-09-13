export enum PERSONAL_INFORMATION_VISIBILITY_TYPE {
    ONLY_ME = 'ONLY_ME',
    COMMUNITY_MEMBERS = 'COMMUNITY_MEMBERS',
    EVERYONE = 'EVERYONE',
}

export const PERSONAL_INFORMATION_VISIBILITY_TYPES = [
  {
    id: PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE,
    title: 'settings:privacy_center:personal_information_visibility:everyone_type',
    description: 'settings:privacy_center:personal_information_visibility:everyone_description',
  },
  {
    id: PERSONAL_INFORMATION_VISIBILITY_TYPE.COMMUNITY_MEMBERS,
    title: 'settings:privacy_center:personal_information_visibility:community_members_type',
    description: 'settings:privacy_center:personal_information_visibility:community_members_description',
  },
  {
    id: PERSONAL_INFORMATION_VISIBILITY_TYPE.ONLY_ME,
    title: 'settings:privacy_center:personal_information_visibility:only_me_type',
    description: 'settings:privacy_center:personal_information_visibility:only_me_description',
  },
];

export enum INVITATION_PRIVACY_TYPE {
    MANUALLY_ACCEPT = 'MANUALLY_ACCEPT',
    HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
}

export const INVITATION_PRIVACY_TYPES = [
  {
    id: INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT,
    title: 'settings:privacy_center:invitation_privacy:manual_acceptance_type',
    description: 'settings:privacy_center:invitation_privacy:manual_acceptance_description',
  },
  {
    id: INVITATION_PRIVACY_TYPE.HIDE_NOTIFICATION,
    title: 'settings:privacy_center:invitation_privacy:hide_all_inviations_type',
    description: 'settings:privacy_center:invitation_privacy:hide_all_inviations_description',
  },
];
