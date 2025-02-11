export const communityScheme = {
  scope: 'COMMUNITY',
  id: '491a5ea2-5b39-4cdc-8cca-f458e5a4869a',
  chatSchemeId: 'og66eya1p3f3tjwt8ummq4bj9c',
  name: 'Comm scheme',
  description: 'Testing scheme',
  isSystem: false,
  usedInsideCommId: 17,
  createdAt: '2022-07-01T07:14:31.883Z',
  updatedAt: '2022-07-01T07:14:32.155Z',
  deletedAt: null,
  roles: [
    {
      id: '785d6db9-ce44-4aff-8414-015e182e3b02',
      name: 'Community Admin',
      type: 'COMMUNITY_ADMIN',
      scope: 'COMMUNITY',
      permissions: [
        'add_remove_community_members',
        'approve_reject_community_joining_requests',
        'assign_unassign_role_in_community',
        'create_inner_groups',
        'delete_own_inner_groups',
        'delete_others_inner_groups',
        'view_reported_members_in_community',
        'report_member_in_community',
        'view_community_activity_log',
        'send_message',
        'edit_own_message',
        'delete_own_message',
        'add_delete_reactions',
        'channel_mentions',
        'delete_others_message',
        'add_remove_group_members',
        'approve_reject_group_joining_requests',
        'assign_unassign_role_in_group',
        'view_reported_members_in_group',
        'report_member_in_group',
        'view_group_activity_log',
        'view_post_statistics',
        'create_post_article',
        'approve_deny_post',
        'report_a_post',
        'view_reported_posts',
        'create_important_post',
        'delete_own_post',
        'delete_others_post',
      ],
    },
    {
      id: 'b77eeb4b-c9be-4133-abc1-465be057a136',
      name: 'Group Admin',
      type: 'GROUP_ADMIN',
      scope: 'GROUP',
      permissions: [
        'add_remove_group_members',
        'approve_reject_group_joining_requests',
        'assign_unassign_role_in_group',
        'view_reported_members_in_group',
        'report_member_in_group',
        'view_group_activity_log',
        'view_post_statistics',
        'create_post_article',
        'approve_deny_post',
        'report_a_post',
        'view_reported_posts',
        'create_important_post',
        'delete_own_post',
        'delete_others_post',
        'send_message',
        'edit_own_message',
        'delete_own_message',
        'add_delete_reactions',
        'channel_mentions',
        'delete_others_message',
      ],
    },
    {
      id: '9e06d292-2a0c-47f0-abd5-e873b6a1f81c',
      name: 'Member',
      type: 'MEMBER',
      permissions: [
        'report_member_in_group',
        'create_post_article',
        'report_a_post',
        'delete_own_post',
        'send_message',
        'edit_own_message',
        'delete_own_message',
        'add_delete_reactions',
        'channel_mentions',
        'report_member_in_community',
      ],
      description: 'Member',
    },
  ],
};

export const groupScheme = {
  id: '0afd86de-fbbd-4d9e-b291-810ec6a83c72',
  name: 'Scheme 2',
  description: 'Description 2',
  isSystem: false,
  usedInsideCommId: 17,
  roles: [
    {
      id: '397ab59f-b548-4af9-aa86-f24b6db572f6',
      name: 'Group Admin',
      type: 'GROUP_ADMIN',
      scope: 'GROUP',
      permissions: [
        'add_remove_group_members',
        'approve_reject_group_joining_requests',
        'assign_unassign_role_in_group',
        'view_reported_members_in_group',
        'report_member_in_group',
        'view_group_activity_log',
        'view_post_statistics',
        'create_post_article',
        'approve_deny_post',
        'report_a_post',
        'view_reported_posts',
        'create_important_post',
        'delete_own_post',
        'delete_others_post',
        'send_message',
        'edit_own_message',
        'delete_own_message',
        'add_delete_reactions',
        'channel_mentions',
        'delete_others_message',
      ],
    },
    {
      id: '0545d695-12b1-430c-8621-0b5105a450c8',
      name: 'Group Member',
      type: 'MEMBER',
      scope: 'GROUP',
      permissions: [
        'report_member_in_group',
        'create_post_article',
        'report_a_post',
        'delete_own_post',
        'send_message',
        'edit_own_message',
        'delete_own_message',
        'add_delete_reactions',
        'channel_mentions',
      ],
    },
  ],
  applyingGroups: [
    {
      id: '163',
      name: 'Green grass',
      description: null,
      icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/d03ab007-b104-43d1-9bbe-178ca2c93c7b.jpg',
    },
  ],
};
