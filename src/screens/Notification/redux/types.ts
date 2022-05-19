const notificationsTypes = {
  SET_NOTIFICATIONS: 'notifications/SET_NOTIFICATIONS',
  ADD_NEW_NOTIFICATIONS: 'notifications/ADD_NEW_NOTIFICATIONS',
  SET_LOADING_NOTIFICATIONS: 'notifications/SET_LOADING_NOTIFICATIONS',
  CONCAT_NOTIFICATIONS: 'notifications/CONCAT_NOTIFICATIONS',
  SET_NO_MORE_NOTIFICATION: 'notifications/SET_NO_MORE_NOTIFICATION',
  SET_IS_LOADING_MORE: 'notifications/SET_IS_LOADING_MORE',

  GET_NOTIFICATIONS: 'notifications/GET_NOTIFICATIONS',
  MARK_AS_READ_ALL: 'notifications/MARK_AS_READ_ALL',
  MARK_AS_SEEN_ALL: 'notifications/MARK_AS_SEEN_ALL',
  MARK_AS_READ: 'notifications/MARK_AS_READ',
  LOAD_MORE: 'notifications/LOAD_MORE',
  ATTACH: 'notifications/ATTACH',
  DETACH: 'notifications/DETACH',
  UPDATE: 'notifications/UPDATE',

  // For Firebase
  REGISTER_PUSH_TOKEN: 'notifications/REGISTER_PUSH_TOKEN',
  SAVE_PUSH_TOKEN: 'notifications/SAVE_PUSH_TOKEN',
};

export default notificationsTypes;
