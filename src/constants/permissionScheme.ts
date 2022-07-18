export const ROLE_SCOPE = {
  COMMUNITY: 'COMMUNITY',
  GROUP: 'GROUP',
};

export const ROLE_TYPE = {
  COMMUNITY_ADMIN: 'COMMUNITY_ADMIN',
  GROUP_ADMIN: 'GROUP_ADMIN',
  MEMBER: 'MEMBER',
  CREATOR: 'CREATOR',
};

export const CATEGORY_KEY = {
  COMMUNITY: 'permission.category.community',
  GROUP: 'permission.category.group',
  CHAT: 'permission.category.chat',
};

export const PERMISSION_KEY = {
  FULL_PERMISSION: 'manage',
  COMMUNITY: {
    CRUD_OVERRIDE_SCHEME: 'crud_community_override_scheme',
    ADD_REMOVE_MEMBERS: 'add_remove_community_members',
    APPROVE_REJECT_JOINING_REQUESTS:
      'approve_reject_community_joining_requests',
    ASSIGN_UNASSIGN_ROLE: 'assign_unassign_role_in_community',
    CREATE_INNER_GROUPS: 'create_inner_groups',
    DELETE_OWN_INNER_GROUPS: 'delete_own_inner_groups',
    DELETE_OTHERS_INNER_GROUPS: 'delete_others_inner_groups',
    VIEW_REPORTED_MEMBERS: 'view_reported_members_in_community',
    REPORT_MEMBER: 'report_member_in_community',
    EDIT_INFORMATION: 'edit_community_information',
    EDIT_PRIVACY: 'edit_community_privacy',
    EDIT_JOIN_POLICIES: 'edit_community_join_policies',
    VIEW_ACTIVITY_LOG: 'view_community_activity_log',
  },
  GROUP: {
    CRUD_OVERRIDE_SCHEME: 'crud_group_override_scheme',
    ADD_REMOVE_MEMBERS: 'add_remove_group_members',
    APPROVE_REJECT_JOINING_REQUESTS: 'approve_reject_group_joining_requests',
    ASSIGN_UNASSIGN_ROLE: 'assign_unassign_role_in_group',
    VIEW_REPORTED_MEMBERS: 'view_reported_members_in_group',
    REPORT_MEMBER: 'report_member_in_group',
    EDIT_INFORMATION: 'edit_group_information',
    EDIT_PRIVACY: 'edit_group_privacy',
    MANAGE_POST_SETTINGS: 'manage_post_settings',
    MANAGE_WEBHOOK_INTEGRATIONS: 'manage_webhook_integrations',
    VIEW_ACTIVITY_LOG: 'view_group_activity_log',
    VIEW_POST_STATISTICS: 'view_post_statistics',
    CREATE_POST_ARTICLE: 'create_post_article',
    APPROVE_DENY_POST: 'approve_deny_post',
    REPORT_A_POST: 'report_a_post',
    VIEW_REPORTED_POSTS: 'view_reported_posts',
    CREATE_IMPORTANT_POST: 'create_important_post',
    EDIT_OWN_POST: 'edit_own_post',
    DELETE_OWN_POST: 'delete_own_post',
    DELETE_OTHERS_POST: 'delete_others_post',
  },
  CHAT: {
    SEND_MESSAGE: 'send_message',
    EDIT_OWN_MESSAGE: 'edit_own_message',
    DELETE_OWN_MESSAGE: 'delete_own_message',
    ADD_DELETE_REACTIONS: 'add_delete_reactions',
    CHANNEL_MENTIONS: 'channel_mentions',
    DELETE_OTHERS_MESSAGE: 'delete_others_message',
  },
};
