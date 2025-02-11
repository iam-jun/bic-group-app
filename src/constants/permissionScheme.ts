export enum RoleType {
  COMMUNITY_ADMIN = 'COMMUNITY_ADMIN',
  GROUP_ADMIN = 'GROUP_ADMIN',
  MEMBER = 'MEMBER',
  CREATOR = 'CREATOR',
}

export enum CategoryKey {
  COMMUNITY = 'permission.category.community',
  GROUP = 'permission.category.group',
  CHAT = 'permission.category.chat',
}

export enum PermissionKey {
  FULL_PERMISSION = 'manage',

  // Organization
  CRUD_CUSTOM_SCHEME = 'crud_custom_scheme',
  CREATE_DELETE_ARCHIVE_GROUPS = 'create_delete_archive_groups',
  ORDER_MOVE_GROUP_STRUCTURE = 'order_move_group_structure',
  CUD_TAGS = 'cud_tags',

  // Management
  ADD_MEMBER = 'add_member',
  REMOVE_MEMBER = 'remove_member',
  APPROVE_REJECT_JOINING_REQUESTS = 'approve_reject_jr',
  ASSIGN_UNASSIGN_ROLE = 'assign_unassign_role',

  // Settings
  EDIT_JOIN_SETTING = 'edit_join_setting',
  EDIT_INFO = 'edit_info',
  EDIT_PRIVACY = 'edit_privacy',
  EDIT_POST_APPROVAL_SETTING = 'edit_post_approval_setting',
  CREATE_CUSTOM_EMOJI = 'create_custom_emoji',

  // Post/article
  CRUD_POST_ARTICLE = 'crud_post_article',
  CRUD_SERIES = 'crud_series',
  ASSIGN_CONTENT_OWNER = 'assign_content_owner',
  EDIT_POST_OF_INACTIVE_USER = 'edit_post_of_inactive_user',
  EDIT_OWN_CONTENT_SETTING= 'edit_own_content_setting',
  PUBLISH_UNPUBLISH_POST = 'publish_unpublish_post',

  // CHAT Channel
  CRUD_UNOFFICIAL_CHANNEL = 'crud_uc',
  SEND_MESSAGE = 'send_message',
  EDIT_OWN_MESSAGE = 'edit_own_message',
  DELETE_OWN_MESSAGE = 'delete_own_message',
  CHANNEL_MENTIONS = 'channel_mentions',
  DELETE_OTHERS_MESSAGE = 'delete_others_message',

  // Permission key by role
  ROLE_COMMUNITY_OWNER = 'role_OWNER',
  ROLE_COMMUNITY_ADMIN = 'role_COMMUNITY_ADMIN',
  ROLE_GROUP_ADMIN = 'role_GROUP_ADMIN',

  // pin content
  PIN_CONTENT = 'pin_content',

  // quiz
  CUD_QUIZ = 'cud_quiz'
}
