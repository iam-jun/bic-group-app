const groupsTypes = {
  //PERMISSION SCHEME
  GET_PERMISSION_CATEGORIES: 'groups/GET_PERMISSION_CATEGORIES',
  SET_PERMISSION_CATEGORIES: 'groups/SET_PERMISSION_CATEGORIES',
  GET_SYSTEM_SCHEME: 'groups/GET_SYSTEM_SCHEME',
  SET_SYSTEM_SCHEME: 'groups/SET_SYSTEM_SCHEME',
  SET_CREATING_SCHEME: 'groups/SET_CREATING_SCHEME',
  SET_CREATING_SCHEME_DATA: 'groups/SET_CREATING_SCHEME_DATA',
  UPDATE_CREATING_SCHEME_PERMISSION: 'groups/UPDATE_CREATING_SCHEME_PERMISSION',

  SET_PRIVACY_MODAL_OPEN: 'groups/SET_PRIVACY_MODAL_OPEN',

  GET_JOINED_GROUPS: 'groups/GET_JOINED_GROUPS',
  SET_JOINED_GROUPS: 'groups/SET_JOINED_GROUPS',

  CLEAR_GROUP_MEMBER: 'groups/CLEAR_GROUP_MEMBER',
  SET_GROUP_MEMBER: 'groups/SET_GROUP_MEMBER',
  GET_GROUP_MEMBER: 'groups/GET_GROUP_MEMBER',
  SET_LOADING_GROUP_MEMBER: 'groups/SET_LOADING_GROUP_MEMBER',
  GET_GROUP_SEARCH_MEMBERS: 'groups/GET_GROUP_SEARCH_MEMBERS',
  SET_GROUP_SEARCH_MEMBERS: 'groups/SET_GROUP_SEARCH_MEMBERS',
  CLEAR_GROUP_SEARCH_MEMBERS: 'groups/CLEAR_GROUP_SEARCH_MEMBERS',

  SET_GROUP_DETAIL: 'groups/SET_GROUP_DETAIL',
  GET_GROUP_DETAIL: 'groups/GET_GROUP_DETAIL',
  EDIT_GROUP_DETAIL: 'groups/EDIT_GROUP_DETAIL',

  GET_GROUP_POSTS: 'groups/GET_GROUP_POSTS',
  SET_GROUP_POSTS: 'groups/SET_GROUP_POSTS',
  SET_EXTRA_GROUP_POSTS: 'groups/SET_EXTRA_GROUP_POSTS',
  MERGE_EXTRA_GROUP_POSTS: 'groups/MERGE_EXTRA_GROUP_POSTS',
  CLEAR_GROUP_POSTS: 'groups/CLEAR_GROUP_POSTS',

  GET_JOINABLE_USERS: 'groups/GET_JOINABLE_USERS',
  SET_JOINABLE_USERS: 'groups/SET_JOINABLE_USERS',
  SET_EXTRA_JOINABLE_USERS: 'groups/SET_EXTRA_JOINABLE_USERS',
  MERGE_EXTRA_JOINABLE_USERS: 'groups/MERGE_EXTRA_JOINABLE_USERS',
  SELECT_JOINABLE_USERS: 'groups/SELECT_JOINABLE_USERS',
  CLEAR_SELECTED_USERS: 'groups/CLEAR_SELECTED_USERS',
  RESET_JOINABLE_USERS: 'groups/RESET_JOINABLE_USERS',
  SET_ADD_MEMBERS_MESSAGE: 'groups/SET_ADD_MEMBERS_MESSAGE',
  CLEAR_ADD_MEMBERS_MESSAGE: 'groups/CLEAR_ADD_MEMBERS_MESSAGE',

  ADD_MEMBERS: 'groups/ADD_MEMBERS',
  JOIN_NEW_GROUP: 'group/JOIN_NEW_GROUP',
  CANCEL_JOIN_GROUP: 'group/CANCEL_JOIN_GROUP',
  LEAVE_GROUP: 'group/LEAVE_GROUP',

  SET_GROUP_ADMIN: 'groups/SET_GROUP_ADMIN',
  REMOVE_GROUP_ADMIN: 'groups/REMOVE_GROUP_ADMIN',

  UPLOAD_IMAGE: 'groups/UPLOAD_IMAGE',

  SET_LOADING_AVATAR: 'groups/SET_LOADING_AVATAR',
  SET_LOADING_COVER: 'groups/SET_LOADING_COVER',
  SET_LOADING_PAGE: 'groups/SET_LOADING_PAGE',

  SET_GROUP_SEARCH: 'groups/SET_GROUP_SEARCH',
  GET_GROUP_SEARCH: 'groups/GET_GROUP_SEARCH',

  REMOVE_MEMBER: 'groups/REMOVE_MEMBER',

  GET_MEMBER_REQUESTS: 'groups/GET_MEMBER_REQUESTS',
  SET_MEMBER_REQUESTS: 'groups/SET_MEMBER_REQUESTS',
  RESET_MEMBER_REQUESTS: 'groups/RESET_MEMBER_REQUESTS',
  REMOVE_SINGLE_MEMBER_REQUEST: 'groups/REMOVE_SINGLE_MEMBER_REQUEST',
  STORE_UNDO_DATA: 'groups/STORE_UNDO_DATA',
  UNDO_DECLINE_MEMBER_REQUESTS: 'groups/UNDO_DECLINE_MEMBER_REQUESTS',
  REMOVE_ALL_MEMBER_REQUESTS: 'groups/REMOVE_ALL_MEMBER_REQUESTS',
  APPROVE_SINGLE_MEMBER_REQUEST: 'groups/APPROVE_SINGLE_MEMBER_REQUEST',
  APPROVE_ALL_MEMBER_REQUESTS: 'groups/APPROVE_ALL_MEMBER_REQUESTS',
  DECLINE_SINGLE_MEMBER_REQUEST: 'groups/DECLINE_SINGLE_MEMBER_REQUEST',
  DECLINE_ALL_MEMBER_REQUESTS: 'groups/DECLINE_ALL_MEMBER_REQUESTS',

  // COMMUNITY
  GET_JOINED_COMMUNITIES: 'groups/GET_JOINED_COMMUNITIES',
  SET_JOINED_COMMUNITIES: 'groups/SET_JOINED_COMMUNITIES',
  GET_MANAGED_COMMUNITIES: 'groups/GET_MANAGED_COMMUNITIES',
  SET_MANAGED_COMMUNITIES: 'groups/SET_MANAGED_COMMUNITIES',
  RESET_MANAGED_COMMUNITIES: 'groups/RESET_MANAGED_COMMUNITIES',
  GET_DISCOVER_COMMUNITIES: 'groups/GET_DISCOVER_COMMUNITIES',
  SET_DISCOVER_COMMUNITIES: 'groups/SET_DISCOVER_COMMUNITIES',
  RESET_DISCOVER_COMMUNITIES: 'groups/RESET_DISCOVER_COMMUNITIES',
  GET_COMMUNITY_GROUPS: 'groups/GET_COMMUNITY_GROUPS',
  SET_COMMUNITY_GROUPS: 'groups/SET_COMMUNITY_GROUPS',
  GET_COMMUNITY_DETAIL: 'groups/GET_COMMUNITY_DETAIL',
  SET_COMMUNITY_DETAIL: 'groups/SET_COMMUNITY_DETAIL',
  SET_COMMUNITY_LOADING: 'groups/SET_COMMUNITY_LOADING',
  GET_YOUR_GROUPS_SEARCH: 'groups/GET_YOUR_GROUPS_SEARCH',
  SET_YOUR_GROUPS_SEARCH: 'groups/SET_YOUR_GROUPS_SEARCH',
  GET_YOUR_GROUPS_TREE: 'groups/GET_YOUR_GROUPS_TREE',
  SET_YOUR_GROUPS_TREE: 'groups/SET_YOUR_GROUPS_TREE',
  GET_YOUR_GROUPS_LIST: 'groups/GET_YOUR_GROUPS_LIST',
  SET_YOUR_GROUPS_LIST: 'groups/SET_YOUR_GROUPS_LIST',
  GET_COMMUNITY_MEMBERS: 'groups/GET_COMMUNITY_MEMBERS',
  SET_COMMUNITY_MEMBERS: 'groups/SET_COMMUNITY_MEMBERS',
  RESET_COMMUNITY_MEMBERS: 'groups/RESET_COMMUNITY_MEMBERS',
  GET_COMMUNITY_SEARCH_MEMBERS: 'groups/GET_COMMUNITY_SEARCH_MEMBERS',
  SET_COMMUNITY_SEARCH_MEMBERS: 'groups/SET_COMMUNITY_SEARCH_MEMBERS',
  RESET_COMMUNITY_SEARCH_MEMBERS: 'groups/RESET_COMMUNITY_SEARCH_MEMBERS',
  GET_DISCOVER_GROUPS: 'groups/GET_DISCOVER_GROUPS',
  SET_DISCOVER_GROUPS: 'groups/SET_DISCOVER_GROUPS',
  RESET_DISCOVER_GROUPS: 'groups/RESET_DISCOVER_GROUPS',
  EDIT_DISCOVER_GROUP_ITEM: 'groups/EDIT_DISCOVER_GROUP_ITEM',
  JOIN_COMMUNITY: 'groups/JOIN_COMMUNITY',
  CANCEL_JOIN_COMMUNITY: 'groups/CANCEL_JOIN_COMMUNITY',
  EDIT_DISCOVER_COMMUNITY_ITEM: 'groups/EDIT_DISCOVER_COMMUNITY_ITEM',

  GET_COMMUNITY_MEMBER_REQUESTS: 'groups/GET_COMMUNITY_MEMBER_REQUESTS',
  SET_COMMUNITY_MEMBER_REQUESTS: 'groups/SET_COMMUNITY_MEMBER_REQUESTS',
  RESET_COMMUNITY_MEMBER_REQUESTS: 'groups/RESET_COMMUNITY_MEMBER_REQUESTS',
  APPROVE_SINGLE_COMMUNITY_MEMBER_REQUEST:
    'groups/APPROVE_SINGLE_COMMUNITY_MEMBER_REQUEST',
  DECLINE_SINGLE_COMMUNITY_MEMBER_REQUEST:
    'groups/DECLINE_SINGLE_COMMUNITY_MEMBER_REQUEST',
  APPROVE_ALL_COMMUNITY_MEMBER_REQUESTS:
    'groups/APPROVE_ALL_COMMUNITY_MEMBER_REQUESTS',
  DECLINE_ALL_COMMUNITY_MEMBER_REQUESTS:
    'groups/DECLINE_ALL_COMMUNITY_MEMBER_REQUESTS',
  STORE_UNDO_COMMUNITY_MEMBER_REQUESTS:
    'groups/STORE_UNDO_COMMUNITY_MEMBER_REQUESTS',
  UNDO_DECLINED_COMMUNITY_MEMBER_REQUESTS:
    'groups/UNDO_DECLINED_COMMUNITY_MEMBER_REQUESTS',
};

export default groupsTypes;
