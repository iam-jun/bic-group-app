const groupsTypes = {
  // CHECKING PERMISSIONS
  GET_MY_PERMISSIONS: 'groups/GET_MY_PERMISSIONS',
  SET_MY_PERMISSIONS: 'groups/SET_MY_PERMISSIONS',

  //GROUP STRUCTURE SETTINGS
  SET_GROUP_STRUCTURE: 'groups/SET_GROUP_STRUCTURE',
  GET_GROUP_STRUCTURE_COMMUNITY_TREE:
    'groups/GET_GROUP_STRUCTURE_COMMUNITY_TREE',
  SET_GROUP_STRUCTURE_COMMUNITY_TREE:
    'groups/SET_GROUP_STRUCTURE_COMMUNITY_TREE',
  SET_GROUP_STRUCTURE_REORDER: 'groups/SET_GROUP_STRUCTURE_REORDER',
  PUT_GROUP_STRUCTURE_REORDER: 'groups/PUT_GROUP_STRUCTURE_REORDER',
  SET_GROUP_STRUCTURE_MOVE: 'groups/GET_GROUP_STRUCTURE_MOVE',
  GET_GROUP_STRUCTURE_MOVE_TARGETS: 'groups/GET_GROUP_STRUCTURE_MOVE_TARGETS',
  PUT_GROUP_STRUCTURE_MOVE_TO_TARGET:
    'groups/PUT_GROUP_STRUCTURE_MOVE_TO_TARGET',
  SET_GROUP_STRUCTURE_MOVE_SELECTING:
    'groups/SET_GROUP_STRUCTURE_MOVE_SELECTING',
  PUT_GROUP_STRUCTURE_COLLAPSE_STATUS: 'PUT_GROUP_STRUCTURE_COLLAPSE_STATUS',

  //PERMISSION SCHEME
  GET_PERMISSION_CATEGORIES: 'groups/GET_PERMISSION_CATEGORIES',
  SET_PERMISSION_CATEGORIES: 'groups/SET_PERMISSION_CATEGORIES',
  GET_SYSTEM_SCHEME: 'groups/GET_SYSTEM_SCHEME',
  SET_SYSTEM_SCHEME: 'groups/SET_SYSTEM_SCHEME',
  SET_CREATING_SCHEME: 'groups/SET_CREATING_SCHEME',
  SET_CREATING_SCHEME_DATA: 'groups/SET_CREATING_SCHEME_DATA',
  UPDATE_CREATING_SCHEME_PERMISSION: 'groups/UPDATE_CREATING_SCHEME_PERMISSION',
  POST_CREATE_SCHEME_PERMISSION: 'groups/POST_CREATE_SCHEME_PERMISSION',
  GET_COMMUNITY_SCHEME: 'groups/GET_COMMUNITY_SCHEME',
  SET_COMMUNITY_SCHEME: 'groups/SET_COMMUNITY_SCHEME',
  UPDATE_COMMUNITY_SCHEME: 'groups/UPDATE_COMMUNITY_SCHEME',
  DELETE_COMMUNITY_SCHEME: 'groups/DELETE_COMMUNITY_SCHEME',
  GET_SCHEMES: 'groups/GET_SCHEMES',
  SET_SCHEMES: 'groups/SET_SCHEMES',
  GET_GROUP_SCHEME_ASSIGNMENTS: 'groups/GET_GROUP_SCHEME_ASSIGNMENTS',
  SET_GROUP_SCHEME_ASSIGNMENTS: 'groups/SET_GROUP_SCHEME_ASSIGNMENTS',
  PUT_GROUP_SCHEME_ASSIGNMENTS: 'groups/PUT_GROUP_SCHEME_ASSIGNMENTS',
  SET_GROUP_SCHEME_ASSIGNING: 'groups/SET_GROUP_SCHEME_ASSIGNING',
  GET_GROUP_SCHEME: 'groups/GET_GROUP_SCHEME',
  SET_GROUP_SCHEME: 'groups/SET_GROUP_SCHEME',
  UPDATE_GROUP_SCHEME: 'groups/UPDATE_GROUP_SCHEME',

  CLEAR_GROUP_MEMBER: 'groups/CLEAR_GROUP_MEMBER',
  SET_GROUP_MEMBER: 'groups/SET_GROUP_MEMBER',
  GET_GROUP_MEMBER: 'groups/GET_GROUP_MEMBER',
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

  GET_GROUP_MEMBER_REQUESTS: 'groups/GET_GROUP_MEMBER_REQUESTS',
  SET_GROUP_MEMBER_REQUESTS: 'groups/SET_GROUP_MEMBER_REQUESTS',
  RESET_GROUP_MEMBER_REQUESTS: 'groups/RESET_GROUP_MEMBER_REQUESTS',
  STORE_UNDO_GROUP_MEMBER_REQUESTS: 'groups/STORE_UNDO_GROUP_MEMBER_REQUESTS',
  UNDO_DECLINED_GROUP_MEMBER_REQUESTS:
    'groups/UNDO_DECLINED_GROUP_MEMBER_REQUESTS',
  APPROVE_SINGLE_GROUP_MEMBER_REQUEST:
    'groups/APPROVE_SINGLE_GROUP_MEMBER_REQUEST',
  APPROVE_ALL_GROUP_MEMBER_REQUESTS: 'groups/APPROVE_ALL_GROUP_MEMBER_REQUESTS',
  DECLINE_SINGLE_GROUP_MEMBER_REQUEST:
    'groups/DECLINE_SINGLE_GROUP_MEMBER_REQUEST',
  DECLINE_ALL_GROUP_MEMBER_REQUESTS: 'groups/DECLINE_ALL_GROUP_MEMBER_REQUESTS',
  EDIT_GROUP_MEMBER_REQUEST: 'groups/EDIT_GROUP_MEMBER_REQUEST',

  // COMMUNITY
  GET_JOINED_COMMUNITIES: 'groups/GET_JOINED_COMMUNITIES',
  SET_JOINED_COMMUNITIES: 'groups/SET_JOINED_COMMUNITIES',
  GET_MANAGED_COMMUNITIES: 'groups/GET_MANAGED_COMMUNITIES',
  SET_MANAGED_COMMUNITIES: 'groups/SET_MANAGED_COMMUNITIES',
  GET_DISCOVER_COMMUNITIES: 'groups/GET_DISCOVER_COMMUNITIES',
  SET_DISCOVER_COMMUNITIES: 'groups/SET_DISCOVER_COMMUNITIES',
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
  EDIT_DISCOVER_GROUP_ITEM: 'groups/EDIT_DISCOVER_GROUP_ITEM',
  JOIN_COMMUNITY: 'groups/JOIN_COMMUNITY',
  CANCEL_JOIN_COMMUNITY: 'groups/CANCEL_JOIN_COMMUNITY',
  EDIT_DISCOVER_COMMUNITY_ITEM: 'groups/EDIT_DISCOVER_COMMUNITY_ITEM',
  GET_COMMUNITY_SEARCH: 'groups/GET_COMMUNITY_SEARCH',
  SET_COMMUNITY_SEARCH: 'groups/SET_COMMUNITY_SEARCH',
  RESET_COMMUNITY_SEARCH: 'groups/RESET_COMMUNITY_SEARCH',

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
  EDIT_COMMUNITY_MEMBER_REQUEST: 'groups/EDIT_COMMUNITY_MEMBER_REQUEST',
  EDIT_COMMUNITY_DETAIL: 'groups/EDIT_COMMUNITY_DETAIL',
};

export default groupsTypes;
