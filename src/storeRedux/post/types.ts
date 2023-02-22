const postTypes = {
  SET_POST_AUDIENCES_BOTTOM_SHEET: 'post/SET_POST_AUDIENCES_BOTTOM_SHEET',
  HIDE_POST_AUDIENCES_BOTTOM_SHEET: 'post/HIDE_POST_AUDIENCES_BOTTOM_SHEET',
  SET_USERS_SEEN_POST: 'post/SET_USERS_SEEN_POST',

  // create post
  CLEAR_CREATE_POST: '/post/CLEAR_CREATE_POST',
  SET_CREATE_POST_DATA: 'post/SET_CREATE_POST_DATA',
  SET_CREATE_POST_DATA_IMAGES: 'post/SET_CREATE_POST_DATA_IMAGES',
  SET_CREATE_POST_CHOSEN_AUDIENCES: 'post/SET_CREATE_POST_CHOSEN_AUDIENCES',
  SET_CREATE_POST_IMPORTANT: 'post/SET_CREATE_POST_IMPORTANT',
  SET_CREATE_POST_IMAGES: 'post/SET_CREATE_POST_IMAGES',
  SET_CREATE_POST_IMAGES_DRAFT: 'post/SET_CREATE_POST_IMAGES_DRAFT',
  SET_CREATE_POST_VIDEO: 'post/SET_CREATE_POST_VIDEO',
  SET_CREATE_POST_FILES: 'post/SET_CREATE_POST_FILES',
  SET_CREATE_POST_FILE: 'post/SET_CREATE_POST_FILE',
  ADD_CREATE_POST_FILES: 'post/ADD_CREATE_POST_FILES',
  REMOVE_CREATE_POST_FILE: 'post/REMOVE_CREATE_POST_FILE',
  SET_CREATE_POST_SETTINGS: 'post/SET_CREATE_POST_SETTINGS',
  SET_CREATE_POST_INIT_AUDIENCES: 'post/SET_CREATE_POST_INIT_AUDIENCES',
  SET_CREATE_POST_CURRENT_SETTINGS: 'post/SET_CREATE_POST_CURRENT_SETTINGS',
  SET_SAVING_DRAFT_POST: 'post/SET_SAVING_DRAFT_POST',
  // post detail
  SET_POST_DETAIL_REPLYING_COMMENT: 'post/SET_POST_DETAIL_REPLYING_COMMENT',
  SET_POST_SELECT_AUDIENCE_STATE: 'post/SET_POST_SELECT_AUDIENCE_STATE',

  // saga
  SET_SCROLL_TO_LATEST_ITEM: 'post/SET_SCROLL_TO_LATEST_ITEM',
  REMOVE_POST_AUDIENCES: 'post/REMOVE_POST_AUDIENCES',
  GET_POST_DETAIL: 'post/GET_POST_DETAIL',
  POST_PUBLISH_DRAFT_POST: 'post/POST_PUBLISH_DRAFT_POST',
  PUT_EDIT_DRAFT_POST: 'PUT_EDIT_DRAFT_POST',
  GET_CREATE_POST_INIT_AUDIENCES: 'post/GET_CREATE_POST_INIT_AUDIENCES',
  SET_SCROLL_TO_COMMENTS_POSITION: 'post/SET_SCROLL_TO_COMMENTS_POSITION',

  LOADING_GET_POST_DETAIL: 'post/LOADING_GET_POST_DETAIL',
  SET_COMMENT_ERROR_CODE: 'post/SET_COMMENT_ERROR_CODE',

  UPDATE_LINK_PREVIEW: 'post/UPDATE_LINK_PREVIEW',
};

export default postTypes;
