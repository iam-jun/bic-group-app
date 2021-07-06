export const options = {
  DIRECT_MESSAGE: 'direct_message',
  VIEW_PROFILE: 'view_profile',
  REPORT: 'report',
};

export default [
  {
    type: options.DIRECT_MESSAGE,
    title: 'Reply',
    icon: 'iconChat',
  },
  {
    type: options.VIEW_PROFILE,
    title: 'View profile',
    icon: 'iconUserCircle',
  },
  {
    type: options.REPORT,
    title: 'Report',
    icon: 'iconReport',
  },
];
