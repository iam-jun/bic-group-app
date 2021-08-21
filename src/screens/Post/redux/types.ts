const postTypes = {
  SET_ALL_POSTS: 'post/SET_ALL_POSTS',
  SET_OPEN_POST_TOOLBAR_MODAL: '/post/SET_OPEN_POST_TOOLBAR_MODAL',
  SET_POST_AUDIENCES_BOTTOM_SHEET: 'post/SET_POST_AUDIENCES_BOTTOM_SHEET',
  HIDE_POST_AUDIENCES_BOTTOM_SHEET: 'post/HIDE_POST_AUDIENCES_BOTTOM_SHEET',
  SET_SHOW_REACTION_BOTTOM_SHEET: 'post/SET_SHOW_REACTION_BOTTOM_SHEET',
  //create post
  SET_LOADING_CREATE_POST: '/post/SET_LOADING_CREATE_POST',
  CLEAR_CREATE_POST: '/post/CLEAR_CREATE_POST',
  SET_CREATE_POST_DATA: 'post/SET_CREATE_POST_DATA',
  SET_CREATE_POST_CHOSEN_AUDIENCES: 'post/SET_CREATE_POST_CHOSEN_AUDIENCES',
  SET_CREATE_POST_IMPORTANT: 'post/SET_CREATE_POST_IMPORTANT',
  //create post select audiences
  SET_SEARCH_RESULT_AUDIENCE_GROUPS: 'post/SET_SEARCH_RESULT_AUDIENCE_GROUPS',
  SET_SEARCH_RESULT_AUDIENCE_USERS: 'post/SET_SEARCH_RESULT_AUDIENCE_USERS',
  //post detail
  SET_POST_DETAIL: 'post/SET_POST_DETAIL',
  SET_POST_DETAIL_REPLYING_COMMENT: 'post/SET_POST_DETAIL_REPLYING_COMMENT',
  //mention
  SET_MENTION_SEARCH_KEY: 'post/SET_MENTION_SEARCH_KEY',
  SET_MENTION_SEARCH_RESULT: 'post/SET_MENTION_SEARCH_RESULT',
  //comment
  SET_ALL_COMMENTS_BY_PARENT_IDS: 'post/SET_ALL_COMMENTS_BY_PARENT_IDS',

  //saga
  SHOW_POST_AUDIENCES_BOTTOM_SHEET: 'post/SHOW_POST_AUDIENCES_BOTTOM_SHEET',
  POST_CREATE_NEW_POST: 'post/POST_CREATE_NEW_POST',
  PUT_EDIT_POST: 'post/PUT_EDIT_POST',
  DELETE_POST: 'post/DELETE_POST',
  ADD_TO_ALL_POSTS: 'post/ADD_TO_ALL_POSTS',
  GET_SEARCH_MENTION_AUDIENCES: 'post/GET_SEARCH_MENTION_AUDIENCES',
  POST_REACT_TO_POST: 'post/POST_REACT_TO_POST',
  DELETE_REACT_TO_POST: 'post/DELETE_REACT_TO_POST',
  POST_REACT_TO_COMMENT: 'post/POST_REACT_TO_COMMENT',
  DELETE_REACT_TO_COMMENT: 'post/DELETE_REACT_TO_COMMENT',
  UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS:
    'post/UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS',
  GET_COMMENTS_BY_IDS: 'post/GET_COMMENTS_BY_IDS',
};

export default postTypes;
