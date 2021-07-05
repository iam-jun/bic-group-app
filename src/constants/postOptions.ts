export const options = {
  NOTIFICATION: 'notification',
  HIDE: 'hide',
  EDIT: 'edit',
  DELETE: 'delete',
};

export default [
  {
    type: options.NOTIFICATION,
    title: 'Turn on notifications for this post',
    icon: 'iconNotification',
  },
  {
    type: options.HIDE,
    title: 'Hide post',
    icon: 'iconEyeOff',
  },
  {
    type: options.EDIT,
    title: 'Edit post',
    icon: 'iconEdit',
  },
  {
    type: options.DELETE,
    title: 'Delete post',
    icon: 'iconDelete',
  },
];
