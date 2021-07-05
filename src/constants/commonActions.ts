const commonActions = {
  reactionComment: 'reaction-comment',
  reactionLike: 'reaction-like',
  reactionShare: 'reaction-share',
  openCamera: 'open-camera',
  openFilePicker: 'open-file-picker',
  replyComment: 'reply-comment',
  emojiCommentReact: 'emoji-comment-react',
  openPostOption: 'open-post-option',
};

export type IAction = keyof typeof commonActions;

export default commonActions;
