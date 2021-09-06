const postTypes = {
  SET_ALL_POSTS: 'post/SET_ALL_POSTS',
  SET_ALL_COMMENTS: 'post/SET_ALL_COMMENTS',
  SET_OPEN_POST_TOOLBAR_MODAL: '/post/SET_OPEN_POST_TOOLBAR_MODAL',
  SET_POST_AUDIENCES_BOTTOM_SHEET: 'post/SET_POST_AUDIENCES_BOTTOM_SHEET',
  HIDE_POST_AUDIENCES_BOTTOM_SHEET: 'post/HIDE_POST_AUDIENCES_BOTTOM_SHEET',
  SET_SHOW_REACTION_BOTTOM_SHEET: 'post/SET_SHOW_REACTION_BOTTOM_SHEET',
  //create post
  SET_LOADING_CREATE_POST: '/post/SET_LOADING_CREATE_POST',
  CLEAR_CREATE_POST: '/post/CLEAR_CREATE_POST',
  SET_CREATE_POST_DATA: 'post/SET_CREATE_POST_DATA',
  SET_CREATE_COMMENT: 'post/SET_CREATE_COMMENT',
  SET_CREATE_POST_CHOSEN_AUDIENCES: 'post/SET_CREATE_POST_CHOSEN_AUDIENCES',
  SET_CREATE_POST_IMPORTANT: 'post/SET_CREATE_POST_IMPORTANT',
  //create post select audiences
  SET_SEARCH_RESULT_AUDIENCE_GROUPS: 'post/SET_SEARCH_RESULT_AUDIENCE_GROUPS',
  SET_SEARCH_RESULT_AUDIENCE_USERS: 'post/SET_SEARCH_RESULT_AUDIENCE_USERS',
  //post detail
  SET_POST_DETAIL: 'post/SET_POST_DETAIL',
  SET_POST_DETAIL_REPLYING_COMMENT: 'post/SET_POST_DETAIL_REPLYING_COMMENT',
  //comment
  SET_ALL_COMMENTS_BY_PARENT_IDS: 'post/SET_ALL_COMMENTS_BY_PARENT_IDS',

  //saga
  SHOW_POST_AUDIENCES_BOTTOM_SHEET: 'post/SHOW_POST_AUDIENCES_BOTTOM_SHEET',
  POST_CREATE_NEW_POST: 'post/POST_CREATE_NEW_POST',
  POST_CREATE_NEW_COMMENT: 'post/POST_CREATE_NEW_COMMENT',
  PUT_EDIT_POST: 'post/PUT_EDIT_POST',
  PUT_EDIT_COMMENT: 'post/PUT_EDIT_COMMENT',
  DELETE_POST: 'post/DELETE_POST',
  ADD_TO_ALL_POSTS: 'post/ADD_TO_ALL_POSTS',
  ADD_TO_ALL_COMMENTS: 'post/ADD_TO_ALL_COMMENTS',
  POST_REACT_TO_POST: 'post/POST_REACT_TO_POST',
  DELETE_REACT_TO_POST: 'post/DELETE_REACT_TO_POST',
  POST_REACT_TO_COMMENT: 'post/POST_REACT_TO_COMMENT',
  DELETE_REACT_TO_COMMENT: 'post/DELETE_REACT_TO_COMMENT',
  UPDATE_ALL_COMMENTS_BY_PARENT_IDS: 'post/UPDATE_ALL_COMMENTS_BY_PARENT_IDS',
  UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS:
    'post/UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS',
  GET_COMMENTS_BY_POST_ID: 'post/GET_COMMENTS_BY_POST_ID',
  GET_POST_DETAIL: 'post/GET_POST_DETAIL',
};

export default postTypes;
