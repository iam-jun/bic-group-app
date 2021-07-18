const commonActions = {
  reactionComment: 'reaction-comment',
  reactionLike: 'reaction-like',
  reactionShare: 'reaction-share',
  openCamera: 'open-camera',
  openFilePicker: 'open-file-picker',
  replyComment: 'reply-comment',
  emojiCommentReact: 'emoji-comment-react',
  openPostOption: 'open-post-option',
  checkBox: 'check-box',
  uncheckBox: 'uncheck-box',
  removeTag: 'remove-tag',
  scrollToBottom: 'scroll-to-bottom',
};

export type IAction = keyof typeof commonActions;

export default commonActions;
